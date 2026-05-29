import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTango } from '../context/TangoContext'
import { useNavigate } from 'react-router-dom'

const GRID_SIZE = 6

function TangoVisualizer() {
  const { board, setBoard } = useTango()
  const [selected, setSelected] = useState({
    row: 0,
    col: 0,
  })

  const navigate = useNavigate()

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  const cycleCell = (r: number, c: number) => {
    setBoard((prev) => {
      const next = prev.map((row) => [...row])

      if (next[r][c] === null) {
        next[r][c] = 0
      } else if (next[r][c] === 0) {
        next[r][c] = 1
      } else {
        next[r][c] = null
      }

      return next
    })
  }

  const setCellValue = (
    value: 0 | 1 | null
  ) => {
    const { row, col } = selected

    setBoard((prev) => {
      const next = prev.map((r) => [...r])
      next[row][col] = value
      return next
    })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          '0',
          '1',
          'Backspace',
          'Delete',
        ].includes(e.key)
      ) {
        e.preventDefault()
      }

      switch (e.key) {
        case '0':
          setCellValue(0)
          break

        case '1':
          setCellValue(1)
          break

        case 'Backspace':
        case 'Delete':
          setCellValue(null)
          break

        case 'ArrowUp':
          setSelected(prev => ({
            row: Math.max(0, prev.row - 1),
            col: prev.col,
          }))
          break

        case 'ArrowDown':
          setSelected(prev => ({
            row: Math.min(GRID_SIZE - 1, prev.row + 1),
            col: prev.col,
          }))
          break

        case 'ArrowLeft':
          setSelected(prev => ({
            row: prev.row,
            col: Math.max(0, prev.col - 1),
          }))
          break

        case 'ArrowRight':
          setSelected(prev => ({
            row: prev.row,
            col: Math.min(GRID_SIZE - 1, prev.col + 1),
          }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () =>
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
  }, [selected])

  return (
    <div className="min-h-screen bg-[#131313] text-[#f8f9fa] flex flex-col">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">

        {/* Background Grid */}
        <div
          className="
            absolute inset-0
            bg-[linear-gradient(rgba(248,249,250,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,249,250,0.04)_1px,transparent_1px)]
            bg-[size:40px_40px]
            pointer-events-none
          "
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">

          <div className="mb-10">

            <div className="inline-block border border-white px-3 py-1 text-xs uppercase tracking-widest">
              Tango Solver
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
              &gt; Board Input
            </h1>

            {isTouchDevice ? (
              <div className="mt-3 text-gray-400 text-sm sm:text-base">
                <p>Tap cells to cycle through Sun, Moon, and Empty.</p>
              </div>
            ) : (
              <div className="mt-3 text-gray-400 text-sm sm:text-base">
                <ul className="list-disc pl-5">
                  <li>Arrow keys to move.</li>
                  <li>0 for Sun.</li>
                  <li>1 for Moon.</li>
                  <li>Backspace to clear.</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-center">

            <div className="grid grid-cols-6 border border-white">

              {board.map((row, r) =>
                row.map((cell, c) => {
                  const active =
                    selected.row === r &&
                    selected.col === c

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => {
                        setSelected({
                          row: r,
                          col: c,
                        })

                        if (isTouchDevice) {
                          cycleCell(r, c)
                        }
                      }}
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

                        ${active
                          ? 'bg-white text-black'
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
                    </button>
                  )
                })
              )}

            </div>

          </div>

          <div className="flex justify-center mt-10">

            <button
              className="
                border border-white
                px-6 sm:px-8
                py-3
                uppercase
                hover:bg-white
                hover:text-black
                transition
              "
              onClick={() =>
                navigate(
                  '/visualizers/tango/constraints'
                )
              }
            >
              Next: Constraints
            </button>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}

export default TangoVisualizer