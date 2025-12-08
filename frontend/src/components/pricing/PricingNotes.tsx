import React from 'react';
import { Info, AlertCircle, Gift, Shield } from 'lucide-react';

const notes = [
  {
    icon: Info,
    title: 'Lưu Ý',
    color: 'blue',
    points: [
      'Bảng giá trên là giá tham khảo, có thể thay đổi tùy theo tình trạng răng miệng thực tế',
      'Giá đã bao gồm VAT',
      'Giá chưa bao gồm các chi phí phát sinh khác (nếu có)',
      'Để biết chính xác chi phí, quý khách vui lòng đến khám và tư vấn trực tiếp',
    ],
  },
  {
    icon: Gift,
    title: 'Ưu Đãi',
    color: 'green',
    points: [
      'Miễn phí khám và tư vấn chi tiết',
      'Miễn phí chụp phim Xquang khi điều trị',
      'Giảm 10% cho khách hàng giới thiệu người thân',
      'Ưu đãi đặc biệt cho khách hàng thân thiết',
    ],
  },
  {
    icon: Shield,
    title: 'Bảo Hành',
    color: 'purple',
    points: [
      'Bảo hành răng sứ từ 5-10 năm',
      'Bảo hành Implant trọn đời (theo điều kiện)',
      'Bảo hành niềng răng trong suốt quá trình điều trị',
      'Miễn phí tái khám và điều chỉnh trong thời gian bảo hành',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Điều Kiện Áp Dụng',
    color: 'red',
    points: [
      'Tuân thủ đúng hướng dẫn của bác sĩ sau điều trị',
      'Đi tái khám định kỳ theo lịch hẹn',
      'Vệ sinh răng miệng đúng cách hàng ngày',
      'Thông báo ngay cho nha khoa khi có bất thường',
    ],
  },
];

const colorClasses = {
  blue: 'bg-blue-600',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  red: 'bg-red-600',
};

export function PricingNotes() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Thông Tin Quan Trọng
          </h2>
          <p className="text-gray-600">
            Vui lòng đọc kỹ các thông tin dưới đây trước khi quyết định điều trị
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {notes.map((note, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 ${colorClasses[note.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <note.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-gray-900 pt-2">{note.title}</h3>
              </div>
              <ul className="space-y-3">
                {note.points.map((point, pIndex) => (
                  <li key={pIndex} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 ${colorClasses[note.color as keyof typeof colorClasses]} rounded-full mt-2 flex-shrink-0`} />
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
