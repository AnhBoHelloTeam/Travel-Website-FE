import React from 'react'

export const TravelBlog: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khám phá Việt Nam
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những điểm đến tuyệt vời và trải nghiệm du lịch đáng nhớ trên khắp đất nước Việt Nam
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Đà Nẵng"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Du lịch
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Đà Nẵng - Thành phố đáng sống bên bờ biển
              </h3>
              <p className="text-gray-600 mb-4">
                Khám phá những điểm đến tuyệt vời tại Đà Nẵng, từ bãi biển Mỹ Khê đến cầu Vàng nổi tiếng.
              </p>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Đọc thêm
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Huế"
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Văn hóa
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Huế - Cố đô mộng mơ với di sản văn hóa
              </h3>
              <p className="text-gray-600 mb-4">
                Hành trình khám phá Huế cổ kính với những cung điện, lăng tẩm và sông Hương thơ mộng.
              </p>
              <button className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Đọc thêm
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">
              Bạn có câu chuyện du lịch thú vị?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Chia sẻ trải nghiệm du lịch của bạn và giúp những người khác khám phá những điểm đến tuyệt vời
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors">
                Viết bài
              </button>
              <button className="px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                Xem tất cả
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
