import React from 'react'
import axios from 'axios'

export const ScheduleDetail: React.FC<{ id: string, onBack: () => void }> = ({ id, onBack }) => {
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
            <b>Seats:</b>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(data.seats || []).map((s: any) => (
                <div key={s.seatNumber} className={`border rounded p-2 text-center ${s.isAvailable ? 'bg-green-50' : 'bg-gray-100'}`}>
                  {s.seatNumber}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
