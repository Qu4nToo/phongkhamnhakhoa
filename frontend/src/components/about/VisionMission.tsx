import React from 'react';
import { Target, Eye } from 'lucide-react';

export function VisionMission() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-6">Tầm Nhìn</h2>
            <p className="text-gray-600 mb-4">
              Trở thành hệ thống nha khoa hàng đầu tại Việt Nam, được khách hàng tin tưởng và lựa chọn bởi chất lượng dịch vụ xuất sắc, công nghệ tiên tiến và đội ngũ bác sĩ chuyên nghiệp.
            </p>
            <p className="text-gray-600">
              Chúng tôi hướng đến mục tiêu mang lại nụ cười tự tin và sức khỏe răng miệng tốt nhất cho hàng triệu người Việt Nam, đồng thời không ngừng nâng cao tiêu chuẩn chăm sóc nha khoa tại Việt Nam.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-6">Sứ Mệnh</h2>
            <p className="text-gray-600 mb-4">
              Cung cấp dịch vụ chăm sóc và điều trị răng miệng chất lượng cao, an toàn và hiệu quả với chi phí hợp lý, giúp mọi người tiếp cận được dịch vụ nha khoa chất lượng.
            </p>
            <p className="text-gray-600">
              Xây dựng đội ngũ bác sĩ chuyên môn giỏi, tận tâm với nghề, luôn đặt lợi ích của khách hàng lên hàng đầu. Không ngừng đầu tư trang thiết bị hiện đại và áp dụng các công nghệ tiên tiến nhất trong lĩnh vực nha khoa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
