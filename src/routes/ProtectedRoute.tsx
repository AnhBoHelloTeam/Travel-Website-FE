import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../modules/auth/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'business' | 'customer'
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If role is required, check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />
      case 'business':
        return <Navigate to="/business" replace />
      case 'customer':
        return <Navigate to="/mytickets" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}
