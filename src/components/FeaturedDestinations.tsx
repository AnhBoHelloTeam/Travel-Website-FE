import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface Destination {
  id: string
  name: string
  description: string
  image: string
  rating: number
  reviews: number
  price: string
  duration: string
  highlights: string[]
}

const destinations: Destination[] = [
  {
    id: '1',
    name: 'Đà Nẵng - Thành phố biển xanh',
    description: 'Khám phá bãi biển Mỹ Khê tuyệt đẹp, cầu Vàng độc đáo và ẩm thực đặc sắc',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: 4.8,
    reviews: 1247,
    price: 'Từ 1.200.000đ',
    duration: '3-5 ngày',
    highlights: ['Bãi biển Mỹ Khê', 'Cầu Vàng', 'Bà Nà Hills', 'Ẩm thực đặc sắc']
  },
  {
    id: '2',
    name: 'Huế - Cố đô mộng mơ',
    description: 'Trải nghiệm văn hóa cung đình, lăng tẩm cổ kính và sông Hương thơ mộng',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: 4.7,
    reviews: 892,
    price: 'Từ 800.000đ',
    duration: '2-3 ngày',
    highlights: ['Cung điện Huế', 'Lăng tẩm', 'Sông Hương', 'Ẩm thực cung đình']
  },
  {
    id: '3',
    name: 'Hội An - Phố cổ lãng mạn',
    description: 'Dạo bước trên phố cổ, thưởng thức đèn lồng lung linh và ẩm thực phong phú',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    rating: 4.9,
    reviews: 1563,
    price: 'Từ 600.000đ',
    duration: '1-2 ngày',
    highlights: ['Phố cổ', 'Đèn lồng', 'Chợ đêm', 'Làng gốm']
  }
]

export const FeaturedDestinations: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Điểm đến nổi bật
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những điểm đến được yêu thích nhất với trải nghiệm du lịch tuyệt vời
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="relative">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-90 rounded-full px-3 py-1 flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">{destination.rating}</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {destination.price}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {destination.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {destination.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{destination.duration}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{destination.reviews} đánh giá</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Điểm nổi bật:</h4>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <Button className="w-full">
                  Khám phá ngay
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Xem tất cả điểm đến
          </Button>
        </div>
      </div>
    </section>
  )
}
