import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const links = [
    {
      name: 'POSTS',
      path: '/',
    },
    {
      name: 'ABOUT',
      path: '/about',
    },
  ]

  return (
    <nav className="w-full border-b border-white bg-[#131313] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

        <div className="flex justify-between items-center">

          {/* Logo */}
          <div className="flex items-center">

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-xl font-bold leading-none mr-1 mb-0.5  animate-pulse" 
              aria-label="Toggle menu"
            >
              <span
                className={`
                  inline-block transition-transform duration-300
                  ${open ? 'rotate-90' : ''}
                `}
              >
                &gt;
              </span>
            </button>

            {/* Desktop > */}
            <span className="hidden md:inline text-2xl font-bold mr-2">
              &gt;
            </span>

            <Link
              to="/"
              className="text-lg sm:text-2xl font-bold uppercase tracking-tight"
            >
              RANDOM
              <span className="text-[#7CFF6B]">_</span>
              ALGO
            </Link>

          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6 text-sm">
            {links.map((link) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-2 py-1 transition border ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'border-transparent hover:border-white hover:bg-white hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

        </div>

        {/* Mobile Nav */}
        <div
          className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            ${open ? 'max-h-40 mt-4' : 'max-h-0'}
          `}
        >
          <div className="flex flex-col gap-2">

            {links.map((link) => {
              const isActive = location.pathname === link.path

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 border transition ${
                    isActive
                      ? 'bg-white text-black border-white'
                      : 'border-white hover:bg-white hover:text-black'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}

          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar