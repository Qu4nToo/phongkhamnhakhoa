import React from 'react';
import { Phone, Calendar, MessageCircle, MapPin } from 'lucide-react';

export function ConsultationCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48" />

          <div className="relative">
            <div className="text-center mb-12">
              <h2 className="text-white mb-4">
                Cần Tư Vấn Chi Tiết Về Giá?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí và chi tiết về chi phí điều trị phù hợp với tình trạng răng miệng của bạn.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <div className="text-white mb-2">Gọi Điện</div>
                <p className="text-blue-100">+84 (028) 1234 5678</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <Calendar className="w-8 h-8 mx-auto mb-3" />
                <div className="text-white mb-2">Đặt Lịch</div>
                <p className="text-blue-100">Online hoặc gọi điện</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-colors">
                <MapPin className="w-8 h-8 mx-auto mb-3" />
                <div className="text-white mb-2">Đến Trực Tiếp</div>
                <p className="text-blue-100">Quận 1, TP.HCM</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/DatLich"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                Đặt Lịch Khám Ngay
              </a>
            </div>

            <div className="text-center mt-8">
              <p className="text-blue-100">
                ⭐ Khám và tư vấn hoàn toàn miễn phí - Không phát sinh chi phí ẩn
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
