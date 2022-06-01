export const createParametizedValueString = (length: number) => (
  [...Array(length).keys()].map(i => `$${++i}`).join(', ')
)
