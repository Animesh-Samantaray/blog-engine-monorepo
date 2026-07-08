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

export default function CommentCard({ comment, actions }) {
  const imageUrl = getImageUrl(comment.user?.profileImage)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={comment.user?.name || 'User'}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-600">
            {(comment.user?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-semibold text-slate-900">{comment.user?.name || 'Unknown'}</h4>
            <span className="text-xs text-slate-500">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
            {comment.comment}
          </p>

          {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </article>
  )
}