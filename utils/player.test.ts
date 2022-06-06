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
      game: 0,
      team: "",
      opponent: "",
      roundNumber: "",
      year: 0,
      result: "",
      jumperNumber: 0,
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
      freekicksFor: 0,
      freekicksAgainst: 0,
      brownlowVotes: 0,
      contestedPossessions: 0,
      uncontestedPossessions: 0,
      contestedMarks: 0,
      marksInside50: 0,
      onepercenters: 0,
      bounces: 0,
      goalAssists: 0,
      timeOnGroundPercentage: 0,
      fantasyPoints: 0
    }
  })

  test('correctly calculates zero fantasy scores', () => {
    expect(calculateFantasyPoints(roundStats)).toEqual(0)
  })

  test('correctly calculates negative fantasy scores', () => {
    roundStats.freekicksAgainst = 3

    expect(calculateFantasyPoints(roundStats)).toEqual(-9)
  })

  test('correctly calculates fantasy scores', () => {
    roundStats.kicks = 2 // 6
    roundStats.handballs = 4 // 8
    roundStats.marks = 3 // 9
    roundStats.tackles = 3 // 12
    roundStats.freekicksFor = 4 // 4
    roundStats.freekicksAgainst = 3 // -9
    roundStats.hitouts = 12 // 12
    roundStats.goals = 1 // 6
    roundStats.behinds = 3 // 3

    expect(calculateFantasyPoints(roundStats)).toEqual(51)
  })
})