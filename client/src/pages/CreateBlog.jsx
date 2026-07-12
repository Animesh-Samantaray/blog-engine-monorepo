import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { showNotification,requestNotificationPermission } from '../utils/notification.js'
export default function CreateBlog() {


  const navigate = useNavigate()
  const [form, setForm] = useState({
  title: '',
  category: 'Technology',
  content: '',
  media: null,
})
  const [submitting, setSubmitting] = useState(false)
  const {user}=useAuth();
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

      if (form.media) {
    data.append("media", form.media)
}

      await api.post('/blog', data)
      const granted = await requestNotificationPermission();
      toast.success('Blog created successfully.')
      if (granted) {
  showNotification(
   "New Blog Created",`Good Job ${user?.name}`
  );
}
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
              Upload Image or Video <span className="text-xs font-normal text-secondary">(optional)</span>
            </label>
            <input
              id="image"
              type="file"
              accept="image/*,video/*"
              className="input-field pt-2"
              onChange={(e)=>
setForm({...form,media:e.target.files[0]})
}
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