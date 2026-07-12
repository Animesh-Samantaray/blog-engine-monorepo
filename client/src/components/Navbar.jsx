import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { serverUrl } from '../services/axios.js'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 3.5V5.5M12 18.5V20.5M5.99 5.99L7.4 7.4M16.6 16.6L18.01 18.01M3.5 12H5.5M18.5 12H20.5M5.99 18.01L7.4 16.6M16.6 7.4L18.01 5.99"
        stroke="currentColor"
        strokeWidth="2"
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// 1. Standard Navigation Links (Subtle highlight on hover, bold highlight when active)
const navLinkClass = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 flex items-center ${
    isActive
      ? 'bg-[color:var(--color-blue)]/10 text-[color:var(--color-blue)]'
      : 'text-secondary hover:bg-[color:var(--color-bg-secondary)] hover:text-primary'
  }`

// 2. Ghost Button (For secondary actions like Login or Logout)
const ghostBtnClass =
  'px-4 py-2 text-sm font-medium rounded-md border border-[color:var(--color-border)] text-primary hover:bg-[color:var(--color-bg-secondary)] transition-colors'

// 3. Primary CTA (For main actions like Create Blog or Register)
const primaryCtaClass =
  'px-4 py-2 text-sm font-medium rounded-md bg-[color:var(--color-blue)] text-white hover:opacity-90 transition-opacity shadow-sm'

const getImageUrl = (image) => {
  if (!image) return ''
  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const profileImage = getImageUrl(user?.profileImage)

  // Enterprise sticky nav border appears only on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header 
      className={`sticky top-0 z-50 bg-[color:var(--color-bg)] transition-shadow duration-200 ${
        scrolled ? 'border-b border-[color:var(--color-border)] shadow-sm' : 'border-b border-[color:var(--color-border)]/50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left Side: Logo & Primary Routes */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded text-sm font-bold text-white shadow-sm" style={{ background: 'var(--color-blue)' }}>
                B
              </span>
              <span className="text-base font-bold tracking-tight text-primary hidden sm:block">
                BlogManager
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/" className={navLinkClass} end>Home</NavLink>
              {user && (
                <>
                  <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                  {user.role === 'admin' && (
                    <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                  )}
                </>
              )}
            </nav>
          </div>

          {/* Right Side: Theme, Auth, CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md text-secondary hover:bg-[color:var(--color-bg-secondary)] hover:text-primary transition-colors"
              onClick={toggleTheme}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            <div className="h-6 w-px bg-[color:var(--color-border)] mx-1"></div>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group cursor-pointer p-1 pr-3 rounded-md hover:bg-[color:var(--color-bg-secondary)] transition-colors">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={user?.name?.split(" ")[0] || 'Profile'}
                      className="h-7 w-7 rounded object-cover border border-[color:var(--color-border)]"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded text-xs font-bold text-[color:var(--color-blue)] bg-[color:var(--color-blue)]/10">
                      {(user?.name?.split(" ")[0] || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-secondary group-hover:text-primary max-w-[100px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
                
                <button type="button" className={ghostBtnClass + " !text-red-500 !border-red-500/30 hover:!bg-red-500/10"} onClick={handleLogout}>
                  Logout
                </button>
                <NavLink to="/create-blog" className={primaryCtaClass}>
                  Create Blog
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink to="/login" className={ghostBtnClass}>Login</NavLink>
                <NavLink to="/register" className={primaryCtaClass}>Register</NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              className="p-2 text-secondary hover:text-primary"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-[color:var(--color-border)] bg-[color:var(--color-bg)]">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="flex items-center justify-between px-3 py-2 mb-2">
              <span className="text-sm font-medium text-secondary">Theme</span>
              <button
                type="button"
                className="p-2 rounded-md bg-[color:var(--color-bg-secondary)] text-primary"
                onClick={toggleTheme}
              >
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
            </div>

            <NavLink to="/" className={navLinkClass} end onClick={() => setMenuOpen(false)}>Home</NavLink>
            
            {user ? (
              <>
                <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
                {user.role === 'admin' && (
                  <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
                )}
                
                <div className="my-4 border-t border-[color:var(--color-border)]"></div>
                
                <Link to="/profile" className="flex items-center gap-3 px-3 py-3" onClick={() => setMenuOpen(false)}>
                   {profileImage ? (
                    <img src={profileImage} alt="Profile" className="h-10 w-10 rounded object-cover border border-[color:var(--color-border)]" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded text-sm font-bold text-[color:var(--color-blue)] bg-[color:var(--color-blue)]/10">
                      {(user?.name || 'U').slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-primary">{user?.name}</p>
                    <p className="text-xs text-secondary">View Profile</p>
                  </div>
                </Link>

                <div className="flex flex-col gap-2 mt-4 px-3">
                  <NavLink to="/create-blog" className={primaryCtaClass + " w-full text-center"} onClick={() => setMenuOpen(false)}>
                    Create Blog
                  </NavLink>
                  <button type="button" className={ghostBtnClass + " w-full !text-red-500 !border-red-500/30"} onClick={async () => { await handleLogout(); setMenuOpen(false); }}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-4 px-3">
                <NavLink to="/login" className={ghostBtnClass + " w-full text-center"} onClick={() => setMenuOpen(false)}>Login</NavLink>
                <NavLink to="/register" className={primaryCtaClass + " w-full text-center"} onClick={() => setMenuOpen(false)}>Register</NavLink>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}