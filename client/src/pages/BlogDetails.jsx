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
        
        {/* ========================================= */}
        {/* LEFT COLUMN: Main Article & Comments      */}
        {/* ========================================= */}
        <div className="space-y-10 lg:col-span-8">
          
          {/* Main Article Card */}
          <article className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 shadow-2xl backdrop-blur-sm">
            {imageUrl ? (
              <img src={imageUrl} alt={blog.title} className="h-72 w-full object-cover sm:h-96" />
            ) : (
              <div className="flex h-72 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 text-slate-500 sm:h-96">
                No image available
              </div>
            )}

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {/* Multicolor Badge */}
                <span className="rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-3 py-1 text-purple-300 border border-purple-500/30">
                  {blog.category}
                </span>
                <span className="text-slate-400">{formatDate(blog.createdAt)}</span>
              </div>

              {/* Multicolor Title */}
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-cyan-300 sm:text-5xl leading-tight">
                {blog.title}
              </h1>

              {/* Content */}
              <div className="mt-8 whitespace-pre-line text-lg leading-relaxed text-slate-300">
                {blog.content}
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <section className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm sm:p-10">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Discussion
            </h2>

            {user ? (
              <form className="mt-6 space-y-4" onSubmit={handleAddComment}>
                <textarea
                  id="comment"
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  required
                />
                <button type="submit" className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/50 hover:from-blue-500 hover:to-cyan-500 transition-all">
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5 text-sm text-slate-400">
                <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-2">
                  Login
                </Link>{' '}
                to join the conversation.
              </div>
            )}

            {/* Render Comments Array Here */}
            <div className="mt-8 space-y-6">
              {comments.length ? (
                comments.map((comment) => (
                  <div key={comment._id} className="space-y-4">
                    {editingCommentId === comment._id ? (
                      <div className="rounded-2xl border border-slate-700 bg-slate-900/50 p-5 backdrop-blur-sm shadow-lg">
                        <textarea
                          rows="3"
                          className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 p-4 text-slate-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                          value={editingCommentText}
                          onChange={(event) => setEditingCommentText(event.target.value)}
                        />
                        <div className="mt-4 flex flex-wrap gap-3">
                          <button
                            type="button"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2 font-semibold text-white shadow-lg shadow-blue-900/50 hover:from-blue-500 hover:to-cyan-500 transition-all"
                            onClick={() => handleUpdateComment(comment._id)}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2 font-semibold text-white shadow-sm hover:bg-slate-700 transition-all"
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
                                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-1.5 text-sm font-semibold text-slate-200 shadow-sm hover:bg-slate-700 hover:text-white transition-all"
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
                                  className="rounded-lg bg-gradient-to-r from-red-600 to-rose-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-red-900/40 hover:from-red-500 hover:to-rose-500 transition-all"
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
                <div className="text-center py-10 text-slate-500 italic">
                  Be the first to share your thoughts!
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ========================================= */}
        {/* RIGHT COLUMN: Sidebar (Author & Summary)  */}
        {/* ========================================= */}
        <aside className="space-y-8 lg:col-span-4">
          
          {/* Author Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-500">Written By</h3>
            <div className="flex flex-col items-center text-center">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={blog.author?.name || 'Author'}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-purple-500/30 shadow-2xl shadow-purple-900/50"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-3xl font-bold text-white shadow-xl shadow-purple-900/50">
                  {(blog.author?.name || 'A').slice(0, 1).toUpperCase()}
                </div>
              )}

              {/* Multicolor Author Name */}
              <p className="mt-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {blog.author?.name || 'Unknown author'}
              </p>
              
              {blog.author?.bio ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{blog.author.bio}</p>
              ) : null}
            </div>
          </div>

          {/* Blog Summary Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm sm:p-8">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-500">Article Details</h3>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <dt className="text-slate-400">Published</dt>
                <dd className="font-medium text-slate-200">{formatDate(blog.createdAt)}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <dt className="text-slate-400">Category</dt>
                <dd className="font-medium text-slate-200">{blog.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Status</dt>
                <dd className="font-medium">
                  {blog.isPublished ? (
                    <span className="text-emerald-400">Live</span>
                  ) : (
                    <span className="text-amber-400">Draft</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* Management Actions */}
          {canManageBlog ? (
            <div className="rounded-3xl border border-amber-900/30 bg-amber-950/10 p-6 backdrop-blur-sm sm:p-8">
               <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-500">Admin Actions</h3>
              <div className="flex flex-col gap-3">
                <Link 
                  to={`/edit-blog/${blog._id}`} 
                  className="flex justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-semibold text-white shadow-lg shadow-orange-900/40 hover:from-amber-400 hover:to-orange-400 transition-all"
                >
                  Edit Article
                </Link>
                <button 
                  type="button" 
                  onClick={handleDeleteBlog} 
                  className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3 font-semibold text-white shadow-lg shadow-red-900/40 hover:from-red-500 hover:to-rose-500 transition-all"
                >
                  Delete Article
                </button>
              </div>
            </div>
          ) : null}
          
        </aside>
      </div>
    </section>
  )
}