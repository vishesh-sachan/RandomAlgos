function Pagination() {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">

{/* when page left then border-[#f8f9fa] and text-[#f8f9fa] else gray-500 */}
      <button className="border border-gray-500 text-gray-500 px-4 py-2 cursor-not-allowed">
        &lt; PREV
      </button>

      <span className="text-white">
        PAGE 1 / 1
      </span>
{/* hover:bg-white hover:text-black transition */}
      <button className="border border-gray-500 text-gray-500 px-4 py-2 cursor-not-allowed">
        NEXT &gt;
      </button>

    </div>
  )
}

export default Pagination