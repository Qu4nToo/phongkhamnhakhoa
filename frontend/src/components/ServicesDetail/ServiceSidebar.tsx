import { Phone, Calendar } from 'lucide-react';

interface ServiceSidebarProps {
  service?: any;
}

export function ServiceSidebar({ service }: ServiceSidebarProps) {
  return (
    <div className="bg-gray-50 rounded p-6 sticky top-4">
      <div className="mb-4">
        <div className="text-2xl text-blue-900 mb-1 font-bold">
          {service?.Gia ? `${parseInt(service.Gia).toLocaleString('vi-VN')}₫` : '34.000.000₫'}
        </div>
        <p className="text-xs text-gray-500">
          *Dự thực tế phải của bác sĩ
        </p>
      </div>

      <div className="space-y-2 mb-6 pb-6 border-b border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Đơn vị: {service?.DonVi || 'Lần'}</span>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-gray-600">Dịch vụ:</span>
          <a href={`/DichVu/${service?.SlugLoaiDV}`} className="text-blue-600 hover:underline">
            {service?.TenLoaiDV || 'Trồng răng implant'}
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <a 
          href="/DatLich"
          className="w-full bg-blue-900 hover:bg-blue-800 text-white py-3 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Gọi ngay (Dịch hợp, Tư vấn miễn phí)
        </a>
        
        <a 
          href="/DatLich"
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          Đặt lịch ngay
        </a>
      </div>
    </div>
  );
}