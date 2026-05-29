function CodeBlock({ language, filename, code }: { language: string; filename: string; code: string }) {
  return (
    <div className="border border-[#f8f9fa] overflow-hidden"> 
      {/* bg-black */}

      <div className="flex justify-between items-center border-b border-[#f8f9fa] px-4 py-2 text-xs">

        <span className="text-gray-400">
          {filename}
        </span>

        <span className="text-white uppercase">
          {language}
        </span>

      </div>

      <pre className="overflow-x-auto p-4 text-sm leading-7">
        <code typeof="text/python">{code}</code>
      </pre>

    </div>
  ) 
}

export default CodeBlock