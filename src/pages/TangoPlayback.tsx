import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type CellValue = 0 | 1 | null

type PlaybackState = {
  stack: [number, number, CellValue][]
  board: (0 | 1)[][]
  status: string

  initialBoard: CellValue[][]
  equalConstraints: any[]
  crossConstraints: any[]
}

function TangoPlayback() {
  const location = useLocation()

  if (!location.state) {
    return (
      <div className="min-h-screen bg-[#131313] text-white flex items-center justify-center">
        No playback data found.
      </div>
    )
  }

  const {
    stack,
    initialBoard,
    equalConstraints,
    crossConstraints,
  } = location.state as PlaybackState

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(21)

  useEffect(() => {
    if (!isPlaying) return

    if (currentStep >= stack.length) {
      setIsPlaying(false)
      return
    }

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1)
    }, speed)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, speed, stack.length])

  const board = useMemo(() => {
    const copy = initialBoard.map(
      (row) => [...row]
    )

    for (let i = 0; i < currentStep; i++) {
      const [r, c, val] = stack[i]

      copy[r][c] = val
    }

    return copy
  }, [currentStep, initialBoard, stack])

  const currentAction = useMemo(() => {
    if (currentStep === 0) return null

    const [r, c, val] =
      stack[currentStep - 1]

    if (val === null) {
      return `> backtracking from (${r},${c})`
    }

    return `> placing ${val === 0 ? 'sun' : 'moon'
      } at (${r},${c})`
  }, [currentStep, stack])

  const nextStep = () => {
    setCurrentStep((prev) =>
      Math.min(prev + 1, stack.length)
    )
  }

  const prevStep = () => {
    setCurrentStep((prev) =>
      Math.max(prev - 1, 0)
    )
  }

  const goToStart = () => {
    setCurrentStep(0)
  }

  const goToEnd = () => {
    setCurrentStep(stack.length)
  }

  const getHorizontalConstraint = (
    row: number,
    col: number
  ) => {
    for (const [a, b] of equalConstraints) {
      if (
        a[0] === row &&
        b[0] === row &&
        (
          (a[1] === col && b[1] === col + 1) ||
          (b[1] === col && a[1] === col + 1)
        )
      ) {
        return '='
      }
    }

    for (const [a, b] of crossConstraints) {
      if (
        a[0] === row &&
        b[0] === row &&
        (
          (a[1] === col && b[1] === col + 1) ||
          (b[1] === col && a[1] === col + 1)
        )
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
        (
          (a[0] === row && b[0] === row + 1) ||
          (b[0] === row && a[0] === row + 1)
        )
      ) {
        return '='
      }
    }

    for (const [a, b] of crossConstraints) {
      if (
        a[1] === col &&
        b[1] === col &&
        (
          (a[0] === row && b[0] === row + 1) ||
          (b[0] === row && a[0] === row + 1)
        )
      ) {
        return 'X'
      }
    }

    return null
  }

  const isFinished =
    currentStep >= stack.length

  const activeCell =
    currentStep > 0
      ? stack[currentStep - 1]
      : null

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
              &gt; Solver Playback
            </h1>

            <p className="text-gray-400 mt-2">
              Step {currentStep} / {stack.length}
            </p>

          </div>

          <div className="flex justify-center mb-10 overflow-x-auto">

            <div className="min-w-fit">

              {Array.from({ length: 6 }).map((_, row) => (

                <div
                  key={row}
                  className="flex flex-col"
                >

                  <div className="flex">

                    {Array.from({ length: 6 }).map((_, col) => {

                      const cell = board[row][col]

                      const isActive =
                        activeCell &&
                        activeCell[0] === row &&
                        activeCell[1] === col

                      return (

                        <div
                          key={`${row}-${col}`}
                          className="flex items-center"
                        >

                          <div
                            className={`
                    w-12 h-12
                    sm:w-16 sm:h-16
                    md:w-20 md:h-20

                    border border-white

                    flex items-center justify-center

                    text-xl
                    sm:text-2xl
                    md:text-3xl

                    transition-all

                    ${isActive
                                ? 'ring-2 ring-[#7CFF6B]'
                                : ''
                              }
                  `}
                          >
                            {cell === 0 && '☀'}
                            {cell === 1 && (
                              <span style={{ display: 'inline-block', transform: 'rotate(220deg)' }}>
                                ☾
                              </span>
                            )}
                          </div>

                          {col < 5 && (
                            <div className="w-4 sm:w-6 md:w-8 flex justify-center text-sm sm:text-base md:text-lg">
                              {getHorizontalConstraint(
                                row,
                                col
                              )}
                            </div>
                          )}

                        </div>
                      )
                    })}

                  </div>

                  {row < 5 && (

                    <div className="flex">

                      {Array.from({ length: 6 }).map((_, col) => (

                        <div
                          key={col}
                          className="flex items-center"
                        >

                          <div className="w-12 sm:w-16 md:w-20 flex justify-center text-sm sm:text-base md:text-lg">
                            {getVerticalConstraint(
                              row,
                              col
                            )}
                          </div>

                          {col < 5 && (
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

          <div className="max-w-2xl mx-auto">

            <div className="border border-white p-4 mb-8 min-h-[90px]">

              <div className="text-gray-400 text-sm mb-2">
                TERMINAL LOG
              </div>

              <div>
                {currentAction}
              </div>

            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">

              <button
                onClick={goToStart}
                className="border border-white px-4 py-3"
              >
                ⏮
              </button>

              <button
                onClick={prevStep}
                className="border border-white px-4 py-3"
              >
                ≪
              </button>

              <button
                onClick={() =>
                  setIsPlaying(
                    (prev) => !prev
                  )
                }
                className="border border-white px-6 py-3"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>

              <button
                onClick={nextStep}
                className="border border-white px-4 py-3"
              >
                ≫
              </button>

              <button
                onClick={goToEnd}
                className="border border-white px-4 py-3"
              >
                ⏭
              </button>

            </div>

            <div className="flex flex-wrap justify-center gap-2">

              {[1000, 500, 250, 100].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setSpeed(s)
                    }
                    className={`
                      border px-4 py-3 min-w-[70px]

                      ${speed === s
                        ? 'bg-white text-black border-white'
                        : 'border-white'
                      }
                    `}
                  >
                    {s === 1000 && '0.5x'}
                    {s === 500 && '1x'}
                    {s === 250 && '2x'}
                    {s === 100 && '5x'}
                  </button>
                )
              )}

            </div>

            {isFinished && (
              <div className="mt-8 border border-white p-4 text-center">
                ✓ SOLUTION FOUND
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>
  )
}

export default TangoPlayback