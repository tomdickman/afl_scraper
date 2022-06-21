import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import {
  DynamoDBClient,
  DynamoDBClientConfig,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'

import { RoundStats } from '../utils/player'
import { roundStatsToDynamoItem } from '../utils/dynamodb'

export const getDynamoDBClientConfig = (): DynamoDBClientConfig => {
  const config: DynamoDBClientConfig = { apiVersion: '2012-08-10' }

  if (process.env.IS_LOCAL && process.env.AWS_DYNAMODB_ENDPOINT) {
    config.endpoint = process.env.AWS_DYNAMODB_ENDPOINT
  }

  return config
}

export const exportRoundStats = async (roundStats: RoundStats) => {
  const dynamoDBClient = new DynamoDBClient(getDynamoDBClientConfig())
  const db = DynamoDBDocumentClient.from(dynamoDBClient)

  const item = roundStatsToDynamoItem(roundStats)
  console.log(item)

  try {
    await db.send(new PutItemCommand({
      TableName: process.env.ROUNDSTATS_TABLE_NAME,
      Item: item,
    }))
    console.log(`Round stats '${roundStats.playerid}' game #${roundStats.game} exported to Dynamo DB`)

    return roundStats
  } catch (err) {
    console.log(`Round stats '${roundStats.playerid}' game #${roundStats.game} export to Dynamo DB failed`)
  }


}