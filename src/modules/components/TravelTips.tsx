import React from 'react'

export const TravelTips: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mẹo du lịch hữu ích
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những kinh nghiệm và mẹo hay giúp bạn có chuyến du lịch hoàn hảo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">💰</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Tiết kiệm
                    </span>
                    <span className="text-sm text-gray-500">3 phút</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Mẹo tiết kiệm chi phí khi du lịch
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Những cách hay để tiết kiệm tiền khi đi du lịch mà vẫn có trải nghiệm tuyệt vời
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Đọc thêm
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">🎒</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Chuẩn bị
                    </span>
                    <span className="text-sm text-gray-500">4 phút</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Chuẩn bị hành lý thông minh
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Danh sách những vật dụng cần thiết và cách sắp xếp hành lý hiệu quả
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Đọc thêm
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">📸</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Nhiếp ảnh
                    </span>
                    <span className="text-sm text-gray-500">5 phút</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Chụp ảnh du lịch đẹp như nhiếp ảnh gia
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Bí quyết chụp ảnh đẹp khi du lịch với điện thoại và máy ảnh
                  </p>
                </div>
              </div>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Đọc thêm
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">
              Nhận mẹo du lịch mới nhất
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Đăng ký nhận bản tin để cập nhật những mẹo du lịch, điểm đến mới và ưu đãi hấp dẫn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
