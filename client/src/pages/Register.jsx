import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import loginGif from './Login.gif'
import { serverUrl } from '../services/axios.js'

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    profileImage: '',
    adminAccessToken: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const { register, user, loading } = useAuth()
  const navigate = useNavigate()

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

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const image = await readFileAsDataUrl(file)
      setForm((current) => ({ ...current, profileImage: image }))
    } catch (error) {
      console.error("Failed to read file:", error)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return
    }

    setSubmitting(true)

    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // Main Container: 100dvh, strictly no scroll
    <main className="relative flex h-[100dvh] w-full overflow-hidden bg-[#060b14] font-sans">
      
      {/* Desktop Left Side - FULL COVERAGE GIF */}
      <section className="hidden lg:block relative z-10 w-1/2 bg-[#2bc98a] border-r border-slate-800/50 overflow-hidden">
        <img 
          src={loginGif} 
          alt="Register Animation" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </section>

      {/* Mobile Center / Desktop Right Side (Register Form - Dark Theme, Wide Layout) */}
      <section className="relative z-10 flex w-full lg:w-1/2 items-center justify-center p-6 bg-[#060b14]">
        <div className="w-full max-w-2xl flex flex-col items-center">
          
          {/* Avatar Icon */}
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#001E2B] shadow-lg border border-[#2bc98a]/20">
            <svg className="h-10 w-10 text-[#2bc98a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <h2 className="mb-6 text-2xl font-extrabold tracking-widest text-white uppercase">
            Create Account
          </h2>

          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            
            {/* Two Column Grid for wide rectangular inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              
              {/* Full Name */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="name">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="name"
                    type="text"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="register-email">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="register-password">
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Admin Access Token */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="adminAccessToken">
                  Admin Access Token
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L6 18H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="adminAccessToken"
                    type="text"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                    placeholder="Enter if provided"
                    value={form.adminAccessToken}
                    onChange={(event) => setForm({ ...form, adminAccessToken: event.target.value })}
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="profileImage">
                  Profile Image
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-sm text-slate-400 font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] cursor-pointer file:mr-4 file:py-0.5 file:px-2.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#2bc98a]/10 file:text-[#2bc98a] hover:file:bg-[#2bc98a]/20"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="relative w-full group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1 block transition-colors group-focus-within:text-[#2bc98a]" htmlFor="bio">
                  Bio
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-0 text-slate-600 transition-colors group-focus-within:text-[#2bc98a]">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    id="bio"
                    type="text"
                    className="w-full border-b-2 border-slate-700 bg-transparent py-2 pl-8 pr-3 text-white font-medium placeholder-slate-600 outline-none transition-colors focus:border-[#2bc98a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                    placeholder="Tell us about yourself..."
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  />
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-full bg-[#2bc98a] py-4 text-sm font-bold uppercase tracking-widest text-[#060b14] shadow-lg shadow-[#2bc98a]/10 transition-all hover:bg-[#2ed693] hover:shadow-xl hover:shadow-[#2bc98a]/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:hover:bg-[#2bc98a] disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="relative my-4 w-full">
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

          <p className="mt-6 text-center text-sm text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#2bc98a] hover:underline transition-colors">
              Sign in
            </Link>
          </p>
          
        </div>
      </section>
      
    </main>
  )
}