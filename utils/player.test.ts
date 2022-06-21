import { calculateFantasyPoints, parseSanitizedNumberFromString, RoundStats } from "./player"

describe('parseSanitizedNumberFromString', () => {
  test('creates a valid number from a string', () => {
    expect(parseSanitizedNumberFromString('35')).toEqual(35)
    expect(parseSanitizedNumberFromString('35↑')).toEqual(35)
    expect(parseSanitizedNumberFromString('nonumber')).toStrictEqual(0)
  })
})

describe('calculateFantasyPoints', () => {
  let roundStats: RoundStats

  beforeEach(() => {
    roundStats = {
      playerid: "",
      game: 0,
      team: "",
      opponent: "",
      roundnumber: "",
      year: 0,
      result: "",
      jumpernumber: 0,
      kicks: 0,
      marks: 0,
      handballs: 0,
      disposals: 0,
      goals: 0,
      behinds: 0,
      hitouts: 0,
      tackles: 0,
      rebound50s: 0,
      inside50s: 0,
      clearances: 0,
      clangers: 0,
      freekicksfor: 0,
      freekicksagainst: 0,
      brownlowvotes: 0,
      contestedpossessions: 0,
      uncontestedpossessions: 0,
      contestedmarks: 0,
      marksinside50: 0,
      onepercenters: 0,
      bounces: 0,
      goalassists: 0,
      timeongroundpercentage: 0,
      fantasypoints: 0
    }
  })

  test('correctly calculates zero fantasy scores', () => {
    expect(calculateFantasyPoints(roundStats)).toEqual(0)
  })

  test('correctly calculates negative fantasy scores', () => {
    roundStats.freekicksagainst = 3

    expect(calculateFantasyPoints(roundStats)).toEqual(-9)
  })

  test('correctly calculates fantasy scores', () => {
    roundStats.kicks = 2 // 6
    roundStats.handballs = 4 // 8
    roundStats.marks = 3 // 9
    roundStats.tackles = 3 // 12
    roundStats.freekicksfor = 4 // 4
    roundStats.freekicksagainst = 3 // -9
    roundStats.hitouts = 12 // 12
    roundStats.goals = 1 // 6
    roundStats.behinds = 3 // 3

    expect(calculateFantasyPoints(roundStats)).toEqual(51)
  })
})