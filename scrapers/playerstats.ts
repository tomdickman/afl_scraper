import 'dotenv/config'
import puppeteer from 'puppeteer'
import { DateTime } from 'luxon'

import { getPlayerLinks } from './playerlinks'
import { query } from '../database/db'
import { playerIdToLink, rawDataToRoundStats, RoundStats, roundStatsToPostgres } from '../utils/player'
import { playerYearStatsTableHeaderMatcher } from '../utils/regex'

type AnnualStats = {
  team: string,
  year: string,
  table: puppeteer.ElementHandle,
  roundStats: RoundStats[]
}

export const scrapePlayerStats = async (id: string) => {
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
      const roundStats = rawDataToRoundStats(rowStats)
      annualStatsTable.roundStats.push(roundStats)
      const values = [id, ...(roundStatsToPostgres(roundStats))]

      await query(`INSERT INTO roundStats (
        playerid,
        game,
        opponent,
        roundNumber,
        result,
        jumperNumber,
        kicks,
        marks,
        handballs,
        disposals,
        goals,
        behinds,
        hitouts,
        tackles,
        rebound50s,
        inside50s,
        clearances,
        clangers,
        freekicksFor,
        freekicksAgainst,
        brownlowVotes,
        contestedPossessions,
        uncontestedPossessions,
        contestedMarks,
        marksInside50,
        onepercenters,
        bounces,
        goalAssists,
        timeOnGroundPercentage
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        $20,
        $21,
        $22,
        $23,
        $24,
        $25,
        $26,
        $27,
        $28,
        $29
      ) RETURNING *;`, values)
    }
  }

  browser.close()
}

export const scrapeCurrent = async () => {
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
      await query(`INSERT INTO player (id, givenname, familyname, birthdate) VALUES ($1, $2, $3, $4);`, values)
    } catch(error) {
      console.log(error)
    }
  }

  await browser.close()
}

export const scrapeAll = async (from = 2022, to = 2022) => {
  const players: string[] = [];

  for (let year = from; year <= to; year++) {
    const playerLinks = await getPlayerLinks(year)
    playerLinks.forEach(link => {
      const found = players.find(player => player === link)
      if (!found) players.push(link)
    })
  }

  console.log(players.length);
  console.log(players);
}