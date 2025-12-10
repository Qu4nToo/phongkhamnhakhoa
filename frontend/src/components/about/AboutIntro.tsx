import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Award, Users, Heart, Shield } from 'lucide-react';

const highlights = [
  {
    icon: Award,
    title: 'Chất Lượng Hàng Đầu',
    description: 'Được công nhận bởi các tổ chức nha khoa quốc tế',
  },
  {
    icon: Users,
    title: 'Đội Ngũ Chuyên Nghiệp',
    description: 'Bác sĩ giàu kinh nghiệm, được đào tạo bài bản',
  },
  {
    icon: Heart,
    title: 'Tận Tâm Với Bệnh Nhân',
    description: 'Chăm sóc chu đáo từng khách hàng như người thân',
  },
  {
    icon: Shield,
    title: 'An Toàn Tuyệt Đối',
    description: 'Tuân thủ nghiêm ngặt quy trình vô trùng quốc tế',
  },
];

export function AboutIntro() {
  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span>{'>'}</span>
          <span className="text-blue-600">Về chúng tôi</span>
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <p className="text-blue-600 mb-4">Giới Thiệu</p>
            <h2 className="text-gray-900 mb-6">
              Hơn 15 Năm Đồng Hành Cùng Nụ Cười Việt
            </h2>
            <p className="text-gray-600 mb-4">
              Nha Khoa Nụ Cười được thành lập vào năm 2008 với sứ mệnh mang đến dịch vụ nha khoa chất lượng cao, an toàn và hiện đại nhất cho cộng đồng. Trải qua hơn 15 năm phát triển, chúng tôi tự hào là một trong những cơ sở nha khoa uy tín hàng đầu tại Việt Nam.
            </p>
            <p className="text-gray-600 mb-4">
              Với đội ngũ bác sĩ giàu kinh nghiệm, trang thiết bị hiện đại nhập khẩu từ Mỹ, Châu Âu và quy trình điều trị chuẩn quốc tế, chúng tôi cam kết mang đến cho khách hàng những dịch vụ chăm sóc răng miệng tốt nhất.
            </p>
            <p className="text-gray-600">
              Nha Khoa Nụ Cười không chỉ là nơi điều trị mà còn là địa chỉ tin cậy để bạn và gia đình có thể tìm đến với sự yên tâm tuyệt đối về chất lượng và dịch vụ.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1758205308181-d52b41e00cef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjB0ZWFtJTIwc21pbGluZ3xlbnwxfHx8fDE3NjUxODc5MzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Đội ngũ nha khoa"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
