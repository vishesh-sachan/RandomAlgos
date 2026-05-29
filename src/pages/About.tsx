import Navbar from '../components/Navbar'
import Header from '../components/Header'
import SystemOverview from '../components/SystemOverview'
import CreatorCredentials from '../components/CreatorCredentials'
import Footer from '../components/Footer'

function About() {
  return (
    <div className="min-h-screen flex flex-col bg-[#131313] text-white">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col gap-12 w-full">
        <Header />
        <div className="grid gap-6">
          <SystemOverview />
          <CreatorCredentials />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default About