export type QueensStackEntry = {
  action: "place" | "backtrack"
  queen: [number, number]
  region: string
  blocked?: [number, number][]
  unblocked?: [number, number][]
}

export type QueensSolveResponse = {
  status: "solved" | "unsolvable"
  stack: QueensStackEntry[]
  solution: [number, number][]
}

export type QueensCellState = {
  region: string | null
  queen: boolean
  blocked: boolean
}

export type QueensRegions = Record<string, [number, number][]>

export type QueensSolveRequest = {
  size: number
  regions: QueensRegions
}
