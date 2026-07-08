import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import BlogCard from '../components/BlogCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Loading from '../components/Loading.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/axios.js'

export default function Home() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const { user } = useAuth()

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true)

        let endpoint = '/blog'

        if (query.trim()) {
          endpoint = `/blog/search?search=${encodeURIComponent(query.trim())}`
        } else if (category !== 'All') {
          endpoint = `/blog/category/${encodeURIComponent(category)}`
        }

        const { data } = await api.get(endpoint)
        setBlogs(data.blogs || [])
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load blogs.')
      } finally {
        setLoading(false)
      }
    }

    loadBlogs()
  }, [category, query])

  const handleSearch = () => {
    setCategory('All')
    setQuery(search)
  }

  const handleClear = () => {
    setSearch('')
    setQuery('')
    setCategory('All')
  }

  return (
    <div>
      <section className="border-b border-slate-200 bg-white">
        <div className="section-shell grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <div>
            <span className="badge"> MERN Blog Platform</span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Manage blogs with a simple, clean, and professional dashboard.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse articles, search by title, filter by category, write posts, and manage your
              profile from one organized interface.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/create-blog" className="btn-primary">
                  Create Blog
                </Link>
              ) : (
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              )}
              <Link to="/dashboard" className="btn-secondary">
                View Dashboard
              </Link>
            </div>
          </div>

          <div className="card-panel p-6">
            <h2 className="text-lg font-semibold text-slate-900">Find what you need</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Search blogs by title or jump straight into a category.
            </p>

            <div className="mt-5 space-y-5">
              <SearchBar
                value={search}
                onChange={setSearch}
                onSubmit={handleSearch}
                onClear={handleClear}
              />
              <CategoryFilter value={category} onChange={setCategory} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Latest Blogs</h2>
            <p className="section-subtitle">
              Browse the newest posts from the blogging community.
            </p>
          </div>
          <p className="text-sm text-slate-500">{blogs.length} posts found</p>
        </div>

        {loading ? (
          <Loading message="Loading blogs..." />
        ) : blogs.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="card-panel p-8 text-center text-slate-600">
            No blogs found for the current filters.
          </div>
        )}
      </section>
    </div>
  )
}