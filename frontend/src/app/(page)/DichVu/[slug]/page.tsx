"use client"
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/features/header';
import { ServicesGrid } from '@/components/services/ServicesGrid';
import Footer from "@/components/features/footer";
import { TitleProvider } from '@/components/features/TitleContext';
import axios from 'axios';
import { ServicesFeatures } from '@/components/services/ServicesFeatures';

export default function ServiceByCategory() {
  const params = useParams();
  const slug = params?.slug as string;
  const [loaiDichVu, setLoaiDichVu] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServicesBySlug = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // 1. Lấy thông tin loại dịch vụ từ slug
        const loaiDVResponse = await axios.get(`http://localhost:5000/api/loai-dich-vu/getBySlug/${slug}`);
        const loaiDVData = loaiDVResponse.data;
        setLoaiDichVu(loaiDVData);
        
        // 2. Lấy danh sách dịch vụ theo MaLoaiDV
        const dichVuResponse = await axios.get(`http://localhost:5000/api/dich-vu/byLoaiDichVuID/${loaiDVData.MaLoaiDV}`);
        // Lọc chỉ lấy dịch vụ đang hoạt động
        const activeDichVu = dichVuResponse.data.filter((dv: any) => dv.TrangThai === 'Đang hoạt động');
        setServices(activeDichVu);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError(error.response?.data?.message || 'Không thể tải dữ liệu dịch vụ');
      } finally {
        setLoading(false);
      }
    };

    fetchServicesBySlug();
  }, [slug]);

  if (loading) {
    return (
      <TitleProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
          <Footer />
        </div>
      </TitleProvider>
    );
  }

  if (error || !loaiDichVu) {
    return (
      <TitleProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-600">{error || 'Không tìm thấy loại dịch vụ'}</p>
          </div>
          <Footer />
        </div>
      </TitleProvider>
    );
  }

  return (
    <TitleProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <ServicesGrid services={services} title={loaiDichVu.TenLoaiDV} />
        <ServicesFeatures />
        <Footer />
      </div>
    </TitleProvider>
  );
}
