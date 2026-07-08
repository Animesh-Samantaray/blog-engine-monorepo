import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const linkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-600 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-lg font-bold tracking-tight text-slate-900">
            Blog Manager
          </Link>

          <button
            type="button"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={linkClass} end>
              Home
            </NavLink>
            {user ? (
              <>
                <NavLink to="/create-blog" className={linkClass}>
                  Create Blog
                </NavLink>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                {user.role === 'admin' ? (
                  <NavLink to="/admin" className={linkClass}>
                    Admin
                  </NavLink>
                ) : null}
                <button type="button" className="btn-secondary" onClick={handleLogout}>
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
          <nav className="mt-4 flex flex-col gap-2 md:hidden">
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
                  to="/profile"
                  className={linkClass}
                  onClick={() => setMenuOpen(false)}
                >
                  Profile
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
                <button
                  type="button"
                  className="btn-secondary"
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