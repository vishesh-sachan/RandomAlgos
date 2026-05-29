// import SectionLabel from './SectionLabel'

import Title from "./Title"

function HeroSection() {
  return (
    <section className="relative border border-white p-6 flex flex-col gap-3">

      <div className="absolute -top-3 left-4 bg-[#131313] px-2 text-xs">
        [ INIT_SEQUENCE ]
      </div>
      
      <Title title="&gt; _SYSTEM.BOOT()" />

      <div className="text-sm text-gray-300 space-y-2 leading-7">

        <p>[OK] Loading core modules...</p>

        <p>[OK] Establishing secure connection...</p>

        <p>
          [OK] Welcome to RANDOM_ALGO. Documenting digital
          artifacts, and code fragments.
        </p>

        <p className="text-white animate-pulse mt-4">
          Waiting for input...
        </p>

      </div>

    </section>
  )
}

export default HeroSection