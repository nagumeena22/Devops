import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('mindguard_currentUser')
    const storedRole = localStorage.getItem('mindguard_userRole')

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setRole(userData.role || storedRole)
      } catch (err) {
        console.error('Error parsing stored user data:', err)
        localStorage.removeItem('mindguard_currentUser')
        localStorage.removeItem('mindguard_userRole')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setRole(userData.role)
    localStorage.setItem('mindguard_currentUser', JSON.stringify(userData))
    localStorage.setItem('mindguard_userRole', userData.role)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem('mindguard_currentUser')
    localStorage.removeItem('mindguard_userRole')
  }

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData }
    setUser(newUser)
    localStorage.setItem('mindguard_currentUser', JSON.stringify(newUser))
  }

  const value = {
    user,
    role,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: role === 'admin',
    isTherapist: role === 'therapist',
    isUser: role === 'user'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
