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

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${scheduleId}`)
      setSchedule(res.data.data)
      
      // Load route info and stops if routeId exists
      if (res.data.data?.routeId) {
        const [routeRes, stopsRes] = await Promise.all([
          axios.get(`${apiBase}/api/routes/${res.data.data.routeId}`),
          axios.get(`${apiBase}/api/routes/${res.data.data.routeId}/stops`)
        ])
        setRouteInfo(routeRes.data.data)
        setRouteStops(stopsRes.data.data || [])
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
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-lg mb-3 text-green-800">📍 Pickup & Dropoff Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">🚌 Pickup Point</label>
              <select
                value={selectedPickup}
                onChange={e => setSelectedPickup(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select pickup point</option>
                {routeStops.map(stop => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name} - {stop.address} ({stop.estimatedTime}min)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">🏁 Dropoff Point</label>
              <select
                value={selectedDropoff}
                onChange={e => setSelectedDropoff(e.target.value)}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select dropoff point</option>
                {routeStops.map(stop => (
                  <option key={stop._id} value={stop._id}>
                    {stop.name} - {stop.address} ({stop.estimatedTime}min)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Map */}
          <div className="mt-4">
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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3 text-gray-800">📋 Booking Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Route:</span>
            <span className="font-medium">{routeInfo ? `${routeInfo.from} → ${routeInfo.to}` : 'Loading...'}</span>
          </div>
          <div className="flex justify-between">
            <span>Departure:</span>
            <span className="font-medium">{new Date(schedule.departureTime).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Seat:</span>
            <span className="font-medium">{selectedSeat || 'Not selected'}</span>
          </div>
          {selectedPickup && (
            <div className="flex justify-between">
              <span>Pickup:</span>
              <span className="font-medium">{routeStops.find(s => s._id === selectedPickup)?.name}</span>
            </div>
          )}
          {selectedDropoff && (
            <div className="flex justify-between">
              <span>Dropoff:</span>
              <span className="font-medium">{routeStops.find(s => s._id === selectedDropoff)?.name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Payment:</span>
            <span className="font-medium capitalize">{paymentMethod}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="font-semibold">Total:</span>
            <span className="font-bold text-lg text-green-600">{schedule.price?.toLocaleString()} đ</span>
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
