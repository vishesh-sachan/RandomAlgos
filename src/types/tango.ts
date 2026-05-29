export type CellValue = 0 | 1 | null

export type Position = [number, number]

export type Constraint = [
  Position,
  Position
]

export interface TangoRequest {
  filled_cells: Record<string, 0 | 1>

  equal_constraints: Constraint[]

  cross_constraints: Constraint[]
}

export interface TangoResponse {
  status: string

  stack: [
    number,
    number,
    CellValue
  ][]

  board: (0 | 1)[][]
}