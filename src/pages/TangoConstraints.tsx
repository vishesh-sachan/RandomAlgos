import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTango } from '../context/TangoContext'
import { useNavigate } from 'react-router-dom'
import { boardToFilledCells } from '../utils/boardToFilledCells'

type Mode = 'equal' | 'cross'

type Position = [number, number]

const GRID_SIZE = 6

function TangoConstraints() {
    const navigate = useNavigate()

    const [mode, setMode] = useState<Mode>('equal')
    const [isSolving, setIsSolving] = useState(false)

    const [selectedCell, setSelectedCell] =
        useState<Position | null>(null)

    const {
        board,
        equalConstraints,
        setEqualConstraints,
        crossConstraints,
        setCrossConstraints,
    } = useTango()

    const isAdjacent = (
        a: Position,
        b: Position
    ) => {
        const rowDiff = Math.abs(a[0] - b[0])
        const colDiff = Math.abs(a[1] - b[1])

        return rowDiff + colDiff === 1
    }
    const sameConstraint = (
        first: Position,
        second: Position,
        a: Position,
        b: Position
    ) => {
        return (
            (a[0] === first[0] &&
                a[1] === first[1] &&
                b[0] === second[0] &&
                b[1] === second[1]) ||
            (a[0] === second[0] &&
                a[1] === second[1] &&
                b[0] === first[0] &&
                b[1] === first[1])
        )
    }

    const createConstraint = (
        first: Position,
        second: Position
    ) => {
        if (!isAdjacent(first, second))
            return

        if (mode === 'equal') {
            const existing =
                equalConstraints.findIndex(
                    ([a, b]) =>
                        sameConstraint(
                            first,
                            second,
                            a,
                            b
                        )
                )

            if (existing !== -1) {
                setEqualConstraints(prev =>
                    prev.filter(
                        (_, i) => i !== existing
                    )
                )

                return
            }

            setEqualConstraints(prev => [
                ...prev,
                [first, second],
            ])
        }

        else {
            const existing =
                crossConstraints.findIndex(
                    ([a, b]) =>
                        sameConstraint(
                            first,
                            second,
                            a,
                            b
                        )
                )

            if (existing !== -1) {
                setCrossConstraints(prev =>
                    prev.filter(
                        (_, i) => i !== existing
                    )
                )

                return
            }

            setCrossConstraints(prev => [
                ...prev,
                [first, second],
            ])
        }
    }

    const handleCellClick = (
        row: number,
        col: number
    ) => {
        const current: Position = [row, col]

        if (!selectedCell) {
            setSelectedCell(current)
            return
        }

        createConstraint(selectedCell, current)

        setSelectedCell(null)
    }

    const getHorizontalConstraint = (
        row: number,
        col: number
    ) => {
        for (const [a, b] of equalConstraints) {
            if (
                a[0] === row &&
                b[0] === row &&
                ((a[1] === col && b[1] === col + 1) ||
                    (b[1] === col && a[1] === col + 1))
            ) {
                return '='
            }
        }

        for (const [a, b] of crossConstraints) {
            if (
                a[0] === row &&
                b[0] === row &&
                ((a[1] === col && b[1] === col + 1) ||
                    (b[1] === col && a[1] === col + 1))
            ) {
                return 'X'
            }
        }

        return null
    }

    const getVerticalConstraint = (
        row: number,
        col: number
    ) => {
        for (const [a, b] of equalConstraints) {
            if (
                a[1] === col &&
                b[1] === col &&
                ((a[0] === row && b[0] === row + 1) ||
                    (b[0] === row && a[0] === row + 1))
            ) {
                return '='
            }
        }

        for (const [a, b] of crossConstraints) {
            if (
                a[1] === col &&
                b[1] === col &&
                ((a[0] === row && b[0] === row + 1) ||
                    (b[0] === row && a[0] === row + 1))
            ) {
                return 'X'
            }
        }

        return null
    }

    const solvePuzzle = async () => {
        try {
            setIsSolving(true)
            const payload = {
                filled_cells:
                    boardToFilledCells(board),

                equal_constraints:
                    equalConstraints,

                cross_constraints:
                    crossConstraints,
            }

            const response = await fetch(
                'https://tango-backend-zqm1.onrender.com/solve',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify(
                        payload
                    ),
                }
            )

            const data =
                await response.json()

            if (!response.ok) {
                throw new Error(
                    data?.status ||
                    'Failed to solve puzzle'
                )
            }
            setIsSolving(false)
            navigate(
                '/visualizers/tango/playback',
                {
                    state: {
                        ...data,

                        initialBoard: board,

                        equalConstraints,

                        crossConstraints,
                    },
                }
            )
        } catch (error) {
            setIsSolving(false)
            console.error(error)

            alert(
                error instanceof Error
                    ? error.message
                    : 'Something went wrong'
            )
        }
    }

    return (
        <div className="min-h-screen bg-[#131313] text-white flex flex-col">
            <Navbar />

            <main className="flex-1 relative overflow-hidden">

                <div
                    className="
            absolute inset-0
            bg-[linear-gradient(rgba(248,249,250,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,249,250,0.04)_1px,transparent_1px)]
            bg-[size:40px_40px]
            pointer-events-none
          "
                />

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

                    <div className="mb-10">

                        <div className="inline-block border border-white px-3 py-1 text-xs uppercase">
                            Tango Solver
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold mt-4">
                            &gt; Constraint Editor
                        </h1>

                        <p className="text-gray-400 mt-2 text-sm sm:text-base">
                            Tap one cell, then tap an adjacent cell to create a constraint.
                            Tap the same pair again to remove it.
                        </p>

                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-10">

                        <button
                            onClick={() => setMode('equal')}
                            className={`
      w-full sm:w-auto
      px-4 sm:px-6
      py-3
      border
      uppercase
      transition

      ${mode === 'equal'
                                    ? 'bg-white text-black border-white'
                                    : 'border-white'
                                }
    `}
                        >
                            Equal (=)
                        </button>

                        <button
                            onClick={() => setMode('cross')}
                            className={`
      w-full sm:w-auto
      px-4 sm:px-6
      py-3
      border
      uppercase
      transition

      ${mode === 'cross'
                                    ? 'bg-white text-black border-white'
                                    : 'border-white'
                                }
    `}
                        >
                            Cross (X)
                        </button>

                    </div>

                    <div className="flex justify-center overflow-x-auto">

                        <div className="min-w-fit">

                            {Array.from({
                                length: GRID_SIZE,
                            }).map((_, row) => (
                                <div
                                    key={row}
                                    className="flex flex-col"
                                >

                                    <div className="flex">

                                        {Array.from({
                                            length: GRID_SIZE,
                                        }).map((_, col) => (
                                            <div
                                                key={`${row}-${col}`}
                                                className="flex items-center"
                                            >

                                                <button
                                                    onClick={() => handleCellClick(row, col)}
                                                    className={`
    w-10 h-10
    sm:w-12 sm:h-12
    md:w-16 md:h-16

    border border-white

    flex items-center justify-center

    text-sm
    sm:text-lg
    md:text-2xl

    transition-all

    ${selectedCell &&
                                                            selectedCell[0] === row &&
                                                            selectedCell[1] === col
                                                            ? 'bg-white text-black ring-2 ring-[#7CFF6B]'
                                                            : ''
                                                        }
  `}
                                                >
                                                    {board[row][col] === 0 && '☀'}
                                                    {board[row][col] === 1 && (
                                                        <span style={{ display: 'inline-block', transform: 'rotate(220deg)' }}>
                                                          ☾
                                                        </span>
                                                    )}
                                                </button>

                                                {col < GRID_SIZE - 1 && (
                                                    <div className="w-4 sm:w-6 md:w-8 flex justify-center text-sm sm:text-base md:text-lg">
                                                        {getHorizontalConstraint(
                                                            row,
                                                            col
                                                        )}
                                                    </div>
                                                )}

                                            </div>
                                        ))}

                                    </div>

                                    {row < GRID_SIZE - 1 && (
                                        <div className="flex">

                                            {Array.from({
                                                length: GRID_SIZE,
                                            }).map((_, col) => (
                                                <div
                                                    key={col}
                                                    className="flex items-center"
                                                >

                                                    <div className="w-10 sm:w-12 md:w-16 flex justify-center text-sm sm:text-base md:text-lg">
                                                        {getVerticalConstraint(
                                                            row,
                                                            col
                                                        )}
                                                    </div>

                                                    {col < GRID_SIZE - 1 && (
                                                        <div className="w-4 sm:w-6 md:w-8" />
                                                    )}

                                                </div>
                                            ))}

                                        </div>
                                    )}

                                </div>
                            ))}

                        </div>

                    </div>

                    <div className="flex justify-center mt-10">

                        <button
                            disabled={isSolving}
                            onClick={solvePuzzle}
                            className={`
      w-full sm:w-auto

      border border-white
      px-6 sm:px-8
      py-3
      uppercase
      transition

      ${isSolving
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-white hover:text-black'
                                }
    `}
                        >
                            {isSolving
                                ? 'SOLVING...'
                                : 'SOLVE PUZZLE'}
                        </button>

                    </div>

                </div>

            </main>

            <Footer />
        </div>
    )
}

export default TangoConstraints