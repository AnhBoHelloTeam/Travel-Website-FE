import React from 'react'
import { useAuth } from '../modules/auth/AuthContext'

export const DebugAuth: React.FC = () => {
  const { user, isAuthenticated, accessToken } = useAuth()

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">🔍 Auth Debug</h3>
      <div className="space-y-1">
        <div><strong>Authenticated:</strong> {isAuthenticated ? '✅' : '❌'}</div>
        <div><strong>User:</strong> {user ? user.email : 'None'}</div>
        <div><strong>Role:</strong> {user?.role || 'None'}</div>
        <div><strong>Token:</strong> {accessToken ? '✅' : '❌'}</div>
        <div><strong>User ID:</strong> {user?._id || 'None'}</div>
      </div>
    </div>
  )
}
