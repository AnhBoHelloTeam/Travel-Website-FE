import React from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

export const MyTickets: React.FC = () => {
  const { accessToken } = useAuth()
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const [tickets, setTickets] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [filter, setFilter] = React.useState('')

  const loadTickets = async () => {
    setLoading(true)
    setError('')
    try {
      const params: any = {}
      if (filter) params.status = filter
      const res = await axios.get(`${apiBase}/api/tickets`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params
      })
      setTickets(res.data.data || [])
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    loadTickets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const confirmPayment = async (ticketId: string) => {
    try {
      await axios.put(`${apiBase}/api/tickets/${ticketId}/confirm`, {
        transactionId: `TXN_${Date.now()}`
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      loadTickets()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to confirm payment')
    }
  }

  const cancelTicket = async (ticketId: string) => {
    try {
      await axios.put(`${apiBase}/api/tickets/${ticketId}/cancel`, {
        reason: 'User cancelled'
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      loadTickets()
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to cancel ticket')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Tickets</h2>
        <div className="flex items-center space-x-2">
          <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded px-3 py-2">
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={loadTickets} className="px-3 py-2 bg-blue-600 text-white rounded">Refresh</button>
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {loading && <div>Loading...</div>}

      {!loading && tickets.length === 0 && (
        <div className="text-center py-8 text-gray-500">No tickets found</div>
      )}

      {!loading && tickets.map(ticket => (
        <div key={ticket._id} className="bg-white border rounded p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.toUpperCase()}
              </span>
              <span className="text-sm text-gray-600">
                Seat: {ticket.seatNumber}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <h3 className="font-medium">Passenger Info</h3>
              <div className="text-sm text-gray-600">
                <div>{ticket.passengerInfo?.firstName} {ticket.passengerInfo?.lastName}</div>
                <div>{ticket.passengerInfo?.phone}</div>
                <div>{ticket.passengerInfo?.email}</div>
              </div>
            </div>
            <div>
              <h3 className="font-medium">Payment Info</h3>
              <div className="text-sm text-gray-600">
                <div>Method: {ticket.paymentInfo?.method}</div>
                <div>Amount: {ticket.paymentInfo?.amount?.toLocaleString()} đ</div>
                {ticket.paymentInfo?.transactionId && (
                  <div>Transaction: {ticket.paymentInfo.transactionId}</div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {ticket.status === 'pending' && (
              <>
                <button
                  onClick={() => confirmPayment(ticket._id)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => cancelTicket(ticket._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            {ticket.status === 'confirmed' && (
              <button
                onClick={() => cancelTicket(ticket._id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
