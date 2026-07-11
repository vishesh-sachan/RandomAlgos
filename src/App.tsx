import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Post from './pages/Post'
import TangoVisualizer from './pages/TangoVisualizer'
import TangoConstraints from './pages/TangoConstraints'
import TangoPlayback from './pages/TangoPlayback'
import QueensVisualizer from './pages/QueensVisualizer'
import QueensPlayback from './pages/QueensPlayback'

function App() {
  return (
    <Routes>

      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/posts/:slug" element={<Post />} />

      <Route path="/visualizers/tango" element={<TangoVisualizer />} />

      <Route path="/visualizers/tango/constraints" element={<TangoConstraints />} />

      <Route path="/visualizers/tango/playback" element={<TangoPlayback />} />

      <Route path="/visualizers/queens" element={<QueensVisualizer />} />

      <Route path="/visualizers/queens/playback" element={<QueensPlayback />} />

    </Routes>
  )
}

export default App