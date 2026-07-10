import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import CommentCard from '../components/CommentCard.jsx'
import Loading from '../components/Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api, { serverUrl } from '../services/axios.js'

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))

const getImageUrl = (image) => {
  if (!image) {
    return ''
  }

  return image.startsWith('http') ? image : `${serverUrl}${image}`
}

export default function BlogDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [blog, setBlog] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentText, setEditingCommentText] = useState('')

  const imageUrl = useMemo(() => getImageUrl(blog?.image), [blog?.image])
  const authorImage = useMemo(() => getImageUrl(blog?.author?.profileImage), [blog?.author?.profileImage])

  useEffect(() => {
    let isActive = true

    const loadData = async () => {
      try {
        const blogResponse = await api.get(`/blog/${id}`)

        if (!isActive) {
          return
        }

        setBlog(blogResponse.data.blog)

        try {
          const commentsResponse = await api.get(`/comment/${id}`)

          if (isActive) {
            setComments(commentsResponse.data.comments || [])
          }
        } catch (commentError) {
          toast.error(commentError.response?.data?.message || 'Failed to load comments.')

          if (isActive) {
            setComments([])
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load blog details.')
        navigate('/')
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isActive = false
    }
  }, [id, navigate])

  const handleDeleteBlog = async () => {
    if (!window.confirm('Delete this blog?')) {
      return
    }

    try {
      await api.delete(`/blog/${id}`)
      toast.success('Blog deleted successfully.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog.')
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      const { data } = await api.post(`/comment/${id}`, { comment: commentText.trim() })
      setComments((current) => [data.comment, ...current])
      setCommentText('')
      toast.success('Comment added successfully.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add comment.')
    }
  }

  const handleUpdateComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      toast.error('Comment cannot be empty.')
      return
    }

    try {
      const { data } = await api.put(`/comment/${commentId}`, {
        comment: editingCommentText.trim(),
      })

      setComments((current) =>
        current.map((item) => (item._id === commentId ? data.comment : item)),
      )
      setEditingCommentId(null)
      setEditingCommentText('')
      toast.success('Comment updated successfully.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update comment.')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) {
      return
    }

    try {
      await api.delete(`/comment/${commentId}`)
      setComments((current) => current.filter((item) => item._id !== commentId))
      toast.success('Comment deleted successfully.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment.')
    }
  }

  if (loading || authLoading) {
    return <Loading message="Loading blog details..." />
  }

  if (!blog) {
    return null
  }

  const canManageBlog = user && (user.role === 'admin' || user._id === blog.author?._id)
  const canManageComment = (comment) =>
    user && (user.role === 'admin' || user._id === comment.user?._id)

  return (
    <section className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="space-y-10 lg:col-span-8">
          <article className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            {imageUrl ? (
              <img src={imageUrl} alt={blog.title} className="h-72 w-full object-cover sm:h-96" />
            ) : (
              <div className="flex h-72 items-center justify-center text-secondary sm:h-96" style={{ background: 'var(--color-bg-secondary)' }}>
                No image available
              </div>
            )}

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="badge">
                  {blog.category}
                </span>
                <span className="text-secondary">{formatDate(blog.createdAt)}</span>
              </div>

              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-primary sm:text-4xl leading-tight">
                {blog.title}
              </h1>

              <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-secondary">
                {blog.content}
              </div>
            </div>
          </article>

          <section className="rounded-xl border p-6 sm:p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            <h2 className="text-xl font-semibold text-primary">
              Discussion
            </h2>

            {user ? (
              <form className="mt-6 space-y-4" onSubmit={handleAddComment}>
                <textarea
                  id="comment"
                  rows="3"
                  className="input-field resize-none"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">
                  Post comment
                </button>
              </form>
            ) : (
              <div className="mt-6 rounded-lg border p-5 text-sm text-secondary" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-secondary)' }}>
                <Link to="/login" className="font-medium text-[color:var(--color-blue)] hover:underline">
                  Login
                </Link>{' '}
                to join the conversation.
              </div>
            )}

            <div className="mt-8 space-y-6">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment._id} className="space-y-4">
                    {editingCommentId === comment._id ? (
                      <div className="rounded-lg border p-5" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
                        <textarea
                          rows="3"
                          className="input-field resize-none"
                          value={editingCommentText}
                          onChange={(event) => setEditingCommentText(event.target.value)}
                        />
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="btn-primary"
                            onClick={() => handleUpdateComment(comment._id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => {
                              setEditingCommentId(null)
                              setEditingCommentText('')
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <CommentCard
                        comment={comment}
                        actions={
                          canManageComment(comment)
                            ? [
                                <button
                                  key="edit"
                                  type="button"
                                  className="btn-secondary px-4 py-1.5 text-sm"
                                  onClick={() => {
                                    setEditingCommentId(comment._id)
                                    setEditingCommentText(comment.comment)
                                  }}
                                >
                                  Edit
                                </button>,
                                <button
                                  key="delete"
                                  type="button"
                                  className="btn-danger px-4 py-1.5 text-sm"
                                  onClick={() => handleDeleteComment(comment._id)}
                                >
                                  Delete
                                </button>,
                              ]
                            : null
                        }
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="py-10 text-center italic text-secondary">
                  Be the first to share your thoughts!
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="rounded-xl border p-6 sm:p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-secondary">Written by</h3>
            <div className="flex flex-col items-center text-center">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={blog.author?.name || 'Author'}
                  className="h-20 w-20 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--color-purple), var(--color-blue))' }}>
                  {(blog.author?.name || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}

              <p className="mt-4 text-lg font-semibold text-primary">
                {blog.author?.name || 'Unknown author'}
              </p>
              
              {blog.author?.bio ? (
                <p className="mt-3 text-sm leading-relaxed text-secondary">{blog.author.bio}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border p-6 sm:p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
            <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-secondary">Article details</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                <dt className="text-secondary">Published</dt>
                <dd className="font-medium text-primary">{formatDate(blog.createdAt)}</dd>
              </div>
              <div className="flex justify-between border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                <dt className="text-secondary">Category</dt>
                <dd className="font-medium text-primary">{blog.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-secondary">Status</dt>
                <dd className="font-medium">
                  {blog.isPublished ? (
                    <span className="text-emerald-500">Live</span>
                  ) : (
                    <span className="text-amber-500">Draft</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {canManageBlog ? (
            <div className="rounded-xl border p-6 sm:p-8" style={{ borderColor: 'var(--color-border)', background: 'var(--color-card)' }}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-secondary">Actions</h3>
              <div className="flex flex-col gap-3">
                <Link 
                  to={`/edit-blog/${blog._id}`} 
                  className="btn-secondary"
                >
                  Edit article
                </Link>
                <button 
                  type="button" 
                  onClick={handleDeleteBlog} 
                  className="btn-danger"
                >
                  Delete article
                </button>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}