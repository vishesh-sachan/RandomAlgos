import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import SearchBar from '../components/SearchBar'
import PostCard from '../components/PostCard'
import Pagination from '../components/Pagination'
import { posts } from '../data/posts'

function Home() {
  return (
    <div className="min-h-screen bg-[#131313] text-[#f8f9fa] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-12">
        <HeroSection />
        <SearchBar />
        <section className="flex flex-col gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
            />
          ))}
        </section>
        <Pagination />
      </main>
      <Footer />
    </div>
  )
}

export default Home