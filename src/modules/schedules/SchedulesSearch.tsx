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

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Đà Nẵng' },
    { from: 'TP.HCM', to: 'Đà Lạt' },
    { from: 'Hà Nội', to: 'Hải Phòng' },
    { from: 'Đà Nẵng', to: 'Huế' },
    { from: 'TP.HCM', to: 'Nha Trang' },
    { from: 'Hà Nội', to: 'Sapa' },
  ]

  const quickDateOptions = [
    { label: 'Hôm nay', days: 0 },
    { label: 'Ngày mai', days: 1 },
    { label: '2 ngày nữa', days: 2 },
    { label: '3 ngày nữa', days: 3 },
  ]

  const setQuickDate = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    setFilters(prev => ({ ...prev, date: date.toISOString().split('T')[0] }))
  }

  return (
    <div className="space-y-6">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">🚌 Tìm chuyến xe phù hợp</h1>
        <p className="text-blue-100 mb-6">Tìm kiếm và so sánh giá vé từ nhiều nhà xe uy tín</p>
        
        {/* Primary Search Filters */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-2">📍 Điểm đi</label>
              <input 
                type="text" 
                placeholder="Nhập điểm đi..."
                className="w-full border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 text-gray-900" 
                value={filters.from} 
                onChange={e=>setFilters(f=>({ ...f, from: e.target.value }))} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">🎯 Điểm đến</label>
              <input 
                type="text" 
                placeholder="Nhập điểm đến..."
                className="w-full border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 text-gray-900" 
                value={filters.to} 
                onChange={e=>setFilters(f=>({ ...f, to: e.target.value }))} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">📅 Ngày đi</label>
              <input 
                type="date" 
                className="w-full border-0 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 text-gray-900" 
                value={filters.date} 
                onChange={e=>setFilters(f=>({ ...f, date: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-end">
              <button 
                onClick={fetchData} 
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 font-bold"
              >
                🔍 Tìm vé
              </button>
            </div>
          </div>

          {/* Quick Date Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium">⚡ Chọn nhanh:</span>
            {quickDateOptions.map(option => (
              <button
                key={option.days}
                onClick={() => setQuickDate(option.days)}
                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Popular Routes */}
          <div>
            <span className="text-sm font-medium mb-2 block">🌟 Tuyến phổ biến:</span>
            <div className="flex flex-wrap gap-2">
              {popularRoutes.map((route, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, from: route.from, to: route.to }))
                  }}
                  className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-sm transition-colors"
                >
                  {route.from} → {route.to}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <CalendarView 
        onDateSelect={(date) => {
          setFilters(prev => ({ ...prev, date }))
          setTimeout(() => fetchData(), 100)
        }}
        selectedDate={filters.date}
      />

      {/* Advanced Filters */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <details className="mb-4">
          <summary className="cursor-pointer text-lg font-semibold text-gray-700 hover:text-gray-900 flex items-center gap-2">
            🔧 Bộ lọc nâng cao
            <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span>
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">🚗 Loại xe</label>
              <select className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filters.vehicleType} onChange={e=>setFilters(f=>({ ...f, vehicleType: e.target.value }))}>
                <option value="">Tất cả loại xe</option>
                <option value="sitting">Ghế ngồi</option>
                <option value="sleeping">Giường nằm</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">🚌 Hạng xe</label>
              <select className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filters.vehicleCategory} onChange={e=>setFilters(f=>({ ...f, vehicleCategory: e.target.value }))}>
                <option value="">Tất cả hạng xe</option>
                <option value="bus16">Xe 16 chỗ</option>
                <option value="bus32">Xe 32 chỗ</option>
                <option value="limousine">Limousine</option>
                <option value="sleeper">Giường nằm</option>
                <option value="sitting">Ghế ngồi</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">💺 Số ghế tối thiểu</label>
              <input type="number" placeholder="VD: 16" className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filters.capacityMin} onChange={e=>setFilters(f=>({ ...f, capacityMin: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">💺 Số ghế tối đa</label>
              <input type="number" placeholder="VD: 40" className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" value={filters.capacityMax} onChange={e=>setFilters(f=>({ ...f, capacityMax: e.target.value }))} />
            </div>
          </div>
        </details>

        {error && <div className="text-red-600 text-sm mt-2 bg-red-50 p-3 rounded-lg border border-red-200">{error}</div>}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {loading && (
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="inline-flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              Đang tìm kiếm chuyến xe...
            </div>
          </div>
        )}
        
        {!loading && items.length === 0 && (
          <div className="bg-white border rounded-xl p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Không tìm thấy chuyến xe</h3>
            <p className="text-gray-500">Hãy thử thay đổi điều kiện tìm kiếm hoặc chọn ngày khác</p>
          </div>
        )}
        
        {!loading && items.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                📋 Kết quả tìm kiếm ({items.length} chuyến)
              </h3>
              <div className="text-sm text-gray-500">
                Hiển thị từ rẻ nhất đến đắt nhất
              </div>
            </div>
            
            {items.map((item: any) => (
              <div key={item._id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">🕐 Giờ khởi hành</div>
                      <div className="font-bold text-lg">{new Date(item.departureTime).toLocaleString()}</div>
                      <div className="text-sm text-gray-500 mt-1">🕐 Giờ đến</div>
                      <div className="font-semibold">{new Date(item.arrivalTime).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">🚌 Loại xe</div>
                      <div className="font-semibold capitalize">{item.vehicleCategory || item.vehicleType}</div>
                      {typeof item.capacity === 'number' && (
                        <div className="text-sm text-gray-600 mt-1">💺 {item.capacity} chỗ ngồi</div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">💰 Giá vé</div>
                      <div className="font-bold text-2xl text-green-600">{item.price?.toLocaleString()} VNĐ</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={()=>onSelect(item._id)} 
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold"
                    >
                      Xem chi tiết
                    </button>
                    <button 
                      onClick={()=>onSelect(item._id)} 
                      className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                      Đặt vé ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
