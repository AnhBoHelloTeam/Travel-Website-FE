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
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">
              Nhận mẹo du lịch mới nhất
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Đăng ký nhận bản tin để cập nhật những mẹo du lịch, điểm đến mới và ưu đãi hấp dẫn
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
