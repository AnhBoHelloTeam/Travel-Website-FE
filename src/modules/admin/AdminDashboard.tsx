import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

export const AdminDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [activeTab, setActiveTab] = React.useState<'users' | 'businesses' | 'tickets'>('users')
  const [users, setUsers] = React.useState<any[]>([])
  const [businesses, setBusinesses] = React.useState<any[]>([])
  const [tickets, setTickets] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/admin/users`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setUsers(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const loadBusinesses = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/admin/businesses`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setBusinesses(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load businesses')
    } finally {
      setLoading(false)
    }
  }

  const loadTickets = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/tickets/admin`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setTickets(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (activeTab === 'users') loadUsers()
    if (activeTab === 'businesses') loadBusinesses()
    if (activeTab === 'tickets') loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600 bg-purple-50'
      case 'business': return 'text-blue-600 bg-blue-50'
      case 'customer': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑'
      case 'business': return '🏢'
      case 'customer': return '👤'
      default: return '❓'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              ⚙️ Admin Dashboard
            </h1>
            <p className="text-red-100">Quản lý hệ thống và giám sát hoạt động</p>
          </div>
          <button 
            onClick={() => {
              if (activeTab === 'users') loadUsers()
              if (activeTab === 'businesses') loadBusinesses()
              if (activeTab === 'tickets') loadTickets()
            }} 
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">👥 Tổng người dùng</p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">🏢 Doanh nghiệp</p>
              <p className="text-2xl font-bold text-green-600">{businesses.length}</p>
            </div>
            <div className="text-3xl">🏢</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">🎫 Tổng vé</p>
              <p className="text-2xl font-bold text-purple-600">{tickets.length}</p>
            </div>
            <div className="text-3xl">🎫</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="flex space-x-1 p-2 bg-gray-50 rounded-t-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'users' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            👥 Người dùng ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'businesses' 
                ? 'bg-white text-green-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🏢 Doanh nghiệp ({businesses.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'tickets' 
                ? 'bg-white text-purple-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            🎫 Vé ({tickets.length})
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                Đang tải dữ liệu...
              </div>
            </div>
          )}

          {!loading && activeTab === 'users' && (
            <div className="space-y-4">
              {users.map(user => (
                <div key={user._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {user.role.toUpperCase()}
                          </span>
                          <span className="font-semibold text-gray-800">{user.email}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {user.profile?.firstName} {user.profile?.lastName} • {user.profile?.phone}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Tham gia: {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>Chưa có người dùng nào</p>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'businesses' && (
            <div className="space-y-4">
              {businesses.map(business => (
                <div key={business._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                        🏢
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">
                          {business.profile?.firstName} {business.profile?.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{business.email}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {business.profile?.phone} • {business.profile?.address}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Đăng ký: {new Date(business.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {businesses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏢</div>
                  <p>Chưa có doanh nghiệp nào</p>
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'tickets' && (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <div key={ticket._id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getStatusIcon(ticket.status)}</span>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status.toUpperCase()}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                          💺 Ghế {ticket.seatNumber} • {ticket.passengerInfo?.firstName} {ticket.passengerInfo?.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        {ticket.paymentInfo?.amount?.toLocaleString()} VNĐ
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    💳 {ticket.paymentInfo?.method?.toUpperCase()} • 📞 {ticket.passengerInfo?.phone}
                  </div>
                </div>
              ))}
              {tickets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎫</div>
                  <p>Chưa có vé nào</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

