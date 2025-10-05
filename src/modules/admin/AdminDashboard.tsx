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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <button onClick={() => {
          if (activeTab === 'users') loadUsers()
          if (activeTab === 'businesses') loadBusinesses()
          if (activeTab === 'tickets') loadTickets()
        }} className="px-3 py-2 bg-blue-600 text-white rounded">
          Refresh
        </button>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 ${activeTab === 'users' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('businesses')}
          className={`px-4 py-2 ${activeTab === 'businesses' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Businesses ({businesses.length})
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 ${activeTab === 'tickets' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Tickets ({tickets.length})
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {loading && <div>Loading...</div>}

      {!loading && activeTab === 'users' && (
        <div className="space-y-3">
          {users.map(user => (
            <div key={user._id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getRoleColor(user.role)}`}>
                    {user.role.toUpperCase()}
                  </span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                <div>{user.profile?.firstName} {user.profile?.lastName}</div>
                <div>{user.profile?.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'businesses' && (
        <div className="space-y-3">
          {businesses.map(business => (
            <div key={business._id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{business.profile?.firstName} {business.profile?.lastName}</div>
                  <div className="text-sm text-gray-600">{business.email}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(business.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activeTab === 'tickets' && (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <div key={ticket._id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.toUpperCase()}
                  </span>
                  <span className="text-sm">Seat: {ticket.seatNumber}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(ticket.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Passenger: {ticket.passengerInfo?.firstName} {ticket.passengerInfo?.lastName}</div>
                <div>Amount: {ticket.paymentInfo?.amount?.toLocaleString()} đ</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        (activeTab === 'users' && users.length === 0) ||
        (activeTab === 'businesses' && businesses.length === 0) ||
        (activeTab === 'tickets' && tickets.length === 0)
      ) && (
        <div className="text-center py-8 text-gray-500">No data found</div>
      )}
    </div>
  )
}

