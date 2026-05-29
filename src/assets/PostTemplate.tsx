import Title from '../components/Title.tsx'
import TryAlgorithm from '../components/TryAlgorithm.tsx'
import CodeBlock from '../components/CodeBlock.tsx'

// code block example 
{/* <CodeBlock
  filename="binary-search.js"
  language="javascript"
  code={binarySearchCode}
/> */}

// img example
{/* <div>
  <img src="" alt="" style={{ width: 'auto', height: 'auto' }} />
  <p className="text-xs text-gray-400 uppercase tracking-wide">
    {caption}
  </p>
</div> */}

function Template() {
  return (
    <article className="w-full max-w-4xl flex flex-col gap-10">

      <header className="flex flex-col gap-3">

        <div className="inline-flex border border-white px-2 py-1 w-fit text-xs uppercase tracking-widest">
          {/* category */}
        </div>

        <Title title="Title" /> {/* title */}

        <div className="flex flex-wrap gap-6 text-gray-400 text-xs uppercase">

          <span>&gt; DATE: YYYY-MM-DD</span> {/* date */}

          <span>&gt; AUTHOR: Vishesh</span>

        </div>

      </header>
      <div>
        <img src="" alt="" style={{ width: 'auto', height: 'auto' }} /> {/* cover image */}
      </div>

      {/* post content  */}
      <div className="flex flex-col gap-6 text-gray-300 leading-8">

        <p>
          {/* des */}
        </p>

        <p>
          {/* des */}
        </p>

        <div>

          <TryAlgorithm url="" /> {/* link to try algorithm */}

        </div>

        {/* start content */}

      </div>

    </article>
  )
}

export default Template