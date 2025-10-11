import React from 'react'
import axios from 'axios'

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
    date: ''
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

  return (
    <div className="space-y-4">
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Search Schedules</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Vehicle Type</label>
            <select className="w-full border rounded px-3 py-2" value={filters.vehicleType} onChange={e=>setFilters(f=>({ ...f, vehicleType: e.target.value }))}>
              <option value="">All</option>
              <option value="sitting">Sitting</option>
              <option value="sleeping">Sleeping</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Vehicle Category</label>
            <select className="w-full border rounded px-3 py-2" value={filters.vehicleCategory} onChange={e=>setFilters(f=>({ ...f, vehicleCategory: e.target.value }))}>
              <option value="">All</option>
              <option value="bus16">Bus 16</option>
              <option value="bus32">Bus 32</option>
              <option value="limousine">Limousine</option>
              <option value="sleeper">Sleeper</option>
              <option value="sitting">Sitting</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select className="w-full border rounded px-3 py-2" value={filters.status} onChange={e=>setFilters(f=>({ ...f, status: e.target.value }))}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Capacity Min</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={filters.capacityMin} onChange={e=>setFilters(f=>({ ...f, capacityMin: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Capacity Max</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={filters.capacityMax} onChange={e=>setFilters(f=>({ ...f, capacityMax: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={filters.date} onChange={e=>setFilters(f=>({ ...f, date: e.target.value }))} />
          </div>
        </div>
        <div className="mt-3">
          <button onClick={fetchData} className="px-3 py-2 bg-blue-600 text-white rounded">Search</button>
        </div>
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
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
