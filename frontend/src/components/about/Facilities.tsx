import React from 'react';
import { Microscope, Droplet, Radio, Zap } from 'lucide-react';

const equipment = [
  {
    icon: Microscope,
    title: 'Kính Hiển Vi Nha Khoa',
    description: 'Hỗ trợ chẩn đoán và điều trị chính xác cao',
    origin: 'Nhập khẩu từ Đức',
  },
  {
    icon: Radio,
    title: 'Máy Chụp CT Cone Beam 3D',
    description: 'Chụp hình ảnh 3D chi tiết vùng hàm mặt',
    origin: 'Công nghệ Mỹ',
  },
  {
    icon: Zap,
    title: 'Máy Cấy Ghép Implant',
    description: 'Công nghệ cấy ghép hiện đại, chính xác',
    origin: 'Thụy Sĩ',
  },
  {
    icon: Droplet,
    title: 'Hệ Thống Khử Trùng',
    description: 'Tiệt trùng công cụ theo tiêu chuẩn quốc tế',
    origin: 'Châu Âu',
  },
];

export function Facilities() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/phongkhamnhakhoahoangquan.firebasestorage.app/o/AnhWeb%2Fthiet-bi.jpg?alt=media&token=b56701f2-4e36-4af4-bf08-b56c7b55eadf"
              alt="Trang thiết bị hiện đại"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div>
            <p className="text-blue-600 mb-4">Cơ Sở Vật Chất</p>
            <h2 className="text-gray-900 mb-6">
              Trang Thiết Bị Hiện Đại Hàng Đầu
            </h2>
            <p className="text-gray-600 mb-8">
              Nha Khoa Nụ Cười đầu tư hệ thống trang thiết bị nha khoa hiện đại nhất, nhập khẩu từ Mỹ, Châu Âu, giúp đảm bảo chất lượng điều trị cao nhất và mang lại trải nghiệm tốt nhất cho khách hàng.
            </p>

            <div className="space-y-6">
              {equipment.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 mb-1">{item.description}</p>
                    <p className="text-blue-600">{item.origin}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-blue-600 mb-2">100%</div>
              <p className="text-gray-900 mb-2">Dụng Cụ Vô Trùng</p>
              <p className="text-gray-600">Đảm bảo an toàn tuyệt đối</p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-2">ISO 9001:2015</div>
              <p className="text-gray-900 mb-2">Chứng Nhận Quốc Tế</p>
              <p className="text-gray-600">Hệ thống quản lý chất lượng</p>
            </div>
            <div className="text-center">
              <div className="text-blue-600 mb-2">24/7</div>
              <p className="text-gray-900 mb-2">Hỗ Trợ Khẩn Cấp</p>
              <p className="text-gray-600">Sẵn sàng phục vụ mọi lúc</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
