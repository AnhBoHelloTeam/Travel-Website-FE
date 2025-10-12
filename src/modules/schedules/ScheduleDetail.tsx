import React from 'react'
import axios from 'axios'
import { SeatMap } from '../booking/SeatMap'

export const ScheduleDetail: React.FC<{ id: string, onBack: () => void, onBook?: () => void }> = ({ id, onBack, onBook }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const [data, setData] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get(`${apiBase}/api/schedules/${id}`)
      setData(res.data.data)
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

  return (
    <div className="space-y-3 bg-white border rounded p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Schedule Detail</h2>
        <button onClick={onBack} className="px-2 py-1 border rounded">Back</button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {data && (
        <div className="space-y-2">
          <div><b>Departure:</b> {new Date(data.departureTime).toLocaleString()}</div>
          <div><b>Arrival:</b> {new Date(data.arrivalTime).toLocaleString()}</div>
          <div><b>Vehicle:</b> {data.vehicleType}</div>
          <div><b>Price:</b> {data.price?.toLocaleString()} đ</div>
          <div>
            <b>Seat Map:</b>
            <div className="mt-2">
              <SeatMap
                seats={data.seats || []}
                seatLayout={data.seatLayout || '2-2'}
                selectedSeat={null}
                onSeatSelect={() => {}} // Read-only in detail view
              />
            </div>
          </div>
          <div className="mt-4">
            <button onClick={onBook} className="px-4 py-2 bg-blue-600 text-white rounded">
              Book This Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
