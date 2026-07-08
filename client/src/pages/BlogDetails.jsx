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
    <section className="section-shell">
      <article className="card-panel overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={blog.title} className="h-64 w-full object-cover sm:h-80" />
        ) : (
          <div className="flex h-64 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-slate-400 sm:h-80">
            No image available
          </div>
        )}

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span className="badge">{blog.category}</span>
            <span>{formatDate(blog.createdAt)}</span>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
            {blog.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={blog.author?.name || 'Author'}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-blue-950/20">
                  {(blog.author?.name || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}

              <div>
                <p className="font-medium text-slate-100">{blog.author?.name || 'Unknown author'}</p>
                <p className="text-xs text-slate-400">Author</p>
              </div>
            </div>

            {blog.author?.bio ? <p className="max-w-2xl">{blog.author.bio}</p> : null}
          </div>

          <div className="mt-6 whitespace-pre-line text-base leading-8 text-slate-300">
            {blog.content}
          </div>

          {canManageBlog ? (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={`/edit-blog/${blog._id}`} className="btn-secondary">
                Edit
              </Link>
              <button type="button" onClick={handleDeleteBlog} className="btn-danger">
                Delete
              </button>
            </div>
          ) : null}
        </div>
      </article>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="card-panel p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-slate-50">Comments</h2>

          {user ? (
            <form className="mt-6 space-y-4" onSubmit={handleAddComment}>
              <div>
                <label className="label-field" htmlFor="comment">
                  Add Comment
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="input-field resize-none"
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn-primary">
                Comment
              </button>
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-sm text-slate-400">
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                Login
              </Link>{' '}
              to add a comment.
            </div>
          )}

          <div className="mt-6 space-y-4">
            {comments.length ? (
              comments.map((comment) => (
                <div key={comment._id} className="space-y-3">
                  {editingCommentId === comment._id ? (
                    <div className="card-panel p-4">
                      <textarea
                        rows="4"
                        className="input-field resize-none"
                        value={editingCommentText}
                        onChange={(event) => setEditingCommentText(event.target.value)}
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="btn-primary px-4 py-2"
                          onClick={() => handleUpdateComment(comment._id)}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn-secondary px-4 py-2"
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
                                className="btn-secondary px-4 py-2"
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
                                className="btn-danger px-4 py-2"
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
              <div className="rounded-2xl border border-slate-700 bg-slate-950/40 p-5 text-sm text-slate-400">
                No comments yet.
              </div>
            )}
          </div>
        </div>

        <aside className="card-panel p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-50">Blog Summary</h2>
          <dl className="mt-5 space-y-4 text-sm text-slate-400">
            <div>
              <dt className="font-medium text-slate-100">Author</dt>
              <dd>{blog.author?.name || 'Unknown'}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Published</dt>
              <dd>{formatDate(blog.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Category</dt>
              <dd>{blog.category}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-100">Status</dt>
              <dd>{blog.isPublished ? 'Published' : 'Draft'}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </section>
  )
}