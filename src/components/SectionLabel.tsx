function SectionLabel({ title}:{title:string}) {
  return (
    <div className="absolute top-0 left-0 bg-white text-black px-2 py-1 text-xs font-semibold border-b border-r border-white">
      [{title}]
    </div>
  )
}

export default SectionLabel