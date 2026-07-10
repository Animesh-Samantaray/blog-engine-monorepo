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
      <section className="page-hero">
        <div className="section-shell grid gap-12 py-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:py-20">
          <div>
            <span className="badge">Blog Management Platform</span>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Publish your stories, build your audience
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              A modern workspace for writers and creators. Organize content, engage readers, and grow your blog with powerful tools.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/create-blog" className="btn-primary">
                  Create new post
                </Link>
              ) : (
                <Link to="/register" className="btn-primary">
                  Get started free
                </Link>
              )}
              <Link to="/dashboard" className="btn-secondary">
                Explore content
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div className="card-panel p-4">
                <p className="text-xs font-medium text-secondary">Create</p>
                <p className="mt-1 text-lg font-semibold text-primary">Fast</p>
              </div>
              <div className="card-panel p-4">
                <p className="text-xs font-medium text-secondary">Organize</p>
                <p className="mt-1 text-lg font-semibold text-primary">Simple</p>
              </div>
              <div className="card-panel p-4">
                <p className="text-xs font-medium text-secondary">Publish</p>
                <p className="mt-1 text-lg font-semibold text-primary">Easy</p>
              </div>
            </div>
          </div>

          <div className="panel-soft p-6">
            <h2 className="text-lg font-semibold text-primary">Discover content</h2>
            <p className="mt-2 text-sm leading-relaxed text-secondary">
              Search and filter through articles to find exactly what you're looking for.
            </p>

            <div className="mt-6 space-y-5">
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Latest posts</h2>
            <p className="section-subtitle">
              Browse the newest content from our community
            </p>
          </div>
          <p className="text-sm font-medium text-secondary">{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</p>
        </div>

        {loading ? (
          <Loading message="Loading posts..." />
        ) : blogs.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="card-panel p-12 text-center">
            <p className="text-sm text-secondary">No posts found for the current filters</p>
            <button
              type="button"
              className="btn-secondary mt-4"
              onClick={handleClear}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </div>
  )
}