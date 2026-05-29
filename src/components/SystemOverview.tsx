function SystemOverview() {
  return (
    <section className="relative border border-white md:col-span-8">
      <div className="absolute top-0 left-0 bg-white text-black px-2 py-1 text-xs font-semibold border-b border-r border-white">
        [SYSTEM_OVERVIEW]
      </div>

      <div className="p-6 pt-14 flex flex-col gap-4">

        <p className="text-sm leading-7 text-gray-300">
          RANDOM_ALGO is where I mess around with random algorithm ideas and concepts. Most of the stuff here is not the standard or most optimized solution, it's just how I thought of implementing it with whatever CS or random knowledge I had at the time.
        </p>
        <p className="text-sm leading-7 text-gray-300">
          The site is mainly about understanding concepts by building them. There'll be random graph problems, maths concepts, and other algorithms explained through code and visualizations instead of long theory dumps.        
        </p>
        <p className="text-sm leading-7 text-gray-300">
          I'm also building small illustrators for the algorithms so you can try your own inputs or use predefined ones and see how the implementation actually works.
        </p>

        {/* <ul className="flex flex-col gap-2 text-sm">
          <li>&gt; STATUS: ONLINE</li>
          <li>&gt; UPTIME: 99.99%</li>
          <li>&gt; DIRECTIVE: ANALYZE_AND_RECORD</li>
        </ul> */}

      </div>
    </section>
  )
}

export default SystemOverview