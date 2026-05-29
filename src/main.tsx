import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'
import { TangoProvider } from './context/TangoContext'
import ScrollToTop from './components/ScrollToTop'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>

    <BrowserRouter>
      <TangoProvider>
        <ScrollToTop />
        <App />
      </TangoProvider>
    </BrowserRouter>

  </React.StrictMode>
)