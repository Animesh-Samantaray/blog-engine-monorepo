import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlogCard from '../components/BlogCard.jsx'
import Loading from '../components/Loading.jsx'
import api from '../services/axios.js'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const temp = await api.get('/profile/dashboard');
        const response = temp.data;
        setData(response)
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return <Loading message="Loading dashboard..." />
  }

  return (
    <section className="section-shell space-y-8">
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle">Overview of your account activity and content</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Total Blogs</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{data?.totalBlogs || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Total Comments</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{data?.totalComments || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Profile</p>
          <p className="mt-2 text-lg font-semibold text-primary">{data?.user?.name || 'Account'}</p>
          <p className="mt-1 text-sm text-secondary">{data?.user?.email || 'No email'}</p>
        </div>
      </div>

      <div className="card-panel p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-primary">Recent posts</h2>
        <p className="mt-2 text-sm text-secondary">Your latest published content</p>

        {data?.blogs?.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border p-8 text-center text-sm text-secondary" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
            <p>You haven't created any posts yet</p>
            <Link to="/create-blog" className="btn-primary mt-4 inline-block">
              Create your first post
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}