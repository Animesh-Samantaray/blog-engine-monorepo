import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

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
  const { register, user, loading } = useAuth()
  const navigate = useNavigate()

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

    const image = await readFileAsDataUrl(file)
    setForm((current) => ({ ...current, profileImage: image }))
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
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-shell flex min-h-[calc(100vh-6rem)] items-center justify-center py-12">
      <div className="card-panel w-full max-w-md p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Register</h1>
          <p className="mt-2 text-sm text-slate-600">Create a new account to start posting.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-field" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="input-field"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className="input-field"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="input-field"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              rows="4"
              className="input-field resize-none"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
            />
          </div>

          <div>
            <label className="label-field" htmlFor="profileImage">
              Profile Image Upload
            </label>
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="input-field pt-2"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label className="label-field" htmlFor="adminAccessToken">
              Optional Admin Access Token
            </label>
            <input
              id="adminAccessToken"
              className="input-field"
              value={form.adminAccessToken}
              onChange={(event) => setForm({ ...form, adminAccessToken: event.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Login here
          </Link>
        </p>
      </div>
    </section>
  )
}