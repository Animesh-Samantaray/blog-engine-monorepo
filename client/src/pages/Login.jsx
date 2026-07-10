import { useState, useEffect } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import loginVDO from './login.mp4'
import { serverUrl } from '../services/axios.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [gifKey, setGifKey] = useState(0);
  // State to control the smooth fade-in entrance for the GIF
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { login, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

   useEffect(() => {
    setGifKey(Date.now()); // New key every mount
  }, []);

  // Triggers the fade-in effect shortly after the component mounts
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
    setSubmitting(true)

    try {
      await login(form)
      const destination = location.state?.from?.pathname || '/'
      navigate(destination, { replace: true })
    } catch (error) {
      console.error("Login failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // Main Container: 100dvh, strictly no scroll
    <main className="relative flex h-[100dvh] w-full overflow-hidden bg-[#060b14] font-sans">
      
      {/* Desktop Left Side - FULL COVERAGE GIF ONLY */}
      {/* Removed padding, flex centering, and added overflow-hidden */}
      <section className="hidden lg:block relative z-10 w-1/2 bg-[#2bc98a] border-r border-slate-800/50 overflow-hidden">
        
        {/* The VIDEO: Pinned to edges, covering full width and height */}
      <video
  key={location.key}      // Restart when the Login page is mounted
  autoPlay
  muted
  playsInline
  preload="auto"
  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${
    isLoaded ? "opacity-100" : "opacity-0"
  }`}
>
  <source src={loginVDO} type="video/mp4" />
</video>

      </section>

      {/* Mobile Center / Desktop Right Side (Login Form - Dark Theme) */}
      <section className="relative z-10 flex w-full lg:w-1/2 items-center justify-center p-6 bg-[#060b14]">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Avatar Icon */}
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#001E2B] shadow-lg border border-[#2bc98a]/20">
            <svg className="h-14 w-14 text-[#2bc98a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <h2 className="mb-10 text-3xl font-extrabold tracking-widest text-white uppercase">
            Welcome
          </h2>

          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            
            {/* Username / Email Input */}
            <div className="relative w-full group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="email">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                  placeholder="CSSScript.Com"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative w-full group">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="password">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  required
                />
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex w-full justify-end pt-1">
              <Link to="/forgot-password" className="text-sm font-semibold text-slate-500 hover:text-[#2bc98a] transition-colors">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#2bc98a] py-4 text-sm font-bold uppercase tracking-widest text-[#060b14] shadow-lg shadow-[#2bc98a]/10 transition-all hover:bg-[#2ed693] hover:shadow-xl hover:shadow-[#2bc98a]/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:hover:bg-[#2bc98a] disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {submitting ? 'Logging in...' : 'Login'}
            </button>

            {/* Divider */}
            <div className="relative my-6 w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#060b14] px-3 text-slate-500 font-bold tracking-wider">OR</span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <a
              href={`${import.meta.env.VITE_API_URL || serverUrl}/api/auth/google`}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-slate-700 bg-transparent py-4 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-800 hover:border-slate-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </a>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2bc98a] hover:underline transition-colors">
              Sign up
            </Link>
          </p>
          
        </div>
      </section>
      
    </main>
  )
}