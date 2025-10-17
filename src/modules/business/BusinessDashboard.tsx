import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'
import { SeatMap } from '../booking/SeatMap'

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

  // CRUD states
  const [creating, setCreating] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [scheduleForm, setScheduleForm] = React.useState<any>({
    routeId: '',
    departureTime: '',
    arrivalTime: '',
    price: 0,
    vehicleType: 'sleeping',
    vehicleCategory: 'sitting',
    capacity: 40,
    seatLayout: '2-2',
    status: 'active',
    maxSeats: 40
  })
  const [routes, setRoutes] = React.useState<any[]>([])

  const authHeaders = { Authorization: `Bearer ${accessToken}` }

  const loadSchedules = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/business/schedules`, { headers: authHeaders })
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
      const res = await axios.get(`${apiBase}/api/business/stats`, { headers: authHeaders })
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
      const res = await axios.get(`${apiBase}/api/business/profile`, { headers: authHeaders })
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
      const res = await axios.put(`${apiBase}/api/business/profile`, { profile: profileData }, { headers: authHeaders })
      setProfile(res.data.data)
      setEditingProfile(false)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  // Create schedule
  const createSchedule = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...scheduleForm,
        // optional: initial seats array can be omitted; backend validates required fields
      }
      await axios.post(`${apiBase}/api/schedules`, payload, { headers: authHeaders })
      setCreating(false)
      setScheduleForm({ routeId: '', departureTime: '', arrivalTime: '', price: 0, vehicleType: 'sleeping', vehicleCategory: 'sitting', capacity: 40, seatLayout: '2-2', status: 'active', maxSeats: 40 })
      await loadSchedules()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create schedule')
    } finally {
      setLoading(false)
    }
  }

  // Prepare edit
  const startEdit = (s: any) => {
    setEditingId(s._id)
    setScheduleForm({
      routeId: s.routeId,
      departureTime: new Date(s.departureTime).toISOString().slice(0,16), // for datetime-local
      arrivalTime: new Date(s.arrivalTime).toISOString().slice(0,16),
      price: s.price,
      vehicleType: s.vehicleType,
      vehicleCategory: s.vehicleCategory || 'sitting',
      capacity: s.capacity || s.maxSeats || 40,
      seatLayout: s.seatLayout || '2-2',
      status: s.status,
      maxSeats: s.maxSeats || s.capacity || 40
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setScheduleForm({ routeId: '', departureTime: '', arrivalTime: '', price: 0, vehicleType: 'sleeping', vehicleCategory: 'sitting', capacity: 40, seatLayout: '2-2', status: 'active', maxSeats: 40 })
  }

  const updateSchedule = async () => {
    if (!editingId) return
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...scheduleForm,
      }
      await axios.put(`${apiBase}/api/schedules/${editingId}`, payload, { headers: authHeaders })
      cancelEdit()
      await loadSchedules()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to update schedule')
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id: string) => {
    if (!confirm('Delete this schedule?')) return
    setLoading(true)
    setError('')
    try {
      await axios.delete(`${apiBase}/api/schedules/${id}`, { headers: authHeaders })
      await loadSchedules()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to delete schedule')
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

  // Load routes for dropdown when schedules tab is active or creating/editing
  React.useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/routes`)
        setRoutes(res.data.data || [])
      } catch {}
    }
    if (activeTab === 'schedules') {
      loadRoutes()
    }
  }, [activeTab])

  // Suggest defaults for capacity/layout when vehicleCategory changes
  const applyVehicleDefaults = (category: string) => {
    switch (category) {
      case 'bus16':     return { capacity: 16, seatLayout: '2-2' }
      case 'bus32':     return { capacity: 32, seatLayout: '2-2' }
      case 'limousine': return { capacity: 12, seatLayout: '2-1' }
      case 'sleeper':   return { capacity: 40, seatLayout: '2-1' }
      default:          return { capacity: 40, seatLayout: '2-2' }
    }
  }

  const categoryOptions: Array<{ key: string; label: string; hint: string; capacity: number; layout: string }> = [
    { key: 'sitting',   label: 'Ghế ngồi',     hint: '40 chỗ', capacity: 40, layout: '2-2' },
    { key: 'bus16',     label: 'Xe 16 chỗ',    hint: '2-2',    capacity: 16, layout: '2-2' },
    { key: 'bus32',     label: 'Xe 32 chỗ',    hint: '2-2',    capacity: 32, layout: '2-2' },
    { key: 'limousine', label: 'Limousine',    hint: '2-1',    capacity: 12, layout: '2-1' },
    { key: 'sleeper',   label: 'Giường nằm',   hint: '2-1',    capacity: 40, layout: '2-1' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50'
      case 'inactive': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
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
        <button onClick={() => setActiveTab('schedules')} className={`px-4 py-2 ${activeTab === 'schedules' ? 'border-b-2 border-blue-500' : ''}`}>My Schedules ({schedules.length})</button>
        <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-500' : ''}`}>Statistics</button>
        <button onClick={() => setActiveTab('profile')} className={`px-4 py-2 ${activeTab === 'profile' ? 'border-b-2 border-blue-500' : ''}`}>Company Profile</button>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading && <div>Loading...</div>}

      {!loading && activeTab === 'schedules' && (
        <div className="space-y-3">
          <div className="flex justify-end">
            {creating ? (
              <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm" onClick={()=>{ setCreating(false); setScheduleForm({ routeId: '', departureTime: '', arrivalTime: '', price: 0, vehicleType: 'sleeping', status: 'active', maxSeats: 40 }) }}>Cancel</button>
            ) : (
              <button className="px-3 py-1 bg-green-600 text-white rounded text-sm" onClick={()=>setCreating(true)}>+ New Schedule</button>
            )}
          </div>

          {creating && (
            <ScheduleForm
              form={scheduleForm}
              setForm={setScheduleForm}
              onSubmit={createSchedule}
              onCategoryChange={(cat)=>{
                const d = applyVehicleDefaults(cat)
                setScheduleForm((prev: any)=>({ ...prev, vehicleCategory: cat, capacity: d.capacity, seatLayout: d.seatLayout }))
              }}
              submitLabel="Create"
              routes={routes}
              categoryOptions={categoryOptions}
            />
          )}

          {editingId && (
            <ScheduleForm
              form={scheduleForm}
              setForm={setScheduleForm}
              onSubmit={updateSchedule}
              onCancel={cancelEdit}
              onCategoryChange={(cat)=>{
                const d = applyVehicleDefaults(cat)
                setScheduleForm((prev: any)=>({ ...prev, vehicleCategory: cat, capacity: d.capacity, seatLayout: d.seatLayout }))
              }}
              submitLabel="Update"
              routes={routes}
              categoryOptions={categoryOptions}
            />
          )}

          {schedules.map(schedule => (
            <div key={schedule._id} className="bg-white border rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(schedule.status)}`}>{schedule.status.toUpperCase()}</span>
                  <span className="font-medium capitalize">{schedule.vehicleType}</span>
                </div>
                <div className="text-sm text-gray-600">{new Date(schedule.departureTime).toLocaleString()}</div>
              </div>
              <div className="text-sm text-gray-600 mb-3">
                <div>Price: {formatCurrency(schedule.price)}</div>
                <div>Available seats: {schedule.seats.filter((s: any) => s.isAvailable).length}/{schedule.maxSeats}</div>
                <div>Layout: {schedule.seatLayout || '2-2'}</div>
              </div>
              
              {/* Seat Map Preview */}
              <div className="mb-3">
                <div className="text-sm font-medium mb-2">Seat Map:</div>
                <div className="scale-75 origin-top-left">
                  <SeatMap
                    seats={schedule.seats || []}
                    seatLayout={schedule.seatLayout || '2-2'}
                    selectedSeat={null}
                    onSeatSelect={() => {}} // Read-only
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" onClick={()=>startEdit(schedule)}>Edit</button>
                <button className="px-3 py-1 bg-red-600 text-white rounded text-sm" onClick={()=>deleteSchedule(schedule._id)}>Delete</button>
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
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalTickets > 0 ? stats.totalRevenue / stats.totalTickets : 0)}</p>
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
            <ProfileForm profile={profile} onSave={updateProfile} onCancel={() => setEditingProfile(false)} />
          ) : (
            <div className="bg-white border rounded p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Company Information</h3>
                <button onClick={() => setEditingProfile(true)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Edit</button>
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

const ProfileForm: React.FC<{ profile: any; onSave: (data: any) => void; onCancel: () => void }> = ({ profile, onSave, onCancel }) => {
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
          <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded px-3 py-2" rows={3} />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
      </div>
    </form>
  )
}

const ScheduleForm: React.FC<{
  form: any
  setForm: (updater: any) => void
  onSubmit: () => void
  onCancel?: () => void
  submitLabel: string
  onCategoryChange?: (cat: string) => void
  routes: any[]
  categoryOptions: Array<{ key: string; label: string; hint: string; capacity: number; layout: string }>
}> = ({ form, setForm, onSubmit, onCancel, submitLabel, onCategoryChange, routes, categoryOptions }) => {
  const generateSeats = (capacity: number, seatLayout: string) => {
    const [left, right] = (seatLayout || '2-2').split('-').map(n => parseInt(n || '2', 10))
    const perRow = left + right
    const rows = Math.ceil(capacity / perRow)
    const seats: any[] = []
    let seatNumber = 1
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < perRow && seatNumber <= capacity; c++) {
        seats.push({ seatNumber: String(seatNumber), isAvailable: true, seatType: r === 0 ? 'vip' : 'normal' })
        seatNumber++
      }
    }
    return seats
  }

  const previewSeats = React.useMemo(() => generateSeats(form.capacity || 0, form.seatLayout || '2-2'), [form.capacity, form.seatLayout])

  return (
    <div className="bg-white border rounded p-4 space-y-4">
      <h3 className="text-lg font-semibold">Schedule</h3>

      {/* Preset vehicle selector */}
      <div>
        <label className="block text-sm mb-2">Chọn loại xe (preset)</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {categoryOptions.map(opt => {
            const active = form.vehicleCategory === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  setForm((prev: any) => ({ ...prev, vehicleCategory: opt.key, capacity: opt.capacity, seatLayout: opt.layout }))
                  onCategoryChange && onCategoryChange(opt.key)
                }}
                className={`text-left border rounded px-3 py-2 ${active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                title={`${opt.label} - ${opt.hint}`}
              >
                <div className="font-medium">{opt.label}</div>
                <div className="text-xs text-gray-500">{opt.hint} • {opt.capacity} chỗ</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Route</label>
          <select className="w-full border rounded px-3 py-2" value={form.routeId} onChange={e=>setForm((prev: any)=>({ ...prev, routeId: e.target.value }))}>
            <option value="">Select route</option>
            {routes.map((r: any) => (
              <option key={r._id} value={r._id}>{r.from} → {r.to}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Vehicle Type</label>
          <select className="w-full border rounded px-3 py-2" value={form.vehicleType} onChange={e=>setForm((prev: any)=>({ ...prev, vehicleType: e.target.value }))}>
            <option value="sitting">Sitting</option>
            <option value="sleeping">Sleeping</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Capacity</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.capacity} onChange={e=>setForm((prev: any)=>({ ...prev, capacity: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Seat Layout</label>
          <select className="w-full border rounded px-3 py-2" value={form.seatLayout} onChange={e=>setForm((prev: any)=>({ ...prev, seatLayout: e.target.value }))}>
            <option value="2-2">2-2</option>
            <option value="2-1">2-1</option>
            <option value="1-1">1-1</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Departure Time</label>
          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.departureTime} onChange={e=>setForm((prev: any)=>({ ...prev, departureTime: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Arrival Time</label>
          <input type="datetime-local" className="w-full border rounded px-3 py-2" value={form.arrivalTime} onChange={e=>setForm((prev: any)=>({ ...prev, arrivalTime: e.target.value }))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Price (VND)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={form.price} onChange={e=>setForm((prev: any)=>({ ...prev, price: Number(e.target.value) }))} />
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select className="w-full border rounded px-3 py-2" value={form.status} onChange={e=>setForm((prev: any)=>({ ...prev, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <div className="text-sm font-medium mb-2">Seat Map Preview</div>
        <div className="scale-90 origin-top-left border rounded p-2">
          <SeatMap seats={previewSeats} seatLayout={form.seatLayout || '2-2'} selectedSeat={null} onSeatSelect={() => {}} />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-300 text-gray-700 rounded">Cancel</button>
        )}
        <button onClick={onSubmit} className="px-3 py-2 bg-green-600 text-white rounded">{submitLabel}</button>
      </div>
    </div>
  )
}
