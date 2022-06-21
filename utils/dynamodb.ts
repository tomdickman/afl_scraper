import { AttributeValue } from "@aws-sdk/client-dynamodb";
import { RoundStats } from "./player";

export const roundStatsToDynamoItem = (roundStats: RoundStats): { [attributeName: string]: AttributeValue } => ({
  playerid: {
    S: roundStats.playerid
  },
  game: {
    N: `${roundStats.game}`
  },
  team: {
    S: `${roundStats.team}`
  },
  opponent: {
    S: `${roundStats.opponent}`
  },
  roundnumber: {
    S: `${roundStats.roundnumber}`
  },
  year: {
    N: `${roundStats.year}`
  },
  result: {
    S: `${roundStats.result}`
  },
  jumpernumber: {
    N: `${roundStats.jumpernumber}`
  },
  kicks: {
    N: `${roundStats.kicks}`
  },
  marks: {
    N: `${roundStats.marks}`
  },
  handballs: {
    N: `${roundStats.handballs}`
  },
  disposals: {
    N: `${roundStats.disposals}`
  },
  goals: {
    N: `${roundStats.goals}`
  },
  behinds: {
    N: `${roundStats.behinds}`
  },
  hitouts: {
    N: `${roundStats.hitouts}`
  },
  tackles: {
    N: `${roundStats.tackles}`
  },
  rebound50s: {
    N: `${roundStats.rebound50s}`
  },
  inside50s: {
    N: `${roundStats.inside50s}`
  },
  clearances: {
    N: `${roundStats.clearances}`
  },
  clangers: {
    N: `${roundStats.clangers}`
  },
  freekicksfor: {
    N: `${roundStats.freekicksfor}`
  },
  freekicksagainst: {
    N: `${roundStats.freekicksagainst}`
  },
  brownlowvotes: {
    N: `${roundStats.brownlowvotes}`
  },
  contestedpossessions: {
    N: `${roundStats.contestedpossessions}`
  },
  uncontestedpossessions: {
    N: `${roundStats.uncontestedpossessions}`
  },
  contestedmarks: {
    N: `${roundStats.contestedmarks}`
  },
  marksinside50: {
    N: `${roundStats.marksinside50}`
  },
  onepercenters: {
    N: `${roundStats.onepercenters}`
  },
  bounces: {
    N: `${roundStats.bounces}`
  },
  goalassists: {
    N: `${roundStats.goalassists}`
  },
  timeongroundpercentage: {
    N: `${roundStats.timeongroundpercentage}`
  },
  fantasypoints: {
    N: `${roundStats.fantasypoints}`
  },
})
