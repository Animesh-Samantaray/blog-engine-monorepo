import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import BlogDetails from './pages/BlogDetails.jsx'
import CreateBlog from './pages/CreateBlog.jsx'
import EditBlog from './pages/EditBlog.jsx'
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  const location = useLocation()
  const hideShell = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen bg-transparent text-slate-200">
      {!hideShell ? <Navbar /> : null}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route
            path="/create-blog"
            element={
              <ProtectedRoute>
                <CreateBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-blog/:id"
            element={
              <ProtectedRoute>
                <EditBlog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideShell ? <Footer /> : null}
    </div>
  )
}

export default App
