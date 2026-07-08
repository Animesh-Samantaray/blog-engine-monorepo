import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { serverUrl } from '../services/axios.js'

const linkClass = ({ isActive }) =>
  `rounded-full border px-4 py-2 text-sm font-medium transition duration-200 ${
    isActive
      ? 'border-blue-500/30 bg-blue-600 text-white shadow-lg shadow-blue-950/25'
      : 'border-slate-700 bg-slate-900/60 text-slate-200 hover:border-slate-500 hover:bg-slate-800/90 hover:text-white'
  }`

const profileChipClass =
  'flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-sm text-slate-200 transition duration-200 hover:border-slate-500 hover:bg-slate-800/90 hover:text-white'

const logoutClass =
  'rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition duration-200 hover:border-rose-400/30 hover:bg-rose-500/20 hover:text-rose-100'

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const profileImage = getImageUrl(user?.profileImage)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/70 bg-slate-950/80 backdrop-blur-xl">
      <div className="section-shell py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold tracking-tight text-slate-50">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-cyan-400 to-violet-500 text-sm font-black text-white shadow-lg shadow-blue-950/40">
              B
            </span>
            <span>Blog Manager</span>
          </Link>

          <button
            type="button"
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 md:hidden"
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
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-400/30"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
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
          <nav className="mt-4 flex flex-col gap-2 rounded-2xl border border-slate-700 bg-slate-900/95 p-3 md:hidden">
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
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-400/30"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white">
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