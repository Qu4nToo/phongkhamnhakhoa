'use client';
import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, Briefcase } from 'lucide-react';
import axios from 'axios';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from 'embla-carousel-autoplay';

interface Doctor {
  MaBacSi: string;
  HoTen: string;
  ChuyenKhoa: string;
  BangCap: string;
  ChuyenMon: string;
  KinhNghiem: number;
  AnhDaiDien?: string;
}

export function DoctorTeam() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/bac-si/get');
        setDoctors(response.data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách bác sĩ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Đang tải...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-600 mb-2">Đội Ngũ Bác Sĩ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đội Ngũ Chuyên Gia Hàng Đầu
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Đội ngũ bác sĩ giàu kinh nghiệm, được đào tạo bài bản tại các trường đại học y khoa uy tín trong và ngoài nước, luôn cập nhật kiến thức và kỹ thuật mới nhất.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          className="w-full "
        >
          <CarouselContent className="-ml-2 md:-ml-4 mb-2">
            {doctors.map((doctor) => (
              <CarouselItem key={doctor.MaBacSi} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
                  <div className="h-72 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                    <img
                      src={doctor.AnhDaiDien || "https://firebasestorage.googleapis.com/v0/b/phongkhamnhakhoahoangquan.firebasestorage.app/o/AnhWeb%2FOlymstore%20001361%20(2).jpg?alt=media&token=a1b1a37c-9917-49f0-85df-00ce94cc8c7f"}
                      alt={doctor.HoTen}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">BS. {doctor.HoTen}</h3>
                    <p className="text-blue-600 font-medium mb-4">{doctor.ChuyenKhoa}</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">{doctor.BangCap}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">{doctor.KinhNghiem} năm kinh nghiệm</p>
                      </div>
                      <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                        <Briefcase className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          <span className="font-medium text-gray-900">Chuyên môn:</span> {doctor.ChuyenMon}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-4 lg:-left-6 h-12 w-12 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 shadow-lg transition-all" />
          <CarouselNext className="hidden md:flex absolute -right-4 lg:-right-6 h-12 w-12 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-500 shadow-lg transition-all" />
        </Carousel>
      </div>
    </section>
  );
}
