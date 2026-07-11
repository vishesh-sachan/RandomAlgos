import { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react'
import type { QueensRegions } from '../types/queens'

type QueensContextType = {
  regions: QueensRegions
  setRegions: Dispatch<SetStateAction<QueensRegions>>
  boardSize: number
  setBoardSize: Dispatch<SetStateAction<number>>
}

const QueensContext = createContext<QueensContextType | null>(null)

export function QueensProvider({ children }: { children: ReactNode }) {
  const [regions, setRegions] = useState<QueensRegions>({})
  const [boardSize, setBoardSize] = useState(7)

  return (
    <QueensContext.Provider value={{ regions, setRegions, boardSize, setBoardSize }}>
      {children}
    </QueensContext.Provider>
  )
}

export function useQueens() {
  const ctx = useContext(QueensContext)
  if (!ctx) throw new Error('useQueens must be used within a QueensProvider')
  return ctx
}
