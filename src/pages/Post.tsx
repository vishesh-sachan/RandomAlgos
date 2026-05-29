import { useParams } from 'react-router-dom'
import { posts } from '../data/posts'

import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Post() {
  const { slug } = useParams()

  const post = posts.find(
    p => p.slug === slug
  )

  if (!post) {
    return <h1>404</h1>
  }

  const PostContent = post.component

  return (
    <div className="min-h-screen bg-[#131313] text-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <PostContent />
      </main>
      <Footer />
    </div>
  )
}

export default Post