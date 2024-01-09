import { PLAYER_TABLE, query } from './database/db';

const [_nodeExecutable, _filePath, playerId] = [...process.argv]

export const readPlayer = async (id: string) => {
  query(`SELECT * FROM ${PLAYER_TABLE} WHERE id = '${id}';`).then((res) => {
    console.log(res.rows[0])
  }).catch((err) => {
    console.error(err)
  })
}

readPlayer(playerId)
