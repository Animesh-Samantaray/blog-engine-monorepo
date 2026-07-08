import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loading from '../components/Loading.jsx'
import api from '../services/axios.js'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const loadAdminData = async () => {
      try {
        const [dashboardResponse, usersResponse, blogsResponse] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users'),
          api.get('/admin/blogs'),
        ])

        if (!isActive) {
          return
        }

        setStats(dashboardResponse.data.stats)
        setUsers(usersResponse.data.users || [])
        setBlogs(blogsResponse.data.blogs || [])
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load admin dashboard.')
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadAdminData()

    return () => {
      isActive = false
    }
  }, [])

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all related content?')) {
      return
    }

    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully.')
      setLoading(true)
      const [dashboardResponse, usersResponse, blogsResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/blogs'),
      ])
      setStats(dashboardResponse.data.stats)
      setUsers(usersResponse.data.users || [])
      setBlogs(blogsResponse.data.blogs || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Delete this blog?')) {
      return
    }

    try {
      await api.delete(`/admin/blogs/${blogId}`)
      toast.success('Blog deleted successfully.')
      setLoading(true)
      const [dashboardResponse, usersResponse, blogsResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/blogs'),
      ])
      setStats(dashboardResponse.data.stats)
      setUsers(usersResponse.data.users || [])
      setBlogs(blogsResponse.data.blogs || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loading message="Loading admin dashboard..." />
  }

  return (
    <section className="section-shell space-y-8">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Monitor users, blogs, and comments from one place.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Total Blogs</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{stats?.totalBlogs || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm text-slate-400">Total Comments</p>
          <p className="mt-2 text-3xl font-bold text-slate-50">{stats?.totalComments || 0}</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">Users Table</h2>
          <div className="table-wrap">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id}>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.email}</td>
                    <td className="table-cell capitalize">{item.role}</td>
                    <td className="table-cell">
                      <button
                        type="button"
                        className="btn-danger px-4 py-2"
                        onClick={() => handleDeleteUser(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-50">Blogs Table</h2>
          <div className="table-wrap">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((item) => (
                  <tr key={item._id}>
                    <td className="table-cell">{item.title}</td>
                    <td className="table-cell">{item.author?.name || 'Unknown'}</td>
                    <td className="table-cell">{formatDate(item.createdAt)}</td>
                    <td className="table-cell">
                      <button
                        type="button"
                        className="btn-danger px-4 py-2"
                        onClick={() => handleDeleteBlog(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}