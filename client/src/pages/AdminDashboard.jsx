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
  const [admins, setAdmins] = useState([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isActive = true

    const loadAdminData = async () => {
      try {
        const [dashboardResponse, usersResponse, blogsResponse, adminsResponse] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/users'),
          api.get('/admin/blogs'),
          api.get('/admin/admins'),
        ])

        if (!isActive) {
          return
        }

        setStats(dashboardResponse.data.stats)
        setUsers(usersResponse.data.users || [])
        setBlogs(blogsResponse.data.blogs || [])
        setAdmins(adminsResponse.data.adminEmails || [])
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
      const [dashboardResponse, usersResponse, blogsResponse, adminsResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/blogs'),
        api.get('/admin/admins'),
      ])
      setStats(dashboardResponse.data.stats)
      setUsers(usersResponse.data.users || [])
      setBlogs(blogsResponse.data.blogs || [])
      setAdmins(adminsResponse.data.adminEmails || [])
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
      const [dashboardResponse, usersResponse, blogsResponse, adminsResponse] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/blogs'),
        api.get('/admin/admins'),
      ])
      setStats(dashboardResponse.data.stats)
      setUsers(usersResponse.data.users || [])
      setBlogs(blogsResponse.data.blogs || [])
      setAdmins(adminsResponse.data.adminEmails || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (event) => {
    event.preventDefault()
    if (!newAdminEmail.trim()) {
      return
    }

    setAddingAdmin(true)
    try {
      await api.post('/admin/add-admin', { email: newAdminEmail.trim() })
      toast.success('Admin email added successfully.')
      setNewAdminEmail('')
      const response = await api.get('/admin/admins')
      setAdmins(response.data.adminEmails || [])
      
      const usersResponse = await api.get('/admin/users')
      setUsers(usersResponse.data.users || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add admin email.')
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleRemoveAdmin = async (email) => {
    if (!window.confirm(`Remove ${email} from allowed admin list?`)) {
      return
    }

    try {
      await api.delete('/admin/remove-admin', { data: { email } })
      toast.success('Admin email removed successfully.')
      const response = await api.get('/admin/admins')
      setAdmins(response.data.adminEmails || [])

      const usersResponse = await api.get('/admin/users')
      setUsers(usersResponse.data.users || [])
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove admin email.')
    }
  }

  if (loading) {
    return <Loading message="Loading admin dashboard..." />
  }

  return (
    <section className="section-shell space-y-8">
      <div>
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="section-subtitle">Manage users, content, and platform activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Total Users</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Total Blogs</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{stats?.totalBlogs || 0}</p>
        </div>
        <div className="card-panel p-6">
          <p className="text-sm font-medium text-secondary">Total Comments</p>
          <p className="mt-2 text-3xl font-semibold text-primary">{stats?.totalComments || 0}</p>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary">Users</h2>
          <div className="table-wrap">
            <table className="min-w-full divide-y" style={{ '--tw-divide-opacity': '1', borderColor: 'var(--color-border)' }}>
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
                        className="btn-danger px-4 py-2 text-xs"
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
          <h2 className="text-xl font-semibold text-primary">Blogs</h2>
          <div className="table-wrap">
            <table className="min-w-full divide-y" style={{ '--tw-divide-opacity': '1', borderColor: 'var(--color-border)' }}>
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
                        className="btn-danger px-4 py-2 text-xs"
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

      <div className="card-panel p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-primary">Allowed Admin Emails</h2>
          <p className="mt-2 text-sm text-secondary">
            Manage Gmail accounts allowed to login with Admin role via Google OAuth.
          </p>
        </div>

        <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter gmail address (e.g. user@gmail.com)"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="input-field max-w-md"
            required
          />
          <button
            type="submit"
            disabled={addingAdmin}
            className="btn-primary py-2 px-6"
          >
            {addingAdmin ? 'Adding...' : 'Allow Admin'}
          </button>
        </form>

        <div className="table-wrap">
          <table className="min-w-full divide-y" style={{ '--tw-divide-opacity': '1', borderColor: 'var(--color-border)' }}>
            <thead className="table-head">
              <tr>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Allowed By</th>
                <th className="px-4 py-3">Allowed Since</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length ? (
                admins.map((item) => (
                  <tr key={item._id}>
                    <td className="table-cell">{item.email}</td>
                    <td className="table-cell">{item.createdBy}</td>
                    <td className="table-cell">{formatDate(item.createdAt)}</td>
                    <td className="table-cell">
                      <button
                        type="button"
                        className="btn-danger px-4 py-2 text-xs"
                        onClick={() => handleRemoveAdmin(item.email)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="table-cell text-center italic text-secondary">
                    No admin email whitelist configured. Any OAuth signups will default to 'user' role.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}