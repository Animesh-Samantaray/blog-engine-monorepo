import { Navigate, useLocation } from 'react-router-dom'
import Loading from './Loading.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Checking session..." />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}