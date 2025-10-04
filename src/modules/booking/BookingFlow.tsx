import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

type Props = {
  scheduleId: string
  onBack: () => void
  onSuccess: () => void
}

export const BookingFlow: React.FC<Props> = ({ scheduleId, onBack, onSuccess }) => {
  const { accessToken } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [schedule, setSchedule] = React.useState<any>(null)
  const [selectedSeat, setSelectedSeat] = React.useState<string | null>(null)
  const [passenger, setPassenger] = React.useState({
    firstName: '', lastName: '', phone: '', email: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${scheduleId}`)
      setSchedule(res.data.data)
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load schedule')
    }
  }

  React.useEffect(() => {
    loadSchedule()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId])

  const createTicket = async () => {
    if (!selectedSeat) return
    setLoading(true)
    setError('')
    try {
      await axios.post(`${apiBase}/api/tickets`, {
        scheduleId,
        seatNumber: selectedSeat,
        passengerInfo: passenger,
        paymentInfo: { method: 'momo', amount: schedule?.price || 0 }
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
          <div className="grid grid-cols-4 gap-2">
            {(schedule.seats || []).map((seat: any) => (
              <button
                key={seat.seatNumber}
                onClick={() => seat.isAvailable ? setSelectedSeat(seat.seatNumber) : null}
                disabled={!seat.isAvailable}
                className={`border rounded p-2 text-center ${
                  selectedSeat === seat.seatNumber
                    ? 'bg-blue-200 border-blue-500'
                    : seat.isAvailable
                    ? 'bg-green-50 hover:bg-green-100'
                    : 'bg-gray-100 cursor-not-allowed'
                }`}
              >
                {seat.seatNumber}
              </button>
            ))}
          </div>
          {selectedSeat && <div className="mt-2 text-sm">Selected: {selectedSeat}</div>}
        </div>
      </div>

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
