import { useEffect, useMemo, useRef, useState } from 'react'
import './styles/App.css'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Scene from './pages/Scene.jsx'
import { isAuthenticated, logout } from './services/authenticationService'
import { getMyInfo } from './services/userService'
import { getStoredUser, setStoredUser } from './services/localStorageService'

const pages = {
  home: Home,
  profile: Profile,
  scene: Scene,
}

const getUserDisplayName = (user: Record<string, unknown> | null) => {
  if (!user) {
    return 'Nguoi dung'
  }

  const username = user.username
  const firstName = user.firstName
  const lastName = user.lastName

  if (typeof username === 'string' && username.trim()) {
    return username
  }

  const fullName = [firstName, lastName].filter((item) => typeof item === 'string' && item.trim()).join(' ')

  return fullName || 'Nguoi dung'
}

function App() {
  const [activePage, setActivePage] = useState<keyof typeof pages>('home')
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const ActivePage = pages[activePage]
  const isLoggedIn = Boolean(currentUser)

  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!isAuthenticated()) {
        setCurrentUser(null)
        setIsCheckingAuth(false)
        return
      }

      const storedUser = getStoredUser()

      try {
        const response = await getMyInfo()
        const profile = response.data?.result ?? null
        const mergedUser = profile ? { ...storedUser, ...profile } : storedUser

        setCurrentUser(mergedUser ?? null)

        if (mergedUser) {
          setStoredUser(mergedUser)
        }
      } catch {
        if (storedUser) {
          setCurrentUser(storedUser)
        } else {
          setCurrentUser(null)
        }
      } finally {
        setIsCheckingAuth(false)
      }
    }

    void loadCurrentUser()
  }, [])

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isUserMenuOpen])

  const handleLoginSuccess = (user: Record<string, unknown>) => {
    setCurrentUser(user)
    setStoredUser(user)
    setActivePage('home')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } finally {
      setCurrentUser(null)
      setIsUserMenuOpen(false)
    }
  }

  const displayName = getUserDisplayName(currentUser)
  const userInitial = displayName.slice(0, 1).toUpperCase()
  const activePageLabel = useMemo(() => {
    if (activePage === 'scene') {
      return 'Chat'
    }

    if (activePage === 'profile') {
      return 'Profile'
    }

    return 'Home'
  }, [activePage])

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
          <h2>{isLoggedIn ? activePageLabel : 'Dang nhap de tiep tuc'}</h2>
        </div>

        {isLoggedIn ? (
          <div className="topbar-actions">
            <div className="tab-list">
              <button
                className={activePage === 'home' ? 'tab active' : 'tab'}
                type="button"
                onClick={() => setActivePage('home')}
              >
                Trang chu
              </button>
              <button
                className={activePage === 'scene' ? 'tab active' : 'tab'}
                type="button"
                onClick={() => setActivePage('scene')}
              >
                Chat
              </button>
            </div>

            <div className="user-menu" ref={userMenuRef}>
              <button
                className="user-menu-trigger"
                type="button"
                onClick={() => setIsUserMenuOpen((current) => !current)}
              >
                <span className="user-menu-avatar">{userInitial}</span>
                <span className="user-menu-name">{displayName}</span>
              </button>

              {isUserMenuOpen ? (
                <div className="user-menu-dropdown">
                  <div className="user-menu-summary">
                    <div className="user-menu-avatar large">{userInitial}</div>
                    <div className="user-chip-copy">
                      <strong>{displayName}</strong>
                      <span>Da dang nhap</span>
                    </div>
                  </div>

                  <button
                    className="user-menu-item"
                    type="button"
                    onClick={() => {
                      setActivePage('profile')
                      setIsUserMenuOpen(false)
                    }}
                  >
                    Trang thong tin nguoi dung
                  </button>

                  <button className="user-menu-item danger" type="button" onClick={handleLogout}>
                    Dang xuat
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>

      {isLoggedIn ? <ActivePage /> : <Login onLoginSuccess={handleLoginSuccess} />}
    </div>
  )
}

export default App
