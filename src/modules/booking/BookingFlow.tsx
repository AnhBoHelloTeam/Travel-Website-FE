import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'
import { SeatMap } from './SeatMap'

type Props = {
  scheduleId: string
  onBack: () => void
  onSuccess: () => void
}

export const BookingFlow: React.FC<Props> = ({ scheduleId, onBack, onSuccess }) => {
  const { accessToken } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [schedule, setSchedule] = React.useState<any>(null)
  const [routeStops, setRouteStops] = React.useState<any[]>([])
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null)
  const [selectedPickup, setSelectedPickup] = React.useState<string>('')
  const [selectedDropoff, setSelectedDropoff] = React.useState<string>('')
  const [passenger, setPassenger] = React.useState({
    firstName: '', lastName: '', phone: '', email: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${scheduleId}`)
      setSchedule(res.data.data)
      
      // Load route stops if routeId exists
      if (res.data.data?.routeId) {
        const stopsRes = await axios.get(`${apiBase}/api/routes/${res.data.data.routeId}/stops`)
        setRouteStops(stopsRes.data.data || [])
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
    if (!selectedSeat || !selectedPickup || !selectedDropoff) {
      setError('Please select seat, pickup and dropoff points')
      return
    }
    
    // Find selected pickup and dropoff points
    const pickupPoint = routeStops.find(stop => stop._id === selectedPickup)
    const dropoffPoint = routeStops.find(stop => stop._id === selectedDropoff)
    
    if (!pickupPoint || !dropoffPoint) {
      setError('Invalid pickup or dropoff point selected')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      await axios.post(`${apiBase}/api/tickets`, {
        scheduleId,
        seatNumber: selectedSeat,
        passengerInfo: passenger,
        paymentInfo: { method: 'momo', amount: schedule?.price || 0 },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">Schedule Info</h3>
          <div className="text-sm space-y-1">
            <div><b>Departure:</b> {new Date(schedule.departureTime).toLocaleString()}</div>
            <div><b>Arrival:</b> {new Date(schedule.arrivalTime).toLocaleString()}</div>
            <div><b>Vehicle:</b> {schedule.vehicleType}</div>
            <div><b>Price:</b> {schedule.price?.toLocaleString()} đ</div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Select Seat</h3>
          <SeatMap
            seats={schedule.seats || []}
            seatLayout={schedule.seatLayout || '2-2'}
            selectedSeat={selectedSeat}
            onSeatSelect={setSelectedSeat}
          />
        </div>
      </div>

      {/* Pickup/Dropoff Points Selection */}
      {routeStops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">Pickup Point</h3>
            <select
              value={selectedPickup}
              onChange={e => setSelectedPickup(e.target.value)}
              className="w-full border rounded px-3 py-2"
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
            <h3 className="font-medium mb-2">Dropoff Point</h3>
            <select
              value={selectedDropoff}
              onChange={e => setSelectedDropoff(e.target.value)}
              className="w-full border rounded px-3 py-2"
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
      )}

      <div>
        <h3 className="font-medium mb-2">Passenger Info</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            placeholder="First name"
            value={passenger.firstName}
            onChange={e => setPassenger(p => ({ ...p, firstName: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Last name"
            value={passenger.lastName}
            onChange={e => setPassenger(p => ({ ...p, lastName: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Phone"
            value={passenger.phone}
            onChange={e => setPassenger(p => ({ ...p, phone: e.target.value }))}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Email"
            value={passenger.email}
            onChange={e => setPassenger(p => ({ ...p, email: e.target.value }))}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="flex justify-end">
        <button
          onClick={createTicket}
          disabled={!selectedSeat || !passenger.firstName || !passenger.lastName || !passenger.phone || !passenger.email || loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Creating...' : 'Book Ticket'}
        </button>
      </div>
    </div>
  )
}
