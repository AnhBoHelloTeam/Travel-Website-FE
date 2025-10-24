import React from 'react'

export const FeaturedDestinations: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Điểm đến nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những điểm đến được yêu thích nhất với trải nghiệm du lịch tuyệt vời
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Đà Nẵng"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Từ 1.200.000đ
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Đà Nẵng - Thành phố biển xanh
              </h3>
              <p className="text-gray-600 mb-4">
                Khám phá bãi biển Mỹ Khê tuyệt đẹp, cầu Vàng độc đáo và ẩm thực đặc sắc
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">3-5 ngày</span>
                <span className="text-sm text-gray-500">1247 đánh giá</span>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Khám phá ngay
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Huế"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium">4.7</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Từ 800.000đ
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Huế - Cố đô mộng mơ
              </h3>
              <p className="text-gray-600 mb-4">
                Trải nghiệm văn hóa cung đình, lăng tẩm cổ kính và sông Hương thơ mộng
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">2-3 ngày</span>
                <span className="text-sm text-gray-500">892 đánh giá</span>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Khám phá ngay
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Hội An"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="text-sm font-medium">4.9</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Từ 600.000đ
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Hội An - Phố cổ lãng mạn
              </h3>
              <p className="text-gray-600 mb-4">
                Dạo bước trên phố cổ, thưởng thức đèn lồng lung linh và ẩm thực phong phú
              </p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">1-2 ngày</span>
                <span className="text-sm text-gray-500">1563 đánh giá</span>
              </div>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Xem tất cả điểm đến
          </button>
        </div>
      </div>
    </section>
  )
}
