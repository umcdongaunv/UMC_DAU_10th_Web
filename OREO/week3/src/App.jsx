import { useState, useEffect } from 'react'
import { getComponent } from './00HistoryAPI/router'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    history.pushState({}, '', path)
    setCurrentPath(path)
  }

  const CurrentPage = getComponent(currentPath) // ← currentPath 넘겨줘요!

  return (
    <div>
      <nav>
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/about')}>About</button>
        <button onClick={() => navigate('/contact')}>Contact</button>
      </nav>
      <CurrentPage />
    </div>
  )
}