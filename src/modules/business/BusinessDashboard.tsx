import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

export const BusinessDashboard: React.FC = () => {
  const { accessToken } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [activeTab, setActiveTab] = React.useState<'schedules' | 'stats' | 'profile'>('schedules')
  const [schedules, setSchedules] = React.useState<any[]>([])
  const [stats, setStats] = React.useState<any>(null)
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [editingProfile, setEditingProfile] = React.useState(false)

  const loadSchedules = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/business/schedules`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setSchedules(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/business/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setStats(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/business/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setProfile(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: any) => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.put(`${apiBase}/api/business/profile`, {
        profile: profileData
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setProfile(res.data.data)
      setEditingProfile(false)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (activeTab === 'schedules') loadSchedules()
    if (activeTab === 'stats') loadStats()
    if (activeTab === 'profile') loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Business Dashboard</h2>
        <button onClick={() => {
          if (activeTab === 'schedules') loadSchedules()
          if (activeTab === 'stats') loadStats()
          if (activeTab === 'profile') loadProfile()
        }} className="px-3 py-2 bg-blue-600 text-white rounded">
          Refresh
        </button>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 ${activeTab === 'schedules' ? 'border-b-2 border-blue-500' : ''}`}
        >
          My Schedules ({schedules.length})
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}
        >
          Company Profile
        </button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {loading && <div>Loading...</div>}

      {!loading && activeTab === 'schedules' && (
        <div className="space-y-3">
          {schedules.map(schedule => (
            <div key={schedule._id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(schedule.status)}`}>
                    {schedule.status.toUpperCase()}
                  </span>
                  <span className="font-medium">{schedule.vehicleType}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(schedule.departureTime).toLocaleString()}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div>Price: {formatCurrency(schedule.price)}</div>
                <div>Available seats: {schedule.seats.filter((s: any) => s.isAvailable).length}/{schedule.maxSeats}</div>
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="text-center py-8 text-gray-500">No schedules found</div>
          )}
        </div>
      )}

      {!loading && activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-gray-700">Total Revenue</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-gray-700">Total Tickets</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.totalTickets}</p>
            </div>
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-gray-700">Average Revenue</h3>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.totalTickets > 0 ? stats.totalRevenue / stats.totalTickets : 0)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Ticket Status</h3>
              <div className="space-y-2">
                {Object.entries(stats.statusStats).map(([status, count]) => (
                  <div key={status} className="flex justify-between">
                    <span className="capitalize">{status}:</span>
                    <span className="font-medium">{count as number}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Monthly Revenue (Last 6 months)</h3>
              <div className="space-y-2">
                {stats.monthlyStats.map((month: any, index: number) => (
                  <div key={index} className="flex justify-between">
                    <span>{month._id.month}/{month._id.year}:</span>
                    <span className="font-medium">{formatCurrency(month.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && activeTab === 'profile' && (
        <div className="space-y-4">
          {editingProfile ? (
            <ProfileForm 
              profile={profile} 
              onSave={updateProfile}
              onCancel={() => setEditingProfile(false)}
            />
          ) : (
            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                <button 
                  onClick={() => setEditingProfile(true)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Edit
                </button>
              </div>
              
              {profile && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company Name</label>
                    <p className="text-gray-900">{profile.profile?.firstName} {profile.profile?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{profile.profile?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{profile.profile?.address || 'Not provided'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const ProfileForm: React.FC<{
  profile: any
  onSave: (data: any) => void
  onCancel: () => void
}> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
    firstName: profile?.profile?.firstName || '',
    lastName: profile?.profile?.lastName || '',
    phone: profile?.profile?.phone || '',
    address: profile?.profile?.address || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded p-4 space-y-4">
      <h3 className="text-lg font-semibold">Edit Company Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
