import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { serverUrl } from '../services/axios.js'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 3.5V5.5M12 18.5V20.5M5.99 5.99L7.4 7.4M16.6 16.6L18.01 18.01M3.5 12H5.5M18.5 12H20.5M5.99 18.01L7.4 16.6M16.6 7.4L18.01 5.99"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path
        d="M20 14.25A8.5 8.5 0 1 1 9.75 4 7 7 0 0 0 20 14.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const linkClass = ({ isActive }) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? 'bg-[color:var(--color-blue)] text-white'
      : 'text-secondary hover:bg-[color:var(--color-bg-secondary)] hover:text-primary'
  }`

const profileChipClass =
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-secondary transition-all duration-200 hover:bg-[color:var(--color-bg-secondary)] hover:text-primary'

const logoutClass =
  'rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition-all duration-200 hover:bg-red-500/10'

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const profileImage = getImageUrl(user?.profileImage)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b surface-divider bg-[color:var(--color-bg)] backdrop-blur-md transition-colors duration-200">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-base font-semibold tracking-tight text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))' }}>
              B
            </span>
            <span>Blog Manager</span>
          </Link>

          <button
            type="button"
            className="rounded-lg px-3 py-2 text-sm font-medium text-secondary md:hidden hover:bg-[color:var(--color-bg-secondary)]"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <span className="transition-all duration-300">{isDark ? <SunIcon /> : <MoonIcon />}</span>
            </button>
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink to="/create-blog" className={linkClass}>
                  Create Blog
                </NavLink>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                {user.role === 'admin' ? (
                  <NavLink to="/admin" className={linkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <Link
                  to="/profile"
                  className={profileChipClass}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name?.split(" ")[0] || 'Profile'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))' }}>
                      {(user?.name?.split(" ")[0] || 'Me').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden max-w-[120px] truncate lg:block">{user?.name?.split(" ")[0]}</span>
                </Link>
                <button type="button" className={logoutClass} onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {menuOpen ? (
          <nav className="mt-4 flex flex-col gap-2 rounded-xl border p-3 md:hidden" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            <button
              type="button"
              className="theme-toggle self-start"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <NavLink to="/" className={linkClass} end onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink
                  to="/create-blog"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Create Blog
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                {user.role === 'admin' ? (
                  <NavLink
                    to="/admin"
                    className={linkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin
                  </NavLink>
                ) : null}
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={profileChipClass}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name || 'Profile'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))' }}>
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span>{user?.name}</span>
                </Link>
                <button
                  type="button"
                  className={logoutClass}
                  onClick={async () => {
                    await handleLogout()
                    setMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        ) : null}
      </div>
    </header>
  )
}