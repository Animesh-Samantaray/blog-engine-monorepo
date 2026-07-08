import { useEffect, useState } from 'react'
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
        <p className="section-subtitle">A quick look at your account activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Total Blogs</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{data?.totalBlogs || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Total Comments</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{data?.totalComments || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Profile Info</p>
          <p className="mt-2 text-lg font-semibold text-slate-50">{data?.user?.name || 'Account'}</p>
          <p className="mt-1 text-sm text-slate-400">{data?.user?.email || 'No email available'}</p>
        </div>
      </div>

      <div className="card-panel p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-slate-50">Recent Blogs</h2>
        <p className="mt-2 text-sm text-slate-400">Your latest posts are shown below.</p>

        {data?.blogs?.length ? (
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
            You have not created any blogs yet.
          </div>
        )}
      </div>
    </section>
  )
}