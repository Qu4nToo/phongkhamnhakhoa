import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const benefits = [
  'Giá cả minh bạch, rõ ràng',
  'Không phát sinh chi phí ẩn',
  'Tư vấn chi tiết trước điều trị',
  'Nhiều hình thức thanh toán',
  'Bảo hành dài hạn'
];

export function PricingIntro() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-gray-900 mb-4">
                Cam Kết Giá Tốt Nhất
              </h2>
              <p className="text-gray-600 mb-6">
                Nha Khoa Nụ Cười cam kết mang đến cho khách hàng mức giá tốt nhất với chất lượng dịch vụ cao nhất. Tất cả chi phí đều được tư vấn rõ ràng, minh bạch ngay từ đầu.
              </p>
              <p className="text-gray-600">
                Bảng giá dưới đây là giá tham khảo. Để biết chính xác chi phí điều trị, quý khách vui lòng đến khám và tư vấn trực tiếp với bác sĩ.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
