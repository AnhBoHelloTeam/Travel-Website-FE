import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SeatMap } from '../booking/SeatMap'
import { RouteMap } from './RouteMap'

export const ScheduleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const [data, setData] = React.useState<any>(null)
  const [stops, setStops] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const load = async () => {
    if (!id) return
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${id}`)
      setData(res.data.data)
      if (res.data.data?.routeId) {
        const routeId = typeof res.data.data.routeId === 'string' 
          ? res.data.data.routeId 
          : res.data.data.routeId._id || res.data.data.routeId.id;
        
        if (routeId) {
          const stopsRes = await axios.get(`${apiBase}/api/routes/${routeId}/stops`)
          setStops(stopsRes.data.data?.stops || [])
        }
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load schedule')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'sleeping': return '🛏️'
      case 'sitting': return '🪑'
      default: return '🚌'
    }
  }

  const getVehicleCategoryIcon = (category: string) => {
    switch (category) {
      case 'bus16': return '🚐'
      case 'bus32': return '🚌'
      case 'limousine': return '🚗'
      case 'sleeper': return '🛏️'
      case 'sitting': return '🪑'
      default: return '🚌'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
              🚌 Chi tiết chuyến xe
            </h1>
            <p className="text-blue-100">Thông tin chi tiết và đặt vé</p>
          </div>
          <button 
            onClick={() => navigate('/schedules')} 
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
          >
            ← Quay lại
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white border rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            Đang tải thông tin chuyến xe...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Schedule Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🚀</div>
                <div>
                  <p className="text-sm text-gray-600">Giờ khởi hành</p>
                  <p className="font-bold text-lg">{new Date(data.departureTime).toLocaleTimeString()}</p>
                  <p className="text-xs text-gray-500">{new Date(data.departureTime).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏁</div>
                <div>
                  <p className="text-sm text-gray-600">Giờ đến</p>
                  <p className="font-bold text-lg">{new Date(data.arrivalTime).toLocaleTimeString()}</p>
                  <p className="text-xs text-gray-500">{new Date(data.arrivalTime).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{getVehicleIcon(data.vehicleType)}</div>
                <div>
                  <p className="text-sm text-gray-600">Loại xe</p>
                  <p className="font-bold text-lg capitalize">{data.vehicleType}</p>
                  <p className="text-xs text-gray-500">{getVehicleCategoryIcon(data.vehicleCategory)} {data.vehicleCategory}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-3xl">💰</div>
                <div>
                  <p className="text-sm text-gray-600">Giá vé</p>
                  <p className="font-bold text-lg text-green-600">{data.price?.toLocaleString()} VNĐ</p>
                  <p className="text-xs text-gray-500">Giá cơ bản</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏢</div>
                <div>
                  <p className="text-sm text-gray-600">Nhà xe</p>
                  <p className="font-bold text-lg">{data.businessId?.name || 'N/A'}</p>
                  {data.businessId?.rating && (
                    <p className="text-xs text-gray-500">
                      ⭐ {data.businessId.rating.average}/5 ({data.businessId.rating.count} đánh giá)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seat Map */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                💺 Sơ đồ ghế ngồi
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <SeatMap
                  seats={data.seats || []}
                  seatLayout={data.seatLayout || '2-2'}
                  selectedSeat={null}
                  onSeatSelect={() => {}}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                    <span>Còn trống</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                    <span>Đã đặt</span>
                  </div>
                </div>
                <div>
                  Sức chứa: {data.capacity || 40} ghế
                </div>
              </div>
            </div>

            {/* Route Info */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🗺️ Thông tin tuyến đường
              </h3>
              {data.route && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                        🚌
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {data.route.from} → {data.route.to}
                        </div>
                        <div className="text-sm text-gray-600">
                          Khoảng cách: {data.route.distance || 'N/A'} km
                        </div>
                      </div>
                    </div>
                  </div>

                  {stops.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-800">📍 Các điểm dừng</h4>
                      <div className="space-y-2">
                        {stops.map((stop, index) => (
                          <div key={stop._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{stop.name}</div>
                              <div className="text-sm text-gray-600">{stop.address}</div>
                            </div>
                            <div className="text-sm text-gray-500">
                              ~{stop.estimatedTime} phút
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Route Map */}
          {stops.length > 0 && (
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                🗺️ Bản đồ tuyến đường
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <RouteMap stops={stops} departureTime={data.departureTime} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white rounded-xl border p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-semibold text-gray-800">Sẵn sàng đặt vé?</h3>
                <p className="text-gray-600">Chọn ghế và hoàn tất thanh toán để giữ chỗ</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate('/schedules')} 
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
                >
                  ← Quay lại
                </button>
                <button 
                  onClick={() => navigate(`/booking/${id}`)} 
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 font-semibold"
                >
                  🎫 Đặt vé ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
