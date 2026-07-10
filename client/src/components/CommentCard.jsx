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
    <article className="rounded-lg border p-4 transition-all duration-200 hover:shadow-md" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
      <div className="flex items-start gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={comment.user?.name || 'User'}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--color-blue), var(--color-purple))' }}>
            {(comment.user?.name || 'U').slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-primary">{comment.user?.name || 'Unknown'}</h4>
            <span className="text-xs text-secondary">{formatDate(comment.createdAt)}</span>
          </div>

          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-secondary">
            {comment.comment}
          </p>

          {actions ? <div className="mt-3 flex flex-wrap gap-2">{actions}</div> : null}
        </div>
      </div>
    </article>
  )
}