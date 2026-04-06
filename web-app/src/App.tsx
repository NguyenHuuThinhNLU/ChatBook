import { useEffect, useState } from 'react'
import './styles/App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Scene from './pages/Scene.jsx'
import { isAuthenticated, logout } from './services/authenticationService'
import { getMyInfo } from './services/userService'

const pages = {
  home: Home,
  login: Login,
  scene: Scene,
}

const getUserDisplayName = (user: Record<string, unknown> | null) => {
  if (!user) {
    return ''
  }

  const username = user.username
  const name = user.name

  if (typeof username === 'string' && username.trim()) {
    return username
  }

  if (typeof name === 'string' && name.trim()) {
    return name
  }

  return 'Nguoi dung'
}

function App() {
  const [activePage, setActivePage] = useState<keyof typeof pages>('home')
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(
    null,
  )
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const ActivePage = pages[activePage]
  const isLoggedIn = Boolean(currentUser)

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!isAuthenticated()) {
        setActivePage('login')
        setIsCheckingAuth(false)
        return
      }

      try {
        const response = await getMyInfo()
        const user = response.data?.result ?? null

        setCurrentUser(user)
        setActivePage('home')
      } catch {
        setCurrentUser(null)
        setActivePage('login')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    void loadCurrentUser()
  }, [])

  const handleLoginSuccess = (user: Record<string, unknown>) => {
    setCurrentUser(user)
    setActivePage('home')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setCurrentUser(null)
      setActivePage('login')
    }
  }

  const visiblePages = isLoggedIn
    ? (['home', 'scene'] as Array<keyof typeof pages>)
    : (['login'] as Array<keyof typeof pages>)

  const displayName = getUserDisplayName(currentUser)

  if (isCheckingAuth) {
    return (
      <div className="app-shell">
        <header className="topbar">
          <div>
            <span className="eyebrow">BookLoop</span>
            <h2>Mang xa hoi trao doi sach</h2>
          </div>
        </header>
        <main className="page">
          <section className="surface-card status-card">
            <h3>Dang kiem tra phien dang nhap...</h3>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="eyebrow">BookLoop</span>
          <h2>Mang xa hoi trao doi sach</h2>
        </div>
      </header>

      {activePage === 'login' ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <ActivePage />
      )}
    </div>
  )
}

export default App
