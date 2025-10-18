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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ thanh toán'
      case 'confirmed': return 'Đã xác nhận'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🎫 Vé của tôi</h1>
            <p className="text-blue-100">Quản lý và theo dõi tất cả vé đã đặt</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              value={filter} 
              onChange={e => setFilter(e.target.value)} 
              className="border-0 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Tất cả vé</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="cancelled">Đã hủy</option>
            </select>
            <button 
              onClick={loadTickets} 
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
            >
              🔄 Làm mới
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-600">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="bg-white border rounded-xl p-8 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            Đang tải vé...
          </div>
        </div>
      )}

      {!loading && tickets.length === 0 && (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có vé nào</h3>
          <p className="text-gray-500">Hãy đặt vé đầu tiên của bạn để bắt đầu hành trình!</p>
        </div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              📋 Danh sách vé ({tickets.length} vé)
            </h3>
            <div className="text-sm text-gray-500">
              Sắp xếp theo thời gian đặt vé
            </div>
          </div>
          
          {tickets.map(ticket => (
            <div key={ticket._id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow">
              {/* Ticket Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getStatusIcon(ticket.status)}</span>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      💺 Ghế {ticket.seatNumber} • Đặt lúc {new Date(ticket.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {ticket.paymentInfo?.amount?.toLocaleString()} VNĐ
                  </div>
                  <div className="text-sm text-gray-500">
                    💳 {ticket.paymentInfo?.method?.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    👤 Thông tin hành khách
                  </h4>
                  <div className="text-sm space-y-1">
                    <div><strong>{ticket.passengerInfo?.firstName} {ticket.passengerInfo?.lastName}</strong></div>
                    <div>📞 {ticket.passengerInfo?.phone}</div>
                    <div>📧 {ticket.passengerInfo?.email}</div>
                  </div>
                </div>
                
                {/* Pickup/Dropoff Points */}
                {ticket.pickupPoint && ticket.dropoffPoint && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      📍 Điểm đón/trả
                    </h4>
                    <div className="text-sm space-y-2">
                      <div>
                        <div className="font-medium text-green-700">🚌 Điểm đón:</div>
                        <div>{ticket.pickupPoint.name}</div>
                        <div className="text-xs text-gray-600">{ticket.pickupPoint.address}</div>
                        <div className="text-xs text-gray-500">~{ticket.pickupPoint.estimatedTime} phút từ giờ khởi hành</div>
                      </div>
                      <div>
                        <div className="font-medium text-blue-700">🏁 Điểm trả:</div>
                        <div>{ticket.dropoffPoint.name}</div>
                        <div className="text-xs text-gray-600">{ticket.dropoffPoint.address}</div>
                        <div className="text-xs text-gray-500">~{ticket.dropoffPoint.estimatedTime} phút từ giờ khởi hành</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    💳 Thông tin thanh toán
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>Phương thức: <strong>{ticket.paymentInfo?.method?.toUpperCase()}</strong></div>
                    <div>Số tiền: <strong>{ticket.paymentInfo?.amount?.toLocaleString()} VNĐ</strong></div>
                    {ticket.paymentInfo?.transactionId && (
                      <div className="text-xs text-gray-600">
                        Mã GD: {ticket.paymentInfo.transactionId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {ticket.status === 'pending' && (
                  <>
                    <button
                      onClick={() => confirmPayment(ticket._id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ✅ Xác nhận thanh toán
                    </button>
                    <button
                      onClick={() => cancelTicket(ticket._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ❌ Hủy vé
                    </button>
                  </>
                )}
                {ticket.status === 'confirmed' && (
                  <button
                    onClick={() => cancelTicket(ticket._id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    ❌ Hủy vé
                  </button>
                )}
                {ticket.status === 'cancelled' && (
                  <div className="text-sm text-gray-500 italic">
                    Vé đã bị hủy
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
