import SectionLabel from './SectionLabel'

function CreatorCredentials() {
  return (
    <section className="relative border border-white md:col-span-8">

      <SectionLabel title="CREATOR_CREDENTIALS" />

      <div className="p-6 pt-14 flex flex-col gap-5 h-full">

        <div className="flex items-center gap-4 border-b border-[#f8f9fa] pb-4">

          <div className="w-16 h-16 border border-white flex items-center justify-center overflow-hidden">
            <img
              src="/creator-avatar.png"
              alt="Creator Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              Vishesh / SYS_ADMIN
            </h3>

            <p className="text-xs text-gray-400">
              ID: 0x9F4A
            </p>
          </div>

        </div>

        <p className="text-sm leading-7 text-gray-300">
          Building random implementations, visualizers, and experiments around algorithms, maths, and systems.
        </p>

        <div className="flex gap-3 mt-auto">

          <button className="flex-1 border border-white py-2 hover:bg-white hover:text-black transition" onClick={() => window.open('https://github.com/vishesh-sachan', '_blank')}>
            [GITHUB]
          </button>

          <button className="flex-1 border border-white py-2 hover:bg-white hover:text-black transition" onClick={() => window.open('mailto:visheshsachan23@gmail.com', '_blank')}>
            [CONTACT]
          </button>

        </div>

      </div>
    </section>
  )
}

export default CreatorCredentials