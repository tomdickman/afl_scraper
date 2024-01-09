import 'dotenv/config'
import puppeteer from 'puppeteer'
import { DateTime } from 'luxon'

import { getPlayerLinks } from './playerlinks'
import { PLAYER_TABLE, query, ROUND_STATS_TABLE } from '../database/db'
import { playerIdToLink, rawDataToRoundStats, RoundStats, roundStatsToPostgres } from '../utils/player'
import { playerYearStatsTableHeaderMatcher } from '../utils/regex'
import { ROUND_STATS_FIELDS } from '../constants/roundStats'
import { createParametizedValueString } from '../utils/database'
import { exportRoundStats } from '../exporters/dynamodb'

type AnnualStats = {
  team: string,
  year: string,
  table: puppeteer.ElementHandle,
  roundStats: RoundStats[]
}

export const scrapePlayerStats = async (id: string, year?: number, round?: string) => {
  const url = playerIdToLink(id)
  console.log(url)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle2', })
  const tables = await page.$$('table')
  const annualStatsTables: AnnualStats[] = []
  for (let table of tables) {
    const heading = await table.$('th')
    const innerText = await heading?.getProperty('innerText')
    const value = await innerText?.jsonValue() as string
    if(playerYearStatsTableHeaderMatcher.test(value)) {
      const [team, year] = value.split(' - ')
      annualStatsTables.push({ team, year, table, roundStats: [] })
    }
  }

  for (let annualStatsTable of annualStatsTables) {
    const rows = await annualStatsTable.table.$$('tbody tr')
    for (let row of rows) {
      const rowData = await row.$$('td')
      const rowStats: string[] = []
      for (let data of rowData) {
        const rawData = await (await data.getProperty('innerText')).jsonValue()
        rowStats.push(rawData as string)
      }
      const roundStats = rawDataToRoundStats(rowStats, id, annualStatsTable.team, Number(annualStatsTable.year))

      // If using optional params, check that year and round are matching.
      if (!!year && (year !== roundStats.year)) continue
      if (!!round && (round !== roundStats.roundnumber)) continue

      annualStatsTable.roundStats.push(roundStats)
      const values = roundStatsToPostgres(roundStats)

      const queryString = `INSERT INTO
      ${ROUND_STATS_TABLE} (${ROUND_STATS_FIELDS.join(', ')})
      VALUES (${createParametizedValueString(32)})
      RETURNING *;`

      try {
        await query(queryString, values)
      } catch(error) {
        console.error(error)
        console.log(queryString)
        console.log(values)
      }

    }
  }

  browser.close()
}

export const scrapeCurrentPlayers = async () => {
  const year = DateTime.now().year
  // Grab first only for testing.
  const playerLinks = await getPlayerLinks(year)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  for (let playerLink of playerLinks) {
    const pagePath = playerLink.replace(/https:\/\/afltables.com\/afl\/stats\/players\/[A-Z]{1}\//, '')
    const playerId = pagePath.replace('.html', '')
    console.log(`Player ID: ${playerId}`)
    const fullName = playerId.replace(/_/, ' ').replace(/\d/, '')
    console.log(fullName)
    const [firstName, lastName] = fullName.split(' ')
    console.log(`Firstname: ${firstName}`)
    console.log(`Lastname: ${lastName}`)
    
    try {
      await page.goto(playerLink, { waitUntil: 'networkidle2', })
      const content = await page.content()
      const bornMatch = content.match(/<b>Born:<\/b>(\n)*\d{1,2}-\w{3}-\d{4}/)
      let dob = ''
      if (bornMatch) {
        const rawDob = bornMatch[0].replace('<b>Born:</b>', '').replace(/-/g, ' ')
        const formattedDob = DateTime.fromFormat(rawDob, "d MMM yyyy")
        dob = formattedDob.toISO()
      }
      console.log(`Player DOB w/ TZ: ${dob}`)

      const values = [playerId, firstName, lastName, dob]
      await query(`INSERT INTO ${PLAYER_TABLE} (id, givenname, familyname, birthdate) VALUES ($1, $2, $3, $4);`, values)
    } catch(error) {
      console.log(error)
    }
  }

  await browser.close()
}

export const exportToDynamo = async () => {
  const roundStats = await query(`SELECT * FROM ${ROUND_STATS_TABLE}`)
  for (let rowStats of roundStats.rows) {
    await exportRoundStats(rowStats as unknown as RoundStats)
  }
}

export const scrapeRoundStats = async (year: number, round: string, fromPlayerId?: string) => {
  const players = await query(`SELECT id FROM ${PLAYER_TABLE}`)
  const playerIds = players.rows.map(player => player.id)

  if (fromPlayerId) {
    const spliceIndex = playerIds.indexOf(fromPlayerId)
    if (spliceIndex >= 0) {
      playerIds.splice(0, spliceIndex)
    }
  }

  console.log(playerIds)

  for (let playerId of playerIds) {
    console.log(`Scraping ${playerId} stats for round ${round}, ${year}`)
    // Run async to block so we don't have too many browsers trying to run at once.
    await scrapePlayerStats(playerId, year, round)
  }
}

export const scrape = async () => {
  const players = await query(`SELECT id FROM ${PLAYER_TABLE}`)
  const playerIds = players.rows.map(player => player.id)

  for (let playerId of playerIds) {
    // Block so we don't have too many browsers trying to run at once.
    await scrapePlayerStats(playerId)
  }
}
