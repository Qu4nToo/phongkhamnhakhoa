"use client"
import { useState } from 'react';

type FilterType = 'all' | 'featured' | 'bestseller' | 'price-high' | 'price-low';

interface ServicesGridProps {
  services?: any[];
  title?: string;
}

export function ServicesGrid({ services, title }: ServicesGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const dataToUse = services && services.length > 0 ? services : [];

  const getFilteredServices = () => {
    let filtered = [...dataToUse];
    
    switch (activeFilter) {
      case 'price-high':
        // Giá cao xuống thấp
        filtered = filtered.sort((a, b) => {
          const priceA = parseInt(a.Gia);
          const priceB = parseInt(b.Gia);
          return priceB - priceA;
        });
        break;
      case 'price-low':
        // Giá thấp lên cao
        filtered = filtered.sort((a, b) => {
          const priceA = parseInt(a.Gia);
          const priceB = parseInt(b.Gia);
          return priceA - priceB;
        });
        break;
    }
    
    return filtered;
  };

  const filteredServices = getFilteredServices();

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <span>{'>'}</span>
          <a href="#services" className="hover:text-blue-600">Dịch vụ</a>
          <span>{'>'}</span>
          <span className="text-gray-900">{title}</span>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-blue-600"></div>
            <h1 className="text-gray-900">{title}</h1>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveFilter('price-high')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeFilter === 'price-high'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Giá từ cao xuống thấp
          </button>
          <button
            onClick={() => setActiveFilter('price-low')}
            className={`px-6 py-2 rounded-lg transition-all ${
              activeFilter === 'price-low'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Giá từ thấp đến cao
          </button>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.MaDichVu || service.id}
              className="bg-white rounded-xl shadow-sm transition-shadow duration-300 overflow-hidden border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group">
                <img
                  src={service.AnhChinh || service.HinhAnh || service.image}
                  alt={service.TenDichVu || service.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-100">
                    {service.TenLoaiDV || service.category}
                  </span>
                </div>

                {/* Title */}
                <a 
                  href={`/ChiTietDichVu/${service.Slug || service.slug}`}
                  className="block"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
                    {service.TenDichVu || service.name}
                  </h3>
                </a>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl font-bold text-blue-600">
                    {service.Gia 
                      ? `${parseInt(service.Gia).toLocaleString('vi-VN')}đ`
                      : service.priceRange
                    }
                  </p>
                </div>

                {/* Action Button */}
                <a 
                  href={`/ChiTietDichVu/${service.Slug}`}
                  className="block w-full py-2.5 px-4 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200 hover:shadow-lg text-center"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-600">
          Hiển thị {filteredServices.length} dịch vụ
        </div>
      </div>
    </section>
  );
}
