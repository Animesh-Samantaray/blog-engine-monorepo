import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/axios.js'

export default function CreateBlog() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    category: 'Technology',
    content: '',
    image: null,
  })
  const [submitting, setSubmitting] = useState(false)

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

      await api.post('/blog', data)
      toast.success('Blog created successfully.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-shell">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="section-title">Create new post</h1>
          <p className="section-subtitle">Write and publish your content</p>
        </div>

        <form className="panel-soft space-y-5 p-6 sm:p-8" onSubmit={handleSubmit}>
          <div>
            <label className="label-field" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              className="input-field"
              placeholder="Enter your post title"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="label-field" htmlFor="category">
              Category
            </label>
            <select
              id="category"
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
            <label className="label-field" htmlFor="image">
              Cover image <span className="text-xs font-normal text-secondary">(optional)</span>
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="input-field pt-2"
              onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })}
            />
          </div>

          <div>
            <label className="label-field" htmlFor="content">
              Content
            </label>
            <textarea
              id="content"
              rows="12"
              className="input-field resize-none"
              placeholder="Write your content here..."
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Publishing...' : 'Publish post'}
          </button>
        </form>
      </div>
    </section>
  )
}