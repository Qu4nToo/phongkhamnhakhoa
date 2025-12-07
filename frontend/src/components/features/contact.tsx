import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Địa Chỉ',
    details: ['456 Đường Nha Khoa', 'Quận 1, TP. Hồ Chí Minh'],
  },
  {
    icon: Phone,
    title: 'Điện Thoại',
    details: ['+84 (028) 1234 5678', '+84 (028) 1234 5679'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['nucuoi@nhakhoa.vn', 'datlich@nhakhoa.vn'],
  },
  {
    icon: Clock,
    title: 'Giờ Làm Việc',
    details: ['Thứ 2 - 6: 8:00 - 19:00', 'Thứ 7: 9:00 - 15:00'],
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 mb-2">Liên Hệ</p>
          <h2 className="text-gray-900 mb-4">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bạn có câu hỏi hoặc cần đặt lịch hẹn? Chúng tôi sẵn sàng hỗ trợ bạn.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {contactInfo.map((info, index) => (
            <div key={index} className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <info.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-900 mb-3">{info.title}</h3>
              {info.details.map((detail, idx) => (
                <p key={idx} className="text-gray-600">
                  {detail}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}