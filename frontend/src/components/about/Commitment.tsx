import React from 'react';
import { CheckCircle2, Shield, Clock, Heart, Link } from 'lucide-react';

const commitments = [
  {
    icon: CheckCircle2,
    title: 'Cam Kết Chất Lượng',
    points: [
      'Sử dụng vật liệu chính hãng có nguồn gốc rõ ràng',
      'Quy trình điều trị theo tiêu chuẩn quốc tế',
      'Bảo hành dài hạn cho các dịch vụ điều trị',
      'Theo dõi và chăm sóc sau điều trị',
    ],
  },
  {
    icon: Shield,
    title: 'Cam Kết An Toàn',
    points: [
      'Tuân thủ nghiêm ngặt quy trình vô trùng',
      'Kiểm soát nhiễm khuẩn theo chuẩn quốc tế',
      'Bảo mật thông tin khách hàng tuyệt đối',
      'Môi trường điều trị sạch sẽ, an toàn',
    ],
  },
  {
    icon: Clock,
    title: 'Cam Kết Thời Gian',
    points: [
      'Đúng giờ hẹn, không để khách hàng chờ đợi',
      'Thời gian điều trị được thông báo rõ ràng',
      'Linh hoạt sắp xếp lịch hẹn theo yêu cầu',
      'Hỗ trợ khẩn cấp 24/7',
    ],
  },
  {
    icon: Heart,
    title: 'Cam Kết Dịch Vụ',
    points: [
      'Tư vấn miễn phí và chi tiết trước điều trị',
      'Chi phí minh bạch, không phát sinh',
      'Chăm sóc khách hàng tận tình, chu đáo',
      'Hỗ trợ sau điều trị lâu dài',
    ],
  },
];

export function Commitment() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 mb-2">Cam Kết Của Chúng Tôi</p>
          <h2 className="text-gray-900 mb-4">
            Những Cam Kết Với Khách Hàng
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Chúng tôi cam kết mang đến cho khách hàng trải nghiệm dịch vụ nha khoa tốt nhất với sự chuyên nghiệp, tận tâm và chất lượng cao nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {commitments.map((commitment, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <commitment.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-gray-900 pt-3">{commitment.title}</h3>
              </div>
              <ul className="space-y-3">
                {commitment.points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-white mb-6">
            Hãy Để Chúng Tôi Chăm Sóc Nụ Cười Của Bạn
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn. Đặt lịch hẹn ngay hôm nay để được khám và tư vấn miễn phí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/DatLich"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
            >
              Đặt Lịch Khám Ngay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
