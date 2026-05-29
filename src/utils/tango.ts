import type { CellValue } from '../types/tango'

export function boardToFilledCells(
  board: CellValue[][]
) {
  const result: Record<string, 0 | 1> = {}

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const value = board[r][c]

      if (value !== null) {
        result[`(${r},${c})`] = value
      }
    }
  }

  return result
}