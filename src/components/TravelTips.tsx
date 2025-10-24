import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface TravelTip {
  id: string
  title: string
  description: string
  icon: string
  category: string
  readTime: string
}

const travelTips: TravelTip[] = [
  {
    id: '1',
    title: 'Mẹo tiết kiệm chi phí khi du lịch',
    description: 'Những cách hay để tiết kiệm tiền khi đi du lịch mà vẫn có trải nghiệm tuyệt vời',
    icon: '💰',
    category: 'Tiết kiệm',
    readTime: '3 phút'
  },
  {
    id: '2',
    title: 'Chuẩn bị hành lý thông minh',
    description: 'Danh sách những vật dụng cần thiết và cách sắp xếp hành lý hiệu quả',
    icon: '🎒',
    category: 'Chuẩn bị',
    readTime: '4 phút'
  },
  {
    id: '3',
    title: 'Chụp ảnh du lịch đẹp như nhiếp ảnh gia',
    description: 'Bí quyết chụp ảnh đẹp khi du lịch với điện thoại và máy ảnh',
    icon: '📸',
    category: 'Nhiếp ảnh',
    readTime: '5 phút'
  },
  {
    id: '4',
    title: 'An toàn khi du lịch một mình',
    description: 'Những lưu ý quan trọng để đảm bảo an toàn khi đi du lịch solo',
    icon: '🛡️',
    category: 'An toàn',
    readTime: '6 phút'
  },
  {
    id: '5',
    title: 'Giao tiếp với người dân địa phương',
    description: 'Cách học và sử dụng ngôn ngữ địa phương để có trải nghiệm sâu sắc hơn',
    icon: '🗣️',
    category: 'Giao tiếp',
    readTime: '4 phút'
  },
  {
    id: '6',
    title: 'Tìm kiếm ẩm thực địa phương',
    description: 'Hướng dẫn tìm và thưởng thức những món ăn ngon nhất tại điểm đến',
    icon: '🍜',
    category: 'Ẩm thực',
    readTime: '3 phút'
  }
]

export const TravelTips: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Mẹo du lịch hữu ích
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những kinh nghiệm và mẹo hay giúp bạn có chuyến du lịch hoàn hảo
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {travelTips.map((tip) => (
            <Card key={tip.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="text-3xl mr-4">{tip.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {tip.category}
                      </span>
                      <span className="text-sm text-gray-500">{tip.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {tip.description}
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Đọc thêm
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="p-8 text-center">
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
              <Button variant="secondary" size="lg">
                Đăng ký
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
