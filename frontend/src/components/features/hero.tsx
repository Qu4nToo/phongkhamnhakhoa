import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, Link } from 'lucide-react';

export function Hero() {
    return (
        <section id="home" className="relative bg-gradient-to-br from-blue-50 to-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-blue-900">
                            Nụ Cười Hoàn Hảo Bắt Đầu Từ Đây
                        </h1>
                        <p className="text-gray-600">
                            Trải nghiệm dịch vụ nha khoa đẳng cấp từ đội ngũ chuyên gia tận tâm. Chúng tôi cam kết mang đến cho bạn nụ cười khỏe đẹp trong môi trường thân thiện và chuyên nghiệp.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="/DatLich" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Đặt Lịch Hẹn
                            </a>
                        </div>
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            <div>
                                <div className="text-blue-600">15+</div>
                                <p className="text-gray-600">Năm Kinh Nghiệm</p>
                            </div>
                            <div>
                                <div className="text-blue-600">25+</div>
                                <p className="text-gray-600">Bác Sĩ Chuyên Khoa</p>
                            </div>
                            <div>
                                <div className="text-blue-600">15k+</div>
                                <p className="text-gray-600">Khách Hàng Hài Lòng</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <Image
                                src="https://firebasestorage.googleapis.com/v0/b/phongkhamnhakhoahoangquan.firebasestorage.app/o/AnhWeb%2Fbanner-img.jpg?alt=media&token=d7fde876-fc9c-4aca-a534-457e2e8655c2"
                                alt="Modern dental clinic"
                                width={800}
                                height={600}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}