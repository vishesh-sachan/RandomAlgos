import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import type { QueensStackEntry, QueensCellState, QueensRegions } from '../types/queens'

type PlaybackState = {
  status: string
  stack: QueensStackEntry[]
  solution: [number, number][]
  regions: QueensRegions
  boardSize: number
}

function QueensPlayback() {
  const location = useLocation()

  if (!location.state) {
    return (
      <div className="min-h-screen bg-[#131313] text-white flex items-center justify-center">
        No playback data found.
      </div>
    )
  }

  const { stack, regions, boardSize, status } = location.state as PlaybackState

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(500)

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

  const boardState = useMemo(() => {
    const grid: QueensCellState[][] = Array.from(
      { length: boardSize },
      () => Array.from(
        { length: boardSize },
        () => ({ region: null, queen: false, blocked: false })
      )
    )

    for (const [hex, cells] of Object.entries(regions)) {
      for (const [r, c] of cells) {
        if (r < boardSize && c < boardSize) {
          grid[r][c].region = hex
        }
      }
    }

    for (let i = 0; i < currentStep; i++) {
      const step = stack[i]
      const [qr, qc] = step.queen

      if (step.action === 'place') {
        grid[qr][qc].queen = true
        if (step.blocked) {
          for (const [br, bc] of step.blocked) {
            if (br < boardSize && bc < boardSize) {
              grid[br][bc].blocked = true
            }
          }
        }
      } else {
        grid[qr][qc].queen = false
        if (step.unblocked) {
          for (const [br, bc] of step.unblocked) {
            if (br < boardSize && bc < boardSize) {
              grid[br][bc].blocked = false
            }
          }
        }
      }
    }

    return grid
  }, [currentStep, stack, regions, boardSize])

  const currentAction = useMemo(() => {
    if (currentStep === 0) return null
    const step = stack[currentStep - 1]
    const [r, c] = step.queen

    if (step.action === 'place') {
      return `> placing queen at (${r},${c}) [region: ${step.region}] — ${step.blocked?.length ?? 0} cells blocked`
    }
    return `> backtracking from (${r},${c}) [region: ${step.region}]`
  }, [currentStep, stack])

  const isFinished = currentStep >= stack.length

  const activeCell = currentStep > 0 ? stack[currentStep - 1].queen : null

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, stack.length))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0))
  const goToStart = () => setCurrentStep(0)
  const goToEnd = () => setCurrentStep(stack.length)

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,249,250,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,249,250,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          <div className="mb-10">
            <div className="inline-block border border-white px-3 py-1 text-xs uppercase">
              Queens Solver
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4">&gt; Solver Playback</h1>
            <p className="text-gray-400 mt-2">
              Step {currentStep} / {stack.length}
            </p>
          </div>

          <div className="flex justify-center mb-10 overflow-x-auto">
            <div className="min-w-fit">
              {Array.from({ length: boardSize }).map((_, row) => (
                <div key={row} className="flex">
                  {Array.from({ length: boardSize }).map((_, col) => {
                    const cell = boardState[row][col]
                    const isActive =
                      activeCell &&
                      stack[currentStep - 1]?.queen[0] === row &&
                      stack[currentStep - 1]?.queen[1] === col

                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                          border border-white/40
                          flex items-center justify-center
                          text-lg sm:text-xl md:text-2xl
                          transition-all
                          ${isActive ? 'ring-2 ring-[#7CFF6B] relative z-10' : ''}
                        `}
                        style={{
                          backgroundColor: cell.region ? `${cell.region}50` : 'transparent',
                        }}
                      >
                        {cell.queen && <span>♛</span>}
                        {cell.blocked && !cell.queen && <span className="text-red-400/60">✕</span>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-2xl mx-auto">

            <div className="border border-white p-4 mb-8 min-h-[90px]">
              <div className="text-gray-400 text-sm mb-2">TERMINAL LOG</div>
              <div>{currentAction}</div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button onClick={goToStart} className="border border-white px-4 py-3">⏮</button>
              <button onClick={prevStep} className="border border-white px-4 py-3">≪</button>
              <button onClick={() => setIsPlaying((prev) => !prev)} className="border border-white px-6 py-3">
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button onClick={nextStep} className="border border-white px-4 py-3">≫</button>
              <button onClick={goToEnd} className="border border-white px-4 py-3">⏭</button>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {[1000, 500, 250, 100].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`
                    border px-4 py-3 min-w-[70px]
                    ${speed === s ? 'bg-white text-black border-white' : 'border-white'}
                  `}
                >
                  {s === 1000 && '0.5x'}
                  {s === 500 && '1x'}
                  {s === 250 && '2x'}
                  {s === 100 && '5x'}
                </button>
              ))}
            </div>

            {isFinished && status === 'solved' && (
              <div className="mt-8 border border-green-500 bg-green-500/10 text-green-300 p-4 text-center">
                ✓ SOLUTION FOUND
              </div>
            )}
            {isFinished && status === 'unsolvable' && (
              <div className="mt-8 border border-red-500 bg-red-500/10 text-red-300 p-4 text-center">
                ✗ NO SOLUTION — all possibilities exhausted
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}

export default QueensPlayback
