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
    <article className="card-panel flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-slate-600 hover:shadow-2xl hover:shadow-blue-950/20">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={blog.title}
          className="h-48 w-full object-cover"
        />
      ) : (
        <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-sm font-medium text-slate-400">
          No image available
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span className="badge">{blog.category}</span>
          <span>{formatDate(blog.createdAt)}</span>
        </div>

        <h3 className="text-lg font-semibold tracking-tight text-slate-50">{blog.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-400">{summary}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            {authorImage ? (
              <img
                src={authorImage}
                alt={blog.author?.name || 'Author'}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-blue-500/20"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-950/20">
                {(blog.author?.name || 'A').slice(0, 1).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate font-medium text-slate-100">
                {blog.author?.name || 'Unknown author'}
              </p>
              <p className="text-xs text-slate-400">Author</p>
            </div>
          </div>

          <Link to={`/blog/${blog._id}`} className="btn-primary px-4 py-2">
            Read More
          </Link>
        </div>
      </div>
    </article>
  )
}