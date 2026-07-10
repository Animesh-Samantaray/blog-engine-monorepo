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
  const authorImage = getImageUrl(blog.author?.profileImage)

  return (
    <article className="card-panel flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={blog.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center text-sm font-medium text-secondary" style={{ background: 'var(--color-bg-secondary)' }}>
          No image available
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-secondary">
          <span className="badge">{blog.category}</span>
          <span className="text-xs">{formatDate(blog.createdAt)}</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-primary line-clamp-2">{blog.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-secondary">{summary}</p>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {authorImage ? (
              <img
                src={authorImage}
                alt={blog.author?.name || 'Author'}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))' }}>
                {(blog.author?.name?.split(" ")[0] || 'A').slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-primary">
                {blog.author?.name || 'Unknown author'}
              </p>
            </div>
          </div>

          <Link to={`/blog/${blog._id}`} className="btn-primary px-4 py-2 text-xs">
            Read
          </Link>
        </div>
      </div>
    </article>
  )
}