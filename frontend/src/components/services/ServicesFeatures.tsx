import React from 'react';

const features = [
  {
    icon: '🏥',
    title: 'Trang Thiết Bị Hiện Đại',
    description: 'Hệ thống máy móc, thiết bị nha khoa nhập khẩu từ Mỹ, Đức, Nhật Bản'
  },
  {
    icon: '👨‍⚕️',
    title: 'Đội Ngũ Bác Sĩ Giàu Kinh Nghiệm',
    description: 'Bác sĩ chuyên môn cao, được đào tạo bài bản trong và ngoài nước'
  },
  {
    icon: '🛡️',
    title: 'An Toàn & Vô Trùng',
    description: 'Quy trình vô trùng nghiêm ngặt theo tiêu chuẩn quốc tế'
  },
  {
    icon: '💰',
    title: 'Chi Phí Hợp Lý',
    description: 'Bảng giá minh bạch, nhiều chương trình ưu đãi hấp dẫn'
  },
  {
    icon: '⏰',
    title: 'Lịch Hẹn Linh Hoạt',
    description: 'Làm việc cả tuần, sẵn sàng phục vụ theo lịch hẹn của bạn'
  },
  {
    icon: '🎁',
    title: 'Bảo Hành Dài Hạn',
    description: 'Chế độ bảo hành uy tín, theo dõi sau điều trị chu đáo'
  }
];

export function ServicesFeatures() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cam kết mang đến trải nghiệm điều trị nha khoa tốt nhất cho bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
