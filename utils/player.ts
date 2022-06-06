import { BASE_AFL_TABLES_URL, PLAYER_STATS_PATH } from "../constants/url"

export type RoundStats = {
  game: number,
  team: string,
  opponent: string,
  roundNumber: string,
  year: number,
  result: string,
  jumperNumber: number,
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
  freekicksFor: number,
  freekicksAgainst: number,
  brownlowVotes: number,
  contestedPossessions: number,
  uncontestedPossessions: number,
  contestedMarks: number,
  marksInside50: number,
  onepercenters: number,
  bounces: number,
  goalAssists: number,
  timeOnGroundPercentage: number,
  fantasyPoints: number,
}

export const playerIdToLink = (playerId: string): string => {
  const initial = playerId.charAt(0).toUpperCase()
  return `${BASE_AFL_TABLES_URL}${PLAYER_STATS_PATH}/${initial}/${playerId}.html`
}

export const parseSanitizedNumberFromString = (input: string) => {
  return Number(input.replace(/\D/g,''))
}

export const rawDataToRoundStats = (data: string[], team: string, year: number): RoundStats => {
  const roundStats = {
    game: parseSanitizedNumberFromString(data[0]),
    opponent: data[1],
    roundNumber: data[2],
    result: data[3],
    jumperNumber: parseSanitizedNumberFromString(data[4]),
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
    freekicksFor: parseSanitizedNumberFromString(data[17]),
    freekicksAgainst: parseSanitizedNumberFromString(data[18]),
    brownlowVotes: parseSanitizedNumberFromString(data[19]),
    contestedPossessions: parseSanitizedNumberFromString(data[20]),
    uncontestedPossessions: parseSanitizedNumberFromString(data[21]),
    contestedMarks: parseSanitizedNumberFromString(data[22]),
    marksInside50: parseSanitizedNumberFromString(data[23]),
    onepercenters: parseSanitizedNumberFromString(data[24]),
    bounces: parseSanitizedNumberFromString(data[25]),
    goalAssists: parseSanitizedNumberFromString(data[26]),
    timeOnGroundPercentage: parseSanitizedNumberFromString(data[27]),
    team,
    year,
    fantasyPoints: 0
  }

  roundStats.fantasyPoints = calculateFantasyPoints(roundStats)

  return roundStats
}

export const roundStatsToPostgres = (stats: RoundStats) => ([
  stats.game,
  stats.team,
  stats.opponent,
  stats.roundNumber,
  stats.year,
  stats.result,
  stats.jumperNumber,
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
  stats.freekicksFor,
  stats.freekicksAgainst,
  stats.brownlowVotes,
  stats.contestedPossessions,
  stats.uncontestedPossessions,
  stats.contestedMarks,
  stats.marksInside50,
  stats.onepercenters,
  stats.bounces,
  stats.goalAssists,
  stats.timeOnGroundPercentage,
  stats.fantasyPoints,
])

export const calculateFantasyPoints = (roundStats: RoundStats) => {
  const kickPoints = roundStats.kicks * 3
  const handballPoints = roundStats.handballs * 2
  const markPoints = roundStats.marks * 3
  const tacklePoints = roundStats.tackles * 4
  const freeForPoints = roundStats.freekicksFor
  const freeAgainstPoints = roundStats.freekicksAgainst * -3
  const hitoutPoints = roundStats.hitouts
  const goalPoints = roundStats.goals * 6
  const behindPoints = roundStats.behinds

  return kickPoints + handballPoints + markPoints + tacklePoints + freeForPoints +
    freeAgainstPoints + hitoutPoints + goalPoints + behindPoints
}
