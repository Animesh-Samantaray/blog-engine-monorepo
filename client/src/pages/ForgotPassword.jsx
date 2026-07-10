import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import loginVDO from './login.mp4'
import api from '../services/axios.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [gifKey, setGifKey] = useState(0)

  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setGifKey(Date.now()) // New key every mount
  }, [])

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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!email.trim()) {
      toast.error('Email is required.')
      return
    }

    // Simple email pattern check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email.trim())) {
      toast.error('Please enter a valid email address.')
      return
    }

    setSubmitting(true)

    try {
      const { data } = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      })
      toast.success(data.message || 'OTP sent successfully.')
      navigate('/verify-otp', { state: { email: email.trim().toLowerCase() } })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send OTP.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative flex h-[100dvh] w-full overflow-hidden bg-[#060b14] font-sans">
      {/* Desktop Left Side - Video background */}
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
            Forgot Password
          </h2>

          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative w-full group">
              <label
                className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]"
                htmlFor="email"
              >
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"
                    />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
              {submitting ? 'Sending...' : 'Send OTP'}
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
