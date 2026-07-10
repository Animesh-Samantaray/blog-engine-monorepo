import { useState, useEffect, useRef } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import loginVDO from './login.mp4'
import api from '../services/axios.js'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [submitting, setSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const inputRefs = useRef([])

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

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
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

  const handleChange = (value, index) => {
    // Only numeric input allowed
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Focus next input if a number is typed
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty and backspace is pressed
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        inputRefs.current[index - 1].focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    }
  }

  const handlePaste = (event) => {
    event.preventDefault()
    const pastedData = event.clipboardData.getData('text').trim()
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit OTP code.')
      return
    }

    const digits = pastedData.split('')
    setOtp(digits)
    inputRefs.current[5].focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP code.')
      return
    }

    setSubmitting(true)

    try {
      const { data } = await api.post('/auth/verify-otp', {
        email,
        otp: otpCode,
      })
      toast.success(data.message || 'OTP verified successfully.')
      navigate('/reset-password', { state: { email } })
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid or expired OTP.'
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

          <h2 className="mb-4 text-3xl font-extrabold tracking-widest text-white uppercase text-center">
            Verify OTP
          </h2>
          <p className="mb-10 text-sm text-slate-400 text-center">
            We sent a verification code to <span className="text-[#2bc98a] font-semibold">{email}</span>
          </p>

          <form className="w-full space-y-8" onSubmit={handleSubmit}>
            {/* OTP Code Inputs */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4 block text-center">
                Enter 6-Digit Code
              </label>
              <div className="flex justify-between gap-2 max-w-sm mx-auto">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold border-b-2 border-slate-700 bg-transparent text-white outline-none focus:border-[#2bc98a] transition-colors"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    required
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-[#2bc98a] py-4 text-sm font-bold uppercase tracking-widest text-[#060b14] shadow-lg shadow-[#2bc98a]/10 transition-all hover:bg-[#2ed693] hover:shadow-xl hover:shadow-[#2bc98a]/20 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md disabled:opacity-50 disabled:hover:bg-[#2bc98a] disabled:hover:-translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
            >
              {submitting ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            Did not receive a code?{' '}
            <Link to="/forgot-password" className="font-semibold text-[#2bc98a] hover:underline transition-colors">
              Resend OTP
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
