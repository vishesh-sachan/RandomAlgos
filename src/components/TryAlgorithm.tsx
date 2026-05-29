import { Link } from 'react-router-dom'

function TryAlgorithm({ url }: { url: string }) {
  return (
    <Link
      to={url}
      className="inline-block border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition uppercase active:text-white"
    >
      &gt; TRY_ALGORITHM
    </Link>
  )
}

export default TryAlgorithm