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
        
        {/* Blog Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Đà Nẵng"
                    className="w-full h-48 object-cover"
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
                    className="w-full h-48 object-cover"
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📚 Bài viết nổi bật</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Hội An"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        Hội An - Phố cổ lãng mạn bên sông Thu Bồn
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">15/12/2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Sapa"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        Sapa - Vùng đất mây mù và ruộng bậc thang
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">12/12/2024</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                      alt="Nha Trang"
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        Nha Trang - Thành phố biển xanh miền Trung
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">10/12/2024</p>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 text-sm border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Xem tất cả
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
                <h3 className="text-lg font-bold mb-3">💡 Mẹo du lịch</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">💰</span>
                    <span className="text-sm">Tiết kiệm chi phí</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🎒</span>
                    <span className="text-sm">Chuẩn bị hành lý</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">📸</span>
                    <span className="text-sm">Chụp ảnh đẹp</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                  Xem mẹo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
