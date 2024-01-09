import { scrapeRoundStats } from "./scrapers/playerstats";

const [_nodeExecutable, _filePath, year, round, fromPlayerId] = [...process.argv]

scrapeRoundStats(Number(year), round, fromPlayerId)
