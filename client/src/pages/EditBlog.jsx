import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loading from '../components/Loading.jsx'
import api from '../services/axios.js'

export default function EditBlog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    category: 'Technology',
    content: '',
    image: null,
  })

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const { data } = await api.get(`/blog/${id}`)
        setForm({
          title: data.blog.title || '',
          category: data.blog.category || 'Technology',
          content: data.blog.content || '',
          image: null,
        })
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load blog.')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }

    loadBlog()
  }, [id, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required.')
      return
    }

    setSubmitting(true)

    try {
      const data = new FormData()
      data.append('title', form.title.trim())
      data.append('category', form.category)
      data.append('content', form.content.trim())

      if (form.image) {
        data.append('image', form.image)
      }

      await api.put(`/blog/${id}`, data)
      toast.success('Blog updated successfully.')
      navigate(`/blog/${id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update blog.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading message="Loading blog data..." />
  }

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="section-title">Edit post</h1>
          <p className="section-subtitle">Update your content and settings</p>
        </div>

        <form className="panel-soft space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
          <div>
            <label className="label-field" htmlFor="edit-title">
              Title
            </label>
            <input
              id="edit-title"
              className="input-field"
              placeholder="Enter your post title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="edit-category">
              Category
            </label>
            <select
              id="edit-category"
              className="input-field"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {['Technology', 'Sports', 'Art', 'Education', 'Travel', 'Food', 'Lifestyle', 'Other'].map(
                (category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label className="label-field" htmlFor="edit-image">
              Cover image <span className="text-xs font-normal text-secondary">(optional)</span>
            </label>
            <input
              id="edit-image"
              type="file"
              accept="image/*"
              className="input-field pt-2"
              onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
            />
          </div>

          <div>
            <label className="label-field" htmlFor="edit-content">
              Content
            </label>
            <textarea
              id="edit-content"
              rows="12"
              className="input-field resize-none"
              placeholder="Write your content here..."
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update post'}
          </button>
        </form>
      </div>
    </section>
  )
}