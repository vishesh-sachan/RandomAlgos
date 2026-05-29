function Footer() {
  return (
    <footer className="w-full border-t border-white mt-12">

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        <div className="text-xs uppercase">
          (C) 2026 RANDOM_ALGO V1.0
        </div>

        <div className="flex gap-6 text-xs">
          <a href="/about" rel="noopener noreferrer">
            About
          </a>
          <a onClick={() => window.open('https://github.com/vishesh-sachan', '_blank')}>
            GITHUB
          </a>
          <a onClick={() => window.open('mailto:visheshsachan23@gmail.com', '_blank')}>
            CONTACT
          </a>
        </div>

      </div>

    </footer>
  )
}

export default Footer