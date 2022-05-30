import 'dotenv/config'
import puppeteer from 'puppeteer';
import { DateTime } from 'luxon'

import { getPlayerLinks } from './playerlinks'
import { query } from '../database/db';

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