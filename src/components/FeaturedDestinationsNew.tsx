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
        
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">
              Khám phá những điểm đến tuyệt vời
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Từ Đà Nẵng đến Huế, từ Hội An đến Sapa - khám phá vẻ đẹp của Việt Nam
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
