import { createParametizedValueString } from './database'

describe('createParametizedValueString', () => {
  test('creates a string of parametized values', () => {
    expect(createParametizedValueString(3)).toEqual('$1, $2, $3')
  })
})
