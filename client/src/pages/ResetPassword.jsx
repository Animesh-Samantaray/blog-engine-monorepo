import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import loginVDO from './login.mp4'
import api from '../services/axios.js'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loading message="Checking session..." />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  // If no email exists in the state, redirect to forgot-password
  if (!email) {
    return <Navigate to="/forgot-password" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!password) {
      toast.error('New Password is required.')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    if (!confirmPassword) {
      toast.error('Confirm Password is required.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setSubmitting(true)

    try {
      const { data } = await api.post('/auth/reset-password', {
        email,
        password,
      })
      toast.success(data.message || 'Password reset successfully.')
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex h-[100dvh] w-full overflow-hidden bg-[#060b14] font-sans">
      {/* Desktop Left Side */}
      <section className="hidden lg:block relative z-10 w-1/2 bg-[#2bc98a] border-r border-slate-800/50 overflow-hidden">
        <video
          key={location.key}
          autoPlay
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={loginVDO} type="video/mp4" />
        </video>
      </section>

      {/* Mobile Center / Desktop Right Side */}
      <section className="relative z-10 flex w-full lg:w-1/2 items-center justify-center p-6 bg-[#060b14]">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Avatar Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#001E2B] shadow-lg border border-[#2bc98a]/20">
            <svg className="h-14 w-14 text-[#2bc98a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <h2 className="mb-10 text-3xl font-extrabold tracking-widest text-white uppercase text-center">
            Reset Password
          </h2>

          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            {/* New Password Input */}
            <div className="relative w-full group">
              <label
                className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]"
                htmlFor="password"
              >
                New Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative w-full group">
              <label
                className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#2bc98a] py-4 text-sm font-bold uppercase tracking-widest text-[#060b14] shadow-lg shadow-[#2bc98a]/10 transition-all hover:bg-[#2ed693] hover:shadow-xl hover:shadow-[#2bc98a]/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:hover:bg-[#2bc98a] disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-[#2bc98a] hover:underline transition-colors">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
