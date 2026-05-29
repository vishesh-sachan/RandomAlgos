function SearchBar() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-start border-b border-[#f8f9fa] pb-4">

      <div className="relative w-full md:flex-1">

        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white">
          search
        </span>

        <input
          type="text"
          placeholder="grep -i 'search queries...'"
          className="w-full border border-[#f8f9fa] focus:border-white pl-10 pr-4 py-3 outline-none transition"
          disabled
        />

      </div>

      <div className="flex gap-2 w-full md:w-auto">

        <button className="flex-1 md:flex-none border border-white px-4 py-3 hover:bg-white hover:text-black transition">
          LATEST
        </button>

        <button className="flex-1 md:flex-none border border-white px-4 py-3 hover:bg-white hover:text-black transition">
          POPULAR
        </button>

      </div>

    </div>
  )
}

export default SearchBar