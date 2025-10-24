import React from 'react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  readTime: string
  category: string
  tags: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Đà Nẵng - Thành phố đáng sống bên bờ biển',
    excerpt: 'Khám phá những điểm đến tuyệt vời tại Đà Nẵng, từ bãi biển Mỹ Khê đến cầu Vàng nổi tiếng. Trải nghiệm ẩm thực đặc sắc và văn hóa địa phương.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    author: 'Nguyễn Văn A',
    date: '15/12/2024',
    readTime: '5 phút',
    category: 'Du lịch',
    tags: ['Đà Nẵng', 'Biển', 'Cầu Vàng', 'Ẩm thực']
  },
  {
    id: '2',
    title: 'Huế - Cố đô mộng mơ với di sản văn hóa',
    excerpt: 'Hành trình khám phá Huế cổ kính với những cung điện, lăng tẩm và sông Hương thơ mộng. Trải nghiệm văn hóa cung đình và ẩm thực hoàng gia.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    author: 'Trần Thị B',
    date: '12/12/2024',
    readTime: '7 phút',
    category: 'Văn hóa',
    tags: ['Huế', 'Cố đô', 'Lăng tẩm', 'Sông Hương']
  },
  {
    id: '3',
    title: 'Hội An - Phố cổ lãng mạn bên sông Thu Bồn',
    excerpt: 'Dạo bước trên những con phố cổ Hội An, thưởng thức đèn lồng lung linh và ẩm thực phong phú. Khám phá làng gốm Thanh Hà và chợ đêm sôi động.',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    author: 'Lê Văn C',
    date: '10/12/2024',
    readTime: '6 phút',
    category: 'Di sản',
    tags: ['Hội An', 'Phố cổ', 'Đèn lồng', 'Ẩm thực']
  },
  {
    id: '4',
    title: 'Sapa - Vùng đất mây mù và ruộng bậc thang',
    excerpt: 'Chinh phục đỉnh Fansipan, khám phá ruộng bậc thang Tả Van và gặp gỡ các dân tộc thiểu số. Trải nghiệm văn hóa đa dạng và cảnh quan thiên nhiên hùng vĩ.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    author: 'Phạm Thị D',
    date: '08/12/2024',
    readTime: '8 phút',
    category: 'Thiên nhiên',
    tags: ['Sapa', 'Fansipan', 'Ruộng bậc thang', 'Dân tộc']
  }
]

export const TravelBlog: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Khám phá Việt Nam
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Những điểm đến tuyệt vời và trải nghiệm du lịch đáng nhớ trên khắp đất nước Việt Nam
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    {post.readTime}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="mr-4">{post.author}</span>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" className="w-full">
                  Đọc thêm
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
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
