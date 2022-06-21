import { BASE_AFL_TABLES_URL, PLAYER_STATS_PATH } from "../constants/url"

export type RoundStats = {
  playerid: string,
  game: number,
  team: string,
  opponent: string,
  roundnumber: string,
  year: number,
  result: string,
  jumpernumber: number,
  kicks: number,
  marks: number,
  handballs: number,
  disposals: number,
  goals: number,
  behinds: number,
  hitouts: number,
  tackles: number,
  rebound50s: number,
  inside50s: number,
  clearances: number,
  clangers: number,
  freekicksfor: number,
  freekicksagainst: number,
  brownlowvotes: number,
  contestedpossessions: number,
  uncontestedpossessions: number,
  contestedmarks: number,
  marksinside50: number,
  onepercenters: number,
  bounces: number,
  goalassists: number,
  timeongroundpercentage: number,
  fantasypoints: number,
}

export const playerIdToLink = (playerId: string): string => {
  const initial = playerId.charAt(0).toUpperCase()
  return `${BASE_AFL_TABLES_URL}${PLAYER_STATS_PATH}/${initial}/${playerId}.html`
}

export const parseSanitizedNumberFromString = (input: string) => {
  return Number(input.replace(/\D/g,''))
}

export const rawDataToRoundStats = (data: string[], playerId: string, team: string, year: number): RoundStats => {
  const roundStats = {
    playerid: playerId,
    game: parseSanitizedNumberFromString(data[0]),
    opponent: data[1],
    roundnumber: data[2],
    result: data[3],
    jumpernumber: parseSanitizedNumberFromString(data[4]),
    kicks: parseSanitizedNumberFromString(data[5]),
    marks: parseSanitizedNumberFromString(data[6]),
    handballs: parseSanitizedNumberFromString(data[7]),
    disposals: parseSanitizedNumberFromString(data[8]),
    goals: parseSanitizedNumberFromString(data[9]),
    behinds: parseSanitizedNumberFromString(data[10]),
    hitouts: parseSanitizedNumberFromString(data[11]),
    tackles: parseSanitizedNumberFromString(data[12]),
    rebound50s: parseSanitizedNumberFromString(data[13]),
    inside50s: parseSanitizedNumberFromString(data[14]),
    clearances: parseSanitizedNumberFromString(data[15]),
    clangers: parseSanitizedNumberFromString(data[16]),
    freekicksfor: parseSanitizedNumberFromString(data[17]),
    freekicksagainst: parseSanitizedNumberFromString(data[18]),
    brownlowvotes: parseSanitizedNumberFromString(data[19]),
    contestedpossessions: parseSanitizedNumberFromString(data[20]),
    uncontestedpossessions: parseSanitizedNumberFromString(data[21]),
    contestedmarks: parseSanitizedNumberFromString(data[22]),
    marksinside50: parseSanitizedNumberFromString(data[23]),
    onepercenters: parseSanitizedNumberFromString(data[24]),
    bounces: parseSanitizedNumberFromString(data[25]),
    goalassists: parseSanitizedNumberFromString(data[26]),
    timeongroundpercentage: parseSanitizedNumberFromString(data[27]),
    team,
    year,
    fantasypoints: 0
  }

  roundStats.fantasypoints = calculateFantasyPoints(roundStats)

  return roundStats
}

export const roundStatsToPostgres = (stats: RoundStats) => ([
  stats.playerid,
  stats.game,
  stats.team,
  stats.opponent,
  stats.roundnumber,
  stats.year,
  stats.result,
  stats.jumpernumber,
  stats.kicks,
  stats.marks,
  stats.handballs,
  stats.disposals,
  stats.goals,
  stats.behinds,
  stats.hitouts,
  stats.tackles,
  stats.rebound50s,
  stats.inside50s,
  stats.clearances,
  stats.clangers,
  stats.freekicksfor,
  stats.freekicksagainst,
  stats.brownlowvotes,
  stats.contestedpossessions,
  stats.uncontestedpossessions,
  stats.contestedmarks,
  stats.marksinside50,
  stats.onepercenters,
  stats.bounces,
  stats.goalassists,
  stats.timeongroundpercentage,
  stats.fantasypoints,
])

export const calculateFantasyPoints = (roundStats: RoundStats) => {
  const kickPoints = roundStats.kicks * 3
  const handballPoints = roundStats.handballs * 2
  const markPoints = roundStats.marks * 3
  const tacklePoints = roundStats.tackles * 4
  const freeForPoints = roundStats.freekicksfor
  const freeAgainstPoints = roundStats.freekicksagainst * -3
  const hitoutPoints = roundStats.hitouts
  const goalPoints = roundStats.goals * 6
  const behindPoints = roundStats.behinds

  return kickPoints + handballPoints + markPoints + tacklePoints + freeForPoints +
    freeAgainstPoints + hitoutPoints + goalPoints + behindPoints
}
