import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'
import { SeatMap } from './SeatMap'
import { RouteMap } from '../schedules/RouteMap'

type Props = {
  scheduleId: string
  onBack: () => void
  onSuccess: () => void
}

export const BookingFlow: React.FC<Props> = ({ scheduleId, onBack, onSuccess }) => {
  const { accessToken, user } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [schedule, setSchedule] = React.useState<any>(null)
  const [routeInfo, setRouteInfo] = React.useState<any>(null)
  const [businessInfo, setBusinessInfo] = React.useState<any>(null)
  const [routeStops, setRouteStops] = React.useState<any[]>([])
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null)
  const [selectedPickup, setSelectedPickup] = React.useState<string>('')
  const [selectedDropoff, setSelectedDropoff] = React.useState<string>('')
  const [paymentMethod, setPaymentMethod] = React.useState<string>('momo')
  const [passenger, setPassenger] = React.useState({
    firstName: '', lastName: '', phone: '', email: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  // Check if user is logged in
  React.useEffect(() => {
    if (!user) {
      setError('Vui lòng đăng nhập để đặt vé')
    } else {
      // Pre-fill passenger info with user data
      setPassenger({
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        phone: user.profile?.phone || '',
        email: user.email || ''
      })
    }
  }, [user])

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${scheduleId}`)
      setSchedule(res.data.data)
      
      // Load route info and stops if routeId exists
      if (res.data.data?.routeId) {
        const routeId = typeof res.data.data.routeId === 'string' 
          ? res.data.data.routeId 
          : res.data.data.routeId._id || res.data.data.routeId.id;
        
        if (routeId) {
          const [routeRes, stopsRes] = await Promise.all([
            axios.get(`${apiBase}/api/routes/${routeId}`),
            axios.get(`${apiBase}/api/routes/${routeId}/stops`)
          ])
          setRouteInfo(routeRes.data.data)
          setRouteStops(stopsRes.data.data?.stops || [])
        }
      }
      
      // Load business info if businessId exists
      if (res.data.data?.businessId) {
        try {
          const businessRes = await axios.get(`${apiBase}/api/business/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          setBusinessInfo(businessRes.data.data)
        } catch (e) {
          // Business info not critical, continue without it
          console.log('Could not load business info:', e)
        }
      }
      
      // Auto-fill passenger info from logged-in user
      if (user?.profile) {
        setPassenger({
          firstName: user.profile.firstName || '',
          lastName: user.profile.lastName || '',
          phone: user.profile.phone || '',
          email: user.email || ''
        })
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load schedule')
    }
  }

  React.useEffect(() => {
    loadSchedule()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId])

  const createTicket = async () => {
    if (!selectedSeat) {
      setError('Please select a seat')
      return
    }
    if (!passenger.firstName || !passenger.lastName || !passenger.phone || !passenger.email) {
      setError('Please fill in all passenger information')
      return
    }
    if (routeStops.length > 0 && (!selectedPickup || !selectedDropoff)) {
      setError('Please select pickup and dropoff points')
      return
    }
    
    // Find selected pickup and dropoff points (only if route has stops)
    let pickupPoint = null
    let dropoffPoint = null
    
    if (routeStops.length > 0) {
      pickupPoint = routeStops.find(stop => stop._id === selectedPickup)
      dropoffPoint = routeStops.find(stop => stop._id === selectedDropoff)
      
      if (!pickupPoint || !dropoffPoint) {
        setError('Invalid pickup or dropoff point selected')
        return
      }
      
      // Validate that dropoff point comes after pickup point
      const pickupIndex = routeStops.findIndex(stop => stop._id === selectedPickup)
      const dropoffIndex = routeStops.findIndex(stop => stop._id === selectedDropoff)
      
      if (dropoffIndex <= pickupIndex) {
        setError('Điểm trả phải sau điểm đón trên tuyến đường')
        return
      }
    }
    
    setLoading(true)
    setError('')
    try {
      await axios.post(`${apiBase}/api/tickets`, {
        scheduleId,
        seatNumber: selectedSeat,
        passengerInfo: passenger,
        paymentInfo: { method: paymentMethod, amount: schedule?.price || 0 },
        ...(pickupPoint && dropoffPoint && {
          pickupPoint: {
            name: pickupPoint.name,
            address: pickupPoint.address,
            estimatedTime: pickupPoint.estimatedTime
          },
          dropoffPoint: {
            name: dropoffPoint.name,
            address: dropoffPoint.address,
            estimatedTime: dropoffPoint.estimatedTime
          }
        })
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      onSuccess()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create ticket')
    } finally {
      setLoading(false)
    }
  }

  if (!schedule) return <div>Loading...</div>

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                🔐 Cần đăng nhập
              </h1>
              <p className="text-red-100">Vui lòng đăng nhập để đặt vé</p>
            </div>
            <button 
              onClick={onBack} 
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
            >
              ← Quay lại
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Cần đăng nhập để đặt vé</h3>
          <p className="text-gray-500 mb-6">Bạn cần đăng nhập vào tài khoản để có thể đặt vé xe khách</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onBack} 
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-medium"
            >
              ← Quay lại
            </button>
            <button 
              onClick={() => window.location.href = '#login'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold"
            >
              🔑 Đăng nhập
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 bg-white border rounded p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Book Ticket</h2>
        <button onClick={onBack} className="px-2 py-1 border rounded">Back</button>
      </div>

      {/* Journey Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3 text-blue-800">🚌 Journey Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">📍 Route:</span>
                <span>{routeInfo ? `${routeInfo.from} → ${routeInfo.to}` : 'Loading...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">🚌 Company:</span>
                <span>{businessInfo?.companyName || 'Travel Company'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">🚗 Vehicle:</span>
                <span className="capitalize">{schedule.vehicleCategory} ({schedule.vehicleType})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">💺 Capacity:</span>
                <span>{schedule.capacity} seats, Layout: {schedule.seatLayout}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">🕐 Departure:</span>
                <span>{new Date(schedule.departureTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">🕐 Arrival:</span>
                <span>{new Date(schedule.arrivalTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">⏱️ Duration:</span>
                <span>{routeInfo ? `${routeInfo.duration} minutes` : 'Loading...'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">💰 Price:</span>
                <span className="text-green-600 font-bold text-lg">{schedule.price?.toLocaleString()} đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seat Selection */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">💺 Select Your Seat</h3>
        <SeatMap
          seats={schedule.seats || []}
          seatLayout={schedule.seatLayout || '2-2'}
          selectedSeat={selectedSeat}
          onSeatSelect={setSelectedSeat}
        />
      </div>

      {/* Pickup/Dropoff Points Selection */}
      {routeStops.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-xl text-green-800">📍 Chọn điểm đón/trả</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {routeStops.length} điểm dừng
            </span>
          </div>
          
          {routeInfo && (
            <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Tuyến đường:</div>
              <div className="font-semibold text-green-800">
                {routeInfo.from} → {routeInfo.to}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Quãng đường: {routeInfo.distance}km • Thời gian: {routeInfo.duration} phút
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-4">
              💡 <strong>Lưu ý:</strong> Bạn có thể chọn điểm đón/trả bất kỳ dọc tuyến đường. 
              Xe sẽ dừng tại các điểm này theo lịch trình.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-green-700">
                  🚌 Điểm đón (Pickup Point)
                </label>
                <select
                  value={selectedPickup}
                  onChange={e => {
                    setSelectedPickup(e.target.value);
                    // Reset dropoff if it's before the new pickup point
                    if (selectedDropoff) {
                      const pickupIndex = routeStops.findIndex(s => s._id === e.target.value);
                      const dropoffIndex = routeStops.findIndex(s => s._id === selectedDropoff);
                      if (dropoffIndex <= pickupIndex) {
                        setSelectedDropoff('');
                      }
                    }
                  }}
                  className="w-full border-2 border-green-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                >
                  <option value="">-- Chọn điểm đón --</option>
                  {routeStops.map((stop, index) => (
                    <option key={stop._id} value={stop._id}>
                      {index + 1}. {stop.name} - {stop.address} ({stop.estimatedTime} phút)
                    </option>
                  ))}
                </select>
                {selectedPickup && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-sm">
                    ✅ Đã chọn: <strong>{routeStops.find(s => s._id === selectedPickup)?.name}</strong>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-3 text-blue-700">
                  🏁 Điểm trả (Dropoff Point)
                </label>
                <select
                  value={selectedDropoff}
                  onChange={e => setSelectedDropoff(e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">-- Chọn điểm trả --</option>
                  {routeStops.map((stop, index) => {
                    // Only show stops that come after the selected pickup point
                    const pickupIndex = routeStops.findIndex(s => s._id === selectedPickup);
                    const canSelect = !selectedPickup || index > pickupIndex;
                    
                    return (
                      <option 
                        key={stop._id} 
                        value={stop._id}
                        disabled={!canSelect}
                        style={{ color: canSelect ? 'inherit' : '#ccc' }}
                      >
                        {index + 1}. {stop.name} - {stop.address} ({stop.estimatedTime} phút)
                        {!canSelect && ' (Phải sau điểm đón)'}
                      </option>
                    );
                  })}
                </select>
                {selectedDropoff && (
                  <div className="mt-2 p-2 bg-blue-100 rounded text-sm">
                    ✅ Đã chọn: <strong>{routeStops.find(s => s._id === selectedDropoff)?.name}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Selection Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">⚡ Chọn nhanh:</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedPickup(routeStops[0]?._id || '')
                    setSelectedDropoff(routeStops[routeStops.length - 1]?._id || '')
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                >
                  Điểm đầu → Điểm cuối
                </button>
                <button
                  onClick={() => {
                    const mid = Math.floor(routeStops.length / 2)
                    setSelectedPickup(routeStops[0]?._id || '')
                    setSelectedDropoff(routeStops[mid]?._id || '')
                  }}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm transition-colors"
                >
                  Điểm đầu → Giữa đường
                </button>
                <button
                  onClick={() => {
                    setSelectedPickup('')
                    setSelectedDropoff('')
                  }}
                  className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm transition-colors"
                >
                  Xóa lựa chọn
                </button>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-gray-800">🗺️ Sơ đồ tuyến đường</h4>
            <RouteMap stops={routeStops} departureTime={schedule.departureTime} />
          </div>
        </div>
      )}

      {/* Passenger Information */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3 text-yellow-800">👤 Passenger Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input
              placeholder="Enter first name"
              value={passenger.firstName}
              onChange={e => setPassenger(p => ({ ...p, firstName: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input
              placeholder="Enter last name"
              value={passenger.lastName}
              onChange={e => setPassenger(p => ({ ...p, lastName: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number *</label>
            <input
              placeholder="Enter phone number"
              value={passenger.phone}
              onChange={e => setPassenger(p => ({ ...p, phone: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="Enter email address"
              value={passenger.email}
              onChange={e => setPassenger(p => ({ ...p, email: e.target.value }))}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-500"
              required
            />
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3 text-purple-800">💳 Payment Method</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['momo', 'vnpay', 'cash'].map(method => (
            <label key={method} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={paymentMethod === method}
                onChange={e => setPaymentMethod(e.target.value)}
                className="text-purple-600"
              />
              <span className="capitalize font-medium">{method}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-xl mb-4 text-gray-800 flex items-center gap-2">
          📋 Tóm tắt đặt vé
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {selectedSeat ? 'Đã chọn ghế' : 'Chưa chọn ghế'}
          </span>
        </h3>
        
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">📍 Tuyến đường:</span>
                <span className="font-semibold text-blue-600">{routeInfo ? `${routeInfo.from} → ${routeInfo.to}` : 'Loading...'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">🕐 Giờ khởi hành:</span>
                <span className="font-medium">{new Date(schedule.departureTime).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">💺 Ghế ngồi:</span>
                <span className={`font-medium ${selectedSeat ? 'text-green-600' : 'text-red-500'}`}>
                  {selectedSeat ? `Ghế ${selectedSeat}` : 'Chưa chọn'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {selectedPickup && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">🚌 Điểm đón:</span>
                  <span className="font-medium text-green-600">{routeStops.find(s => s._id === selectedPickup)?.name}</span>
                </div>
              )}
              {selectedDropoff && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">🏁 Điểm trả:</span>
                  <span className="font-medium text-blue-600">{routeStops.find(s => s._id === selectedDropoff)?.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-600">💳 Thanh toán:</span>
                <span className="font-medium capitalize">{paymentMethod}</span>
              </div>
            </div>
          </div>
          
          {/* Price Breakdown */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">💰 Giá vé:</span>
              <span className="font-medium">{schedule.price?.toLocaleString()} VNĐ</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">🎫 Phí dịch vụ:</span>
              <span className="font-medium">0 VNĐ</span>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="font-bold text-lg">Tổng cộng:</span>
              <span className="font-bold text-xl text-green-600">{schedule.price?.toLocaleString()} VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Schedules
        </button>
        <button
          onClick={createTicket}
          disabled={!selectedSeat || !passenger.firstName || !passenger.lastName || !passenger.phone || !passenger.email || loading}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? '🔄 Creating Ticket...' : '✅ Confirm Booking'}
        </button>
      </div>
    </div>
  )
}
