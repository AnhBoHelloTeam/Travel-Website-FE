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

      <div className="bg-white border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Departure</th>
              <th className="p-3">Arrival</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Price</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td className="p-3" colSpan={5}>Loading...</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td className="p-3" colSpan={5}>No schedules</td></tr>
            )}
            {!loading && items.map(item => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{new Date(item.departureTime).toLocaleString()}</td>
                <td className="p-3">{new Date(item.arrivalTime).toLocaleString()}</td>
                <td className="p-3 capitalize">{item.vehicleType}</td>
                <td className="p-3">{item.price.toLocaleString()} đ</td>
                <td className="p-3 text-right">
                  <button onClick={()=>onSelect(item._id)} className="px-2 py-1 border rounded">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
