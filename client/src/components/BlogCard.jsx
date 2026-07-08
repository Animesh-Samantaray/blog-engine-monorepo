import { Link } from 'react-router-dom'
import { serverUrl } from '../services/axios.js'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function BlogCard({ blog }) {
  const imageUrl = getImageUrl(blog.image)
  const summary = blog.content?.slice(0, 150) || 'No description available.'

  return (
    <article className="card-panel flex h-full flex-col overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={blog.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-medium text-slate-500">
          No image available
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span className="badge">{blog.category}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-slate-900">{blog.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{summary}</p>

        <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
          <div>
            <p className="font-medium text-slate-700">
              {blog.author?.name || 'Unknown author'}
            </p>
            <p>Author</p>
          </div>

          <Link to={`/blog/${blog._id}`} className="btn-primary px-4 py-2">
            Read More
          </Link>
        </div>
      </div>
    </article>
  )
}