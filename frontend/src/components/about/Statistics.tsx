import React from 'react';
import { Users, Award, Clock, Smile } from 'lucide-react';

const stats = [
  {
    icon: Users,
    number: '50,000+',
    label: 'Khách Hàng Tin Tưởng',
    description: 'Đã được phục vụ và hài lòng',
  },
  {
    icon: Clock,
    number: '15+',
    label: 'Năm Kinh Nghiệm',
    description: 'Trong lĩnh vực nha khoa',
  },
  {
    icon: Award,
    number: '25+',
    label: 'Bác Sĩ Chuyên Khoa',
    description: 'Được đào tạo chuyên sâu',
  },
  {
    icon: Smile,
    number: '98%',
    label: 'Khách Hàng Hài Lòng',
    description: 'Đánh giá tích cực về dịch vụ',
  },
];

export function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 mb-4">
            Con Số Ấn Tượng
          </h2>
          <p className="text-gray-900 max-w-2xl mx-auto">
            Những thành tựu đáng tự hào trong suốt hành trình phát triển của chúng tôi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-gray-900  text-4xl mb-2">{stat.number}</div>
              <div className="text-gray-900  text-xl mb-2">{stat.label}</div>
              <p className="text-gray-900 ">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
