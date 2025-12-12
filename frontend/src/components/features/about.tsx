"use client"
import React from 'react';
import { CheckCircle } from 'lucide-react';

const features = [
  'Đội ngũ nha sĩ giàu kinh nghiệm',
  'Công nghệ nha khoa hiện đại',
  'Điều trị không đau đớn',
  'Chăm sóc tận tâm với bệnh nhân',
  'Lịch hẹn linh hoạt',
  'Cơ sở vật chất hiện đại, thoải mái',
];

export function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/phongkhamnhakhoahoangquan.firebasestorage.app/o/AnhWeb%2Fcustomer.jpg?alt=media&token=e11717fb-e905-46a4-8e5b-78ebc9346f71"
                alt="Dentist with patient"
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg mt-8">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/phongkhamnhakhoahoangquan.firebasestorage.app/o/AnhWeb%2Fthiet-bi.jpg?alt=media&token=b56701f2-4e36-4af4-bf08-b56c7b55eadf"
                alt="Dental team"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-blue-600">Về Chúng Tôi</p>
            <h2 className="text-gray-900">
              Tạo Nên Nụ Cười Đẹp Từ Năm 2008
            </h2>
            <p className="text-gray-600">
              Với hơn 15 năm kinh nghiệm, chúng tôi là địa chỉ chăm sóc nha khoa tin cậy của hàng nghìn gia đình. Đội ngũ nha sĩ và trợ lý nha khoa tay nghề cao luôn tận tâm giúp bạn đạt được sức khỏe răng miệng tối ưu và nụ cười như mơ ước.
            </p>
            <p className="text-gray-600">
              Chúng tôi kết hợp công nghệ nha khoa tiên tiến với cách tiếp cận nhẹ nhàng, lấy bệnh nhân làm trung tâm. Dù bạn cần làm sạch răng định kỳ hay làm đẹp nụ cười toàn diện, chúng tôi luôn sẵn sàng cung cấp dịch vụ chăm sóc xuất sắc trong môi trường thư giãn.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}