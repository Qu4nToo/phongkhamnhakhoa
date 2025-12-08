import React from 'react';
import { Heart, Star, TrendingUp, Handshake, Shield, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Tận Tâm',
    description: 'Chăm sóc khách hàng với sự tận tình, chu đáo như người thân trong gia đình.',
  },
  {
    icon: Star,
    title: 'Chất Lượng',
    description: 'Cam kết chất lượng điều trị cao nhất với công nghệ và kỹ thuật hiện đại.',
  },
  {
    icon: TrendingUp,
    title: 'Chuyên Nghiệp',
    description: 'Đội ngũ bác sĩ được đào tạo bài bản, có chuyên môn cao và kinh nghiệm lâu năm.',
  },
  {
    icon: Handshake,
    title: 'Uy Tín',
    description: 'Xây dựng niềm tin qua từng dịch vụ, luôn minh bạch và trung thực với khách hàng.',
  },
  {
    icon: Shield,
    title: 'An Toàn',
    description: 'Tuân thủ nghiêm ngặt quy trình vô trùng và kiểm soát nhiễm khuẩn theo tiêu chuẩn quốc tế.',
  },
  {
    icon: Users,
    title: 'Đồng Hành',
    description: 'Luôn đồng hành cùng khách hàng trong suốt quá trình điều trị và chăm sóc sau đó.',
  },
];

export function CoreValues() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 mb-2">Giá Trị Cốt Lõi</p>
          <h2 className="text-gray-900 mb-4">
            Những Giá Trị Chúng Tôi Theo Đuổi
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Giá trị cốt lõi của chúng tôi là nền tảng cho mọi hoạt động, định hướng phát triển và tạo nên sự khác biệt trong cách chúng tôi phục vụ khách hàng.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl hover:shadow-lg transition-shadow border border-blue-100"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
