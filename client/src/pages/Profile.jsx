import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import BlogCard from '../components/BlogCard.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api, { serverUrl } from '../services/axios.js'

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function Profile() {
  const { user, setUser } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', profileImage: null })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        const [profileResponse, blogsResponse] = await Promise.all([
          api.get('/profile'),
          api.get('/profile/blogs'),
        ])

        setUser(profileResponse.data.user)
        setBlogs(blogsResponse.data.blogs || [])
        setForm({
          name: profileResponse.data.user.name || '',
          bio: profileResponse.data.user.bio || '',
          profileImage: null,
        })
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load profile.')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [setUser])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('bio', form.bio)

      if (form.profileImage) {
        data.append('profileImage', form.profileImage)
      }

      const response = await api.put('/profile', data)
      setUser(response.data.user)
      setEditing(false)
      toast.success('Profile updated successfully.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading message="Loading profile..." />
  }

  const imageUrl = getImageUrl(user?.profileImage)

  return (
    <section className="section-shell space-y-8">
      <div className="panel-soft p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={user?.name || 'Profile'}
              className="h-28 w-28 rounded-2xl object-cover ring-1 ring-slate-700"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-2xl font-bold text-white shadow-lg shadow-blue-950/20">
              {(user?.name || 'U').slice(0, 1).toUpperCase()}
            </div>
          )}

          <div className="flex-1">
            {!editing ? (
              <>
                <h1 className="section-title">{user?.name}</h1>
                <p className="mt-2 text-sm text-slate-400">{user?.email}</p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-400">{user?.bio || 'No bio added yet.'}</p>
                <button type="button" className="btn-secondary mt-5" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="label-field" htmlFor="profile-name">
                    Name
                  </label>
                  <input
                    id="profile-name"
                    className="input-field"
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="label-field" htmlFor="profile-bio">
                    Bio
                  </label>
                  <textarea
                    id="profile-bio"
                    rows="4"
                    className="input-field resize-none"
                    value={form.bio}
                    onChange={(event) => setForm({ ...form, bio: event.target.value })}
                  />
                </div>

                <div>
                  <label className="label-field" htmlFor="profile-image">
                    Profile Image
                  </label>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="input-field pt-2"
                    onChange={(event) =>
                      setForm({ ...form, profileImage: event.target.files?.[0] || null })
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <h2 className="section-title">My Blogs</h2>
          <p className="section-subtitle">Posts you have created so far.</p>
        </div>

        {blogs.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="card-panel p-8 text-center text-slate-400">
            You have not created any blogs yet.
          </div>
        )}
      </div>
    </section>
  )
}