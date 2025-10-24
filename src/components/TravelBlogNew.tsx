import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

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
        
        <div className="text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Bạn có câu chuyện du lịch thú vị?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Chia sẻ trải nghiệm du lịch của bạn và giúp những người khác khám phá những điểm đến tuyệt vời
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg">
                  Viết bài
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Xem tất cả
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
