import React from 'react'

export const Home: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  const [quickSearch, setQuickSearch] = React.useState({
    from: '',
    to: '',
    date: new Date().toISOString().split('T')[0]
  })

  const handleQuickSearch = () => {
    // Navigate to schedules with pre-filled filters
    onNavigate && onNavigate('schedules')
  }
  return (
    <div className="space-y-10">
      {/* Hero Section with Quick Search */}
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Đặt vé xe nhanh chóng, an toàn và tiện lợi</h2>
            <p className="mt-3 text-white/90">Tìm kiếm lịch trình, chọn ghế, giữ chỗ 5 phút và thanh toán an toàn. Hỗ trợ nhiều loại xe: Bus 16/32 chỗ, Limousine, Sleeper.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={()=>onNavigate && onNavigate('schedules')} className="px-4 py-2 bg-white text-blue-700 font-semibold rounded">Tìm vé ngay</button>
              <button onClick={()=>onNavigate && onNavigate('register')} className="px-4 py-2 border border-white/60 rounded">Đăng ký</button>
            </div>
          </div>
          
          {/* Quick Search Form */}
          <div className="bg-white/10 backdrop-blur rounded-lg p-6 min-w-80">
            <h3 className="text-lg font-semibold mb-4">🚌 Tìm vé nhanh</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Từ</label>
                <input
                  type="text"
                  placeholder="Điểm đi"
                  value={quickSearch.from}
                  onChange={e => setQuickSearch(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 rounded text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đến</label>
                <input
                  type="text"
                  placeholder="Điểm đến"
                  value={quickSearch.to}
                  onChange={e => setQuickSearch(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 rounded text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ngày đi</label>
                <input
                  type="date"
                  value={quickSearch.date}
                  onChange={e => setQuickSearch(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 rounded text-gray-900"
                />
              </div>
              <button
                onClick={handleQuickSearch}
                className="w-full px-4 py-2 bg-white text-blue-700 font-semibold rounded hover:bg-gray-100 transition-colors"
              >
                🔍 Tìm vé
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">📅 Đặt vé trước</div>
          <p className="mt-2 text-gray-600">Đặt vé trước nhiều ngày, xem lịch trình theo tuần/tháng, linh hoạt thời gian.</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">💺 Chọn ghế trực quan</div>
          <p className="mt-2 text-gray-600">Sơ đồ ghế động theo layout (2-2, 2-1), giữ chỗ 5 phút, VIP seats.</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">📍 Điểm đón/trả</div>
          <p className="mt-2 text-gray-600">Chọn điểm đón/trả linh hoạt dọc đường, phù hợp với nhu cầu di chuyển.</p>
        </div>
      </section>
    </div>
  )
}
