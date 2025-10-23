import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { AppRoutes } from '../routes'
import { DebugAuth } from '../components/DebugAuth'

export const AppContent: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl p-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                🚌 Travel Website
              </Link>
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Trang chủ
                </Link>
                <Link 
                  to="/schedules"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/schedules') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Tìm chuyến
                </Link>
                {user && (
                  <Link 
                    to="/mytickets"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/mytickets') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Vé của tôi
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/admin') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Quản trị
                  </Link>
                )}
                {user?.role === 'business' && (
                  <Link 
                    to="/business"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/business') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    Nhà xe
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Xin chào, <span className="font-medium">{user.name}</span>
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link 
                    to="/login"
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    to="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6 flex-1 w-full">
        <AppRoutes />
      </main>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-5xl p-4 text-xs text-gray-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Travel Website</div>
          <div className="space-x-3">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
      
      {/* Debug component - remove in production */}
      <DebugAuth />
    </div>
  )
}
