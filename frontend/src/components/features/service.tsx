import React from 'react';
import { Smile, Sparkles, Shield, Zap, Users, Award } from 'lucide-react';

const services = [
  {
    icon: Smile,
    title: 'Vệ Sinh Răng Miệng',
    description: 'Làm sạch chuyên nghiệp và chăm sóc phòng ngừa để giữ răng khỏe mạnh.',
  },
  {
    icon: Sparkles,
    title: 'Tẩy Trắng Răng',
    description: 'Công nghệ tẩy trắng tiên tiến cho nụ cười trắng sáng tự tin.',
  },
  {
    icon: Shield,
    title: 'Cấy Ghép Implant',
    description: 'Giải pháp thay thế răng vĩnh viễn trông và cảm giác tự nhiên.',
  },
  {
    icon: Zap,
    title: 'Chỉnh Nha',
    description: 'Niềng răng và khay trong suốt để răng đều đẹp và hoàn thiện nụ cười.',
  },
  {
    icon: Users,
    title: 'Nha Khoa Gia Đình',
    description: 'Chăm sóc răng miệng toàn diện cho mọi lứa tuổi và gia đình.',
  },
  {
    icon: Award,
    title: 'Nha Khoa Thẩm Mỹ',
    description: 'Thay đổi nụ cười với dán sứ veneer, trám răng và làm đẹp nụ cười.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 mb-2">Dịch Vụ Của Chúng Tôi</p>
          <h2 className="text-gray-900 mb-4">
            Giải Pháp Nha Khoa Toàn Diện
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Từ khám định kỳ đến các thủ thuật thẩm mỹ nâng cao, chúng tôi cung cấp dịch vụ nha khoa đa dạng để đáp ứng mọi nhu cầu sức khỏe răng miệng của bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow group"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                <service.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}