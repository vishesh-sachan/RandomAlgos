import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'

export type CellValue = 0 | 1 | null

type Position = [number, number]

interface TangoContextType {
  board: CellValue[][]
  setBoard: React.Dispatch<
    React.SetStateAction<CellValue[][]>
  >

  equalConstraints: [Position, Position][]
  setEqualConstraints: React.Dispatch<
    React.SetStateAction<
      [Position, Position][]
    >
  >

  crossConstraints: [Position, Position][]
  setCrossConstraints: React.Dispatch<
    React.SetStateAction<
      [Position, Position][]
    >
  >
}

const TangoContext =
  createContext<TangoContextType | null>(
    null
  )

export function TangoProvider({
  children,
}: {
  children: ReactNode
}) {
  const [board, setBoard] = useState(
    Array.from({ length: 6 }, () =>
      Array(6).fill(null)
    )
  )

  const [
    equalConstraints,
    setEqualConstraints,
  ] = useState<
    [Position, Position][]
  >([])

  const [
    crossConstraints,
    setCrossConstraints,
  ] = useState<
    [Position, Position][]
  >([])

  return (
    <TangoContext.Provider
      value={{
        board,
        setBoard,
        equalConstraints,
        setEqualConstraints,
        crossConstraints,
        setCrossConstraints,
      }}
    >
      {children}
    </TangoContext.Provider>
  )
}

export function useTango() {
  const context =
    useContext(TangoContext)

  if (!context) {
    throw new Error(
      'useTango must be used inside TangoProvider'
    )
  }

  return context
}