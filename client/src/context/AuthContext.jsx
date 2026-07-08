import { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../services/axios.js'

/* eslint-disable react-refresh/only-export-components */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/profile')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isActive = true

    const run = async () => {
      try {
        const { data } = await api.get('/profile')
        if (isActive) {
          setUser(data.user)
        }
      } catch {
        if (isActive) {
          setUser(null)
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    run()

    return () => {
      isActive = false
    }
  }, [])

  const login = async (payload) => {
    try {
      const { data } = await api.post('/auth/login', payload)
      setUser(data.user)
      toast.success(data.message || 'Login successful.')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed.'
      toast.error(message)
      throw error
    }
  }

  const register = async (payload) => {
    try {
      const { data } = await api.post('/auth/register', payload)
      setUser(data.user)
      toast.success(data.message || 'Registration successful.')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed.'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      const { data } = await api.post('/auth/logout')
      setUser(null)
      toast.success(data.message || 'Logged out successfully.')
      return data
    } catch (error) {
      const message = error.response?.data?.message || 'Logout failed.'
      toast.error(message)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}