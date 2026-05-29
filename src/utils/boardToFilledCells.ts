import { type CellValue } from '../context/TangoContext'

export function boardToFilledCells(
  board: CellValue[][]
) {
  const result: Record<
    string,
    0 | 1
  > = {}

  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value !== null) {
        result[`(${r},${c})`] =
          value
      }
    })
  })

  return result
}