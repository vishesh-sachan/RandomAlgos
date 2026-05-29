import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Post from './pages/Post'
import TangoVisualizer from './pages/TangoVisualizer'
import TangoConstraints from './pages/TangoConstraints'
import TangoPlayback from './pages/TangoPlayback'

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/posts/:slug" element={<Post />} />

      <Route path="/visualizers/tango" element={<TangoVisualizer />} />

      <Route path="/visualizers/tango/constraints" element={<TangoConstraints />} />

      <Route path="/visualizers/tango/playback" element={<TangoPlayback />} />

    </Routes>
  )
}

export default App