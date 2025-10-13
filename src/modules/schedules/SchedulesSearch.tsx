import React from 'react'
import axios from 'axios'
import { CalendarView } from './CalendarView'

export type Schedule = {
  _id: string
  routeId: string
  departureTime: string
  arrivalTime: string
  price: number
  vehicleType: 'sitting' | 'sleeping'
  businessId: string
  status: 'active' | 'inactive' | 'cancelled'
}

type Props = {
  onSelect: (id: string) => void
}

export const SchedulesSearch: React.FC<Props> = ({ onSelect }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [filters, setFilters] = React.useState({
    vehicleType: '',
    vehicleCategory: '',
    capacityMin: '',
    capacityMax: '',
    status: 'active',
    date: '',
    from: '',
    to: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [items, setItems] = React.useState<Schedule[]>([])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const params: any = {}
      if (filters.vehicleType) params.vehicleType = filters.vehicleType
      if (filters.vehicleCategory) params.vehicleCategory = filters.vehicleCategory
      if (filters.capacityMin) params.capacityMin = filters.capacityMin
      if (filters.capacityMax) params.capacityMax = filters.capacityMax
      if (filters.status) params.status = filters.status
      if (filters.date) params.date = filters.date
      if (filters.from) params.from = filters.from
      if (filters.to) params.to = filters.to
      const res = await axios.get(`${apiBase}/api/schedules`, { params })
      setItems(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set default date to today
  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setFilters(prev => ({ ...prev, date: today }))
  }, [])

  return (
    <div className="space-y-4">
      {/* Calendar View */}
      <CalendarView 
        onDateSelect={(date) => {
          setFilters(prev => ({ ...prev, date }))
          // Auto search when date is selected
          setTimeout(() => fetchData(), 100)
        }}
        selectedDate={filters.date}
      />

      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">🔍 Search Bus Schedules</h2>
        
        {/* Primary Search Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">📍 From</label>
            <input 
              type="text" 
              placeholder="Departure city"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
              value={filters.from} 
              onChange={e=>setFilters(f=>({ ...f, from: e.target.value }))} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📍 To</label>
            <input 
              type="text" 
              placeholder="Destination city"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
              value={filters.to} 
              onChange={e=>setFilters(f=>({ ...f, to: e.target.value }))} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📅 Travel Date</label>
            <input 
              type="date" 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" 
              value={filters.date} 
              onChange={e=>setFilters(f=>({ ...f, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]} // Can't book past dates
            />
          </div>
          <div className="flex items-end">
            <button 
              onClick={fetchData} 
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔍 Search
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        <details className="mb-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
            🔧 Advanced Filters
          </summary>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm mb-1">Vehicle Type</label>
              <select className="w-full border rounded px-3 py-2" value={filters.vehicleType} onChange={e=>setFilters(f=>({ ...f, vehicleType: e.target.value }))}>
                <option value="">All Types</option>
                <option value="sitting">Sitting</option>
                <option value="sleeping">Sleeping</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Vehicle Category</label>
              <select className="w-full border rounded px-3 py-2" value={filters.vehicleCategory} onChange={e=>setFilters(f=>({ ...f, vehicleCategory: e.target.value }))}>
                <option value="">All Categories</option>
                <option value="bus16">Bus 16-seater</option>
                <option value="bus32">Bus 32-seater</option>
                <option value="limousine">Limousine</option>
                <option value="sleeper">Sleeper Bus</option>
                <option value="sitting">Sitting Bus</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Min Capacity</label>
              <input type="number" placeholder="e.g. 16" className="w-full border rounded px-3 py-2" value={filters.capacityMin} onChange={e=>setFilters(f=>({ ...f, capacityMin: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Max Capacity</label>
              <input type="number" placeholder="e.g. 40" className="w-full border rounded px-3 py-2" value={filters.capacityMax} onChange={e=>setFilters(f=>({ ...f, capacityMax: e.target.value }))} />
            </div>
          </div>
        </details>

        {error && <div className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded">{error}</div>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading && (
          <div className="bg-white border rounded p-4">Loading...</div>
        )}
        {!loading && items.length === 0 && (
          <div className="bg-white border rounded p-6 text-center text-gray-500">No schedules</div>
        )}
        {!loading && items.map((item: any) => (
          <div key={item._id} className="bg-white border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-500">Departure</div>
              <div className="font-semibold">{new Date(item.departureTime).toLocaleString()}</div>
              <div className="mt-2 text-sm text-gray-500">Arrival</div>
              <div className="font-semibold">{new Date(item.arrivalTime).toLocaleString()}</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Vehicle</div>
              <div className="font-semibold capitalize">{item.vehicleCategory || item.vehicleType}</div>
              {typeof item.capacity === 'number' && (
                <div className="text-sm text-gray-600">Capacity: {item.capacity}</div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Price</div>
              <div className="font-semibold">{item.price?.toLocaleString()} đ</div>
            </div>
            <div className="text-right">
              <button onClick={()=>onSelect(item._id)} className="px-3 py-2 bg-blue-600 text-white rounded">Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
