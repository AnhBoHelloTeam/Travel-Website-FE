import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TravelBlog } from '../../components/TravelBlog'
import { FeaturedDestinations } from '../../components/FeaturedDestinations'
import { TravelTips } from '../../components/TravelTips'

export const Home: React.FC = () => {
  const navigate = useNavigate()
  const [quickSearch, setQuickSearch] = React.useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleQuickSearch = () => {
    // Navigate to schedules with pre-filled filters
    navigate('/schedules')
  }

  const popularRoutes = [
    { from: 'Hà Nội', to: 'Đà Nẵng', price: '450,000', duration: '12h' },
    { from: 'TP.HCM', to: 'Đà Lạt', price: '180,000', duration: '6h' },
    { from: 'Hà Nội', to: 'Hải Phòng', price: '80,000', duration: '2h' },
    { from: 'Đà Nẵng', to: 'Huế', price: '120,000', duration: '3h' },
  ]

  const vehicleTypes = [
    { name: 'Xe 16 chỗ', icon: '🚐', desc: 'Tiết kiệm, phù hợp nhóm nhỏ' },
    { name: 'Xe 32 chỗ', icon: '🚌', desc: 'Cân bằng giá cả và tiện nghi' },
    { name: 'Limousine', icon: '🚗', desc: 'Cao cấp, chỉ 12 chỗ' },
    { name: 'Giường nằm', icon: '🛏️', desc: 'Thoải mái cho chuyến dài' },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section with Quick Search */}
      <section className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
              🎉 Đặt vé online - Ưu đãi lên đến 20%
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Đặt vé xe khách
              <span className="block text-yellow-300">nhanh chóng & an toàn</span>
            </h1>
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              Tìm kiếm lịch trình, chọn ghế yêu thích, giữ chỗ 5 phút và thanh toán an toàn. 
              Hỗ trợ đầy đủ các loại xe từ tiết kiệm đến cao cấp.
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/schedules')} 
                className="px-6 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                🚌 Tìm vé ngay
              </button>
              <button 
                onClick={() => navigate('/register')} 
                className="px-6 py-3 border-2 border-white/60 rounded-lg hover:bg-white/10 transition-all"
              >
                Đăng ký miễn phí
              </button>
            </div>
          </div>
          
          {/* Quick Search Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 min-w-96 border border-white/20">
            <h3 className="text-xl font-bold mb-6 text-center">🔍 Tìm vé nhanh</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">📍 Điểm đi</label>
                <input
                  type="text"
                  placeholder="Nhập điểm đi..."
                  value={quickSearch.from}
                  onChange={e => setQuickSearch(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">🎯 Điểm đến</label>
                <input
                  type="text"
                  placeholder="Nhập điểm đến..."
                  value={quickSearch.to}
                  onChange={e => setQuickSearch(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">📅 Ngày đi</label>
                <input
                  type="date"
                  value={quickSearch.date}
                  onChange={e => setQuickSearch(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              <button
                onClick={handleQuickSearch}
                className="w-full px-4 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🔍 Tìm vé ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">🌟 Tuyến đường phổ biến</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularRoutes.map((route, index) => (
            <div key={index} className="bg-white rounded-xl border p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/schedules')}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-blue-600">{route.from}</span>
                <span className="text-gray-400">→</span>
                <span className="font-bold text-blue-600">{route.to}</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>💰 Từ {route.price} VNĐ</div>
                <div>⏱️ {route.duration}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-bold mb-2">Đặt vé trước</h3>
          <p className="text-gray-600 text-sm">Đặt vé trước nhiều ngày, xem lịch trình theo tuần/tháng, linh hoạt thời gian.</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">💺</div>
          <h3 className="text-lg font-bold mb-2">Chọn ghế trực quan</h3>
          <p className="text-gray-600 text-sm">Sơ đồ ghế động theo layout (2-2, 2-1), giữ chỗ 5 phút, VIP seats.</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-lg font-bold mb-2">Điểm đón/trả</h3>
          <p className="text-gray-600 text-sm">Chọn điểm đón/trả linh hoạt dọc đường, phù hợp với nhu cầu di chuyển.</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-shadow">
          <div className="text-4xl mb-3">💳</div>
          <h3 className="text-lg font-bold mb-2">Thanh toán an toàn</h3>
          <p className="text-gray-600 text-sm">Hỗ trợ nhiều phương thức thanh toán, bảo mật thông tin tuyệt đối.</p>
        </div>
      </section>

      {/* Vehicle Types */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8">🚗 Các loại xe</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {vehicleTypes.map((vehicle, index) => (
            <div key={index} className="bg-white rounded-xl border p-6 text-center hover:shadow-lg transition-all hover:scale-105">
              <div className="text-3xl mb-3">{vehicle.icon}</div>
              <h3 className="font-bold mb-2">{vehicle.name}</h3>
              <p className="text-gray-600 text-sm">{vehicle.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Destinations */}
      <FeaturedDestinations />

      {/* Travel Blog */}
      <TravelBlog />

      {/* Travel Tips */}
      <TravelTips />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho chuyến đi của bạn?</h2>
        <p className="text-lg mb-6 opacity-90">Đăng ký ngay để nhận ưu đãi đặc biệt và trải nghiệm dịch vụ tốt nhất</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button 
            onClick={() => navigate('/register')} 
            className="px-6 py-3 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-all"
          >
            Đăng ký miễn phí
          </button>
          <button 
            onClick={() => navigate('/schedules')} 
            className="px-6 py-3 border-2 border-white rounded-lg hover:bg-white/10 transition-all"
          >
            Xem lịch trình
          </button>
        </div>
      </section>
    </div>
  )
}
