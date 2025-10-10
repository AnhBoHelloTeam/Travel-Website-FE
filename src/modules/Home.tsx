import React from 'react'

export const Home: React.FC<{ onNavigate?: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-10">
      <section className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">Đặt vé xe nhanh chóng, an toàn và tiện lợi</h2>
            <p className="mt-3 text-white/90">Tìm kiếm lịch trình, chọn ghế, giữ chỗ 5 phút và thanh toán an toàn. Hỗ trợ nhiều loại xe: Bus 16/32 chỗ, Limousine, Sleeper.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={()=>onNavigate && onNavigate('schedules')} className="px-4 py-2 bg-white text-blue-700 font-semibold rounded">Tìm vé ngay</button>
              <button onClick={()=>onNavigate && onNavigate('register')} className="px-4 py-2 border border-white/60 rounded">Đăng ký</button>
            </div>
          </div>
          <div className="flex-1 text-right">
            <div className="inline-block bg-white/10 backdrop-blur rounded-lg px-5 py-4">
              <div className="text-sm opacity-90">Sẵn sàng phục vụ</div>
              <div className="text-2xl font-bold">1,000+ vé mỗi ngày</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">Tìm kiếm linh hoạt</div>
          <p className="mt-2 text-gray-600">Bộ lọc theo loại xe, sức chứa, thời gian khởi hành, mức giá.</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">Chọn ghế trực quan</div>
          <p className="mt-2 text-gray-600">Sơ đồ ghế động theo layout (2-2, 2-1), giữ chỗ 5 phút.</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="text-lg font-semibold">Quản lý vé dễ dàng</div>
          <p className="mt-2 text-gray-600">Xem vé đã đặt, xác nhận thanh toán, hủy vé nhanh chóng.</p>
        </div>
      </section>
    </div>
  )
}
