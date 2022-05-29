import 'dotenv/config'

import { getPlayerLinks } from './playerlinks';

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