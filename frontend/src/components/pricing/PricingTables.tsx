"use client"
import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';

interface Service {
  MaDichVu: string;
  TenDichVu: string;
  Gia: number;
  DonVi?: string;
  MoTa?: string;
  TrangThai: string;
}

interface Category {
  MaLoaiDichVu: string;
  TenLoaiDichVu: string;
  MoTa?: string;
  services: Service[];
}

export function PricingTables() {
  const [pricingData, setPricingData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<number[]>([0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch loại dịch vụ
        const categoriesRes = await axios.get('http://localhost:5000/api/loai-dich-vu/get');
        const servicesRes = await axios.get('http://localhost:5000/api/dich-vu/get');

        console.log('Categories:', categoriesRes.data);
        console.log('Services:', servicesRes.data);

        // Lọc chỉ lấy dịch vụ đang hoạt động
        const activeServices = servicesRes.data.filter((service: any) =>
          service.TrangThai === 'Đang hoạt động'
        );

        console.log('Active Services:', activeServices);

        // Gộp dữ liệu: mỗi loại dịch vụ có danh sách dịch vụ của nó
        const combinedData: Category[] = categoriesRes.data.map((category: any) => {
          const categoryServices = activeServices.filter((service: any) =>
            service.MaLoaiDV === category.MaLoaiDV
          );

          return {
            MaLoaiDichVu: category.MaLoaiDV,
            TenLoaiDichVu: category.TenLoaiDV,
            MoTa: category.MoTa,
            services: categoryServices
          };
        }).filter((category: Category) => category.services.length > 0); // Chỉ giữ loại có dịch vụ

        console.log('Combined Data:', combinedData);
        setPricingData(combinedData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu bảng giá:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (index: number) => {
    if (openCategories.includes(index)) {
      setOpenCategories(openCategories.filter((i) => i !== index));
    } else {
      setOpenCategories([...openCategories, index]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Đang tải bảng giá...</div>
        </div>
      </section>
    );
  }

  return (

    <section id="pricing" className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span>{'>'}</span>
          <span className="text-blue-600">Bảng giá</span>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Bảng Giá Chi Tiết
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bảng giá dưới đây là giá tham khảo. Chi phí cụ thể sẽ được bác sĩ tư vấn sau khi khám và đánh giá tình trạng răng miệng.
          </p>
        </div>

        <div className="space-y-4">
          {pricingData.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleCategory(index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-gray-900">{category.TenLoaiDichVu}</h3>
                  {category.MoTa && (
                    <span className="text-sm text-gray-500">({category.services.length} dịch vụ)</span>
                  )}
                </div>
                {openCategories.includes(index) ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {openCategories.includes(index) && (
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Dịch Vụ
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                            Giá Tham Khảo
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {category.services.map((service) => (
                          <tr
                            key={service.MaDichVu}
                            className="hover:bg-blue-50/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="text-gray-800 font-medium">{service.TenDichVu}</div>
                              {service.MoTa && (
                                <div className="text-sm text-gray-500 mt-1">{service.MoTa}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="font-semibold text-blue-600">{formatPrice(service.Gia)}</div>
                              {service.DonVi && (
                                <div className="text-sm text-gray-500 mt-1">/ {service.DonVi}</div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
