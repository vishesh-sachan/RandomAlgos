import { useState, useMemo, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useQueens } from '../context/QueensContext'
import { useNavigate } from 'react-router-dom'
import type { QueensRegions } from '../types/queens'

const PREDEFINED_COLOURS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#FF8C42',
]

function QueensVisualizer() {
  const { regions, setRegions, boardSize, setBoardSize } = useQueens()
  const [activeColour, setActiveColour] = useState(PREDEFINED_COLOURS[0])
  const [eraserMode, setEraserMode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSolving, setIsSolving] = useState(false)

  const navigate = useNavigate()

  const cellColours = useMemo(() => {
    const grid: (string | null)[][] = Array.from({ length: boardSize }, () => Array(boardSize).fill(null))
    for (const [hex, cells] of Object.entries(regions)) {
      for (const [r, c] of cells) {
        if (r < boardSize && c < boardSize) {
          grid[r][c] = hex
        }
      }
    }
    return grid
  }, [regions, boardSize])

  const validate = useCallback(() => {
    let count = 0
    for (const row of cellColours) {
      for (const cell of row) {
        if (cell !== null) count++
      }
    }
    const total = boardSize * boardSize
    if (count < total) {
      setError(`${total - count} cell${total - count === 1 ? '' : 's'} not assigned to any region`)
      return false
    }
    setError(null)
    return true
  }, [cellColours, boardSize])

  const paintCell = (r: number, c: number) => {
    const existingHex = cellColours[r]?.[c] ?? null

    if (existingHex && !eraserMode) {
      setActiveColour(existingHex)
      return
    }

    setRegions((prev: QueensRegions) => {
      const next: QueensRegions = {}

      for (const [hex, cells] of Object.entries(prev)) {
        const filtered = cells.filter(([cr, cc]) => cr !== r || cc !== c)
        if (filtered.length > 0) next[hex] = filtered
      }

      if (!eraserMode) {
        const colour = activeColour
        next[colour] = [...(next[colour] || []), [r, c]]
      }

      return next
    })
  }

  const clearAll = () => {
    setRegions({})
    setError(null)
  }

  const solve = async () => {
    if (isSolving) return
    if (!validate()) return

    setIsSolving(true)
    try {
      const response = await fetch('https://queens-backend-ht9u.onrender.com/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ size: boardSize, regions }),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || 'Failed to solve puzzle')
      }

      const data = await response.json()
      navigate('/visualizers/queens/playback', {
        state: { ...data, regions, boardSize },
      })
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setIsSolving(false)
    }
  }

  const handleSizeChange = (newSize: number) => {
    setBoardSize(newSize)
    setRegions({})
    setError(null)
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#f8f9fa] flex flex-col">
      <Navbar />

      <main className="flex-1 relative overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(248,249,250,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(248,249,250,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

          <div className="mb-6">
            <div className="inline-block border border-white px-3 py-1 text-xs uppercase tracking-widest">
              Queens Solver
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold">&gt; Region Editor</h1>
            <p className="mt-2 text-gray-400 text-sm sm:text-base">
              Pick a colour from the palette, or tap an already-coloured cell to pick up its colour. Every cell must belong to a region.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs uppercase text-gray-400">Board Size:</span>
            <select
              value={boardSize}
              onChange={(e) => handleSizeChange(Number(e.target.value))}
              className="bg-transparent border border-white px-3 py-2 text-sm uppercase"
            >
              {Array.from({ length: 10 }, (_, i) => i + 3).map((n) => (
                <option key={n} value={n} className="bg-[#131313]">{n}×{n}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {PREDEFINED_COLOURS.map((hex) => (
              <button
                key={hex}
                onClick={() => { setActiveColour(hex); setEraserMode(false) }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${activeColour === hex && !eraserMode ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
            <div className={`relative ${!eraserMode && !PREDEFINED_COLOURS.includes(activeColour) ? 'ring-2 ring-white rounded-full' : ''}`}>
              <input
                type="color"
                value={activeColour}
                onChange={(e) => { setActiveColour(e.target.value); setEraserMode(false) }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer border-0"
                title="Custom colour"
              />
            </div>
            <div className="w-px h-6 bg-gray-600 mx-1" />
            <button
              onClick={() => setEraserMode(!eraserMode)}
              className={`border px-3 py-1.5 text-xs uppercase transition ${eraserMode ? 'bg-white text-black' : 'border-white'}`}
            >
              {eraserMode ? '🧹 Erasing' : '🧹 Eraser'}
            </button>
            <button
              onClick={clearAll}
              className="border border-white px-3 py-1.5 text-xs uppercase"
            >
              Clear All
            </button>
          </div>

          {error && (
            <div className="mb-4 border border-red-500 bg-red-500/10 text-red-300 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
              {Array.from({ length: boardSize }).map((_, r) =>
                Array.from({ length: boardSize }).map((_, c) => {
                  const hex = cellColours[r]?.[c] ?? null
                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => paintCell(r, c)}
                      className={`
                        w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
                        border border-white/50 flex items-center justify-center
                        text-xs transition-all
                        ${hex ? 'text-white' : 'text-gray-600'}
                      `}
                      style={{
                        backgroundColor: hex ? `${hex}70` : 'transparent',
                      }}
                    >
                      {hex ? '◼' : '·'}
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-400 text-xs uppercase mb-2">Region Legend</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(regions).length === 0 && (
                <span className="text-gray-500 text-sm">No regions defined yet</span>
              )}
              {Object.entries(regions).map(([hex, cells]) => (
                <div key={hex} className="flex items-center gap-2 text-xs">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: hex }} />
                  <span className="text-gray-300">{hex}</span>
                  <span className="text-gray-500">{cells.length} cell{cells.length === 1 ? '' : 's'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              disabled={isSolving}
              onClick={solve}
              className={`
                border px-6 sm:px-8 py-3 uppercase transition
                ${isSolving ? 'opacity-50 cursor-not-allowed border-gray-600' : 'border-white hover:bg-white hover:text-black'}
              `}
            >
              {isSolving ? 'SOLVING...' : 'SOLVE PUZZLE'}
            </button>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}

export default QueensVisualizer
