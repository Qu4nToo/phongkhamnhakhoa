"use client"
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const servicesData = [
  {
    id: 1,
    name: 'Trụ Implant Straumann BLT SLActive',
    category: 'Trồng răng Implant',
    priceRange: '28.000.000đ - 35.000.000đ',
    image: 'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50fGVufDF8fHx8MTc2NTM3MTQ1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 2,
    name: 'Trụ Implant Straumann BLT SLA',
    category: 'Trồng răng Implant',
    priceRange: '24.000.000đ - 27.000.000đ',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzY1MzcxNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: false
  },
  {
    id: 3,
    name: 'Implant Neodent Acqua',
    category: 'Trồng răng Implant',
    priceRange: '23.000.000đ - 27.000.000đ',
    image: 'https://images.unsplash.com/photo-1611690061822-b707a67bfebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwcGF0aWVudCUyMHNtaWxlfGVufDF8fHx8MTc2NTI2NDM0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 4,
    name: 'Implant Dentium Super Line/ NR line/ SlimLine',
    category: 'Trồng răng Implant',
    priceRange: '15.000.000đ - 17.000.000đ',
    image: 'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50fGVufDF8fHx8MTc2NTM3MTQ1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: false
  },
  {
    id: 5,
    name: 'Cấy ghép Implant trọn gói – Platinum Combo',
    category: 'Trồng răng Implant',
    priceRange: '16.000.000đ - 19.000.000đ',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzY1MzcxNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: false
  },
  {
    id: 6,
    name: 'Cấy ghép Implant trọn gói – Gold Combo',
    category: 'Trồng răng Implant',
    priceRange: '23.000.000đ - 33.000.000đ',
    image: 'https://images.unsplash.com/photo-1611690061822-b707a67bfebb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0JTIwcGF0aWVudCUyMHNtaWxlfGVufDF8fHx8MTc2NTI2NDM0NHww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 7,
    name: 'Cấy ghép Implant trọn gói – Silver Combo',
    category: 'Trồng răng Implant',
    priceRange: '10.000.000đ - 12.000.000đ',
    image: 'https://images.unsplash.com/photo-1593022356769-11f762e25ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBpbXBsYW50fGVufDF8fHx8MTc2NTM3MTQ1OXww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: false
  },
  {
    id: 8,
    name: 'Răng Sứ Zirconia Cao Cấp',
    category: 'Răng sứ thẩm mỹ',
    priceRange: '4.000.000đ - 6.000.000đ',
    image: 'https://images.unsplash.com/photo-1675516161546-1894798c71de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjcm93bnxlbnwxfHx8fDE3NjUzNTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: true
  },
  {
    id: 9,
    name: 'Răng Sứ Emax Thẩm Mỹ',
    category: 'Răng sứ thẩm mỹ',
    priceRange: '6.000.000đ - 8.000.000đ',
    image: 'https://images.unsplash.com/photo-1675516161546-1894798c71de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjcm93bnxlbnwxfHx8fDE3NjUzNTkyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 10,
    name: 'Niềng Răng Invisalign',
    category: 'Niềng răng - Chỉnh nha',
    priceRange: '80.000.000đ - 150.000.000đ',
    image: 'https://images.unsplash.com/photo-1598531228433-d9f0cb960816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcnRob2RvbnRpYyUyMGJyYWNlc3xlbnwxfHx8fDE3NjUzNzE0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: false
  },
  {
    id: 11,
    name: 'Niềng Răng Mắc Cài Kim Loại',
    category: 'Niềng răng - Chỉnh nha',
    priceRange: '25.000.000đ - 40.000.000đ',
    image: 'https://images.unsplash.com/photo-1598531228433-d9f0cb960816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcnRob2RvbnRpYyUyMGJyYWNlc3xlbnwxfHx8fDE3NjUzNzE0NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 12,
    name: 'Tẩy Trắng Răng Bleach Bright',
    category: 'Tẩy trắng răng',
    priceRange: '5.000.000đ - 8.000.000đ',
    image: 'https://images.unsplash.com/photo-1654373535457-383a0a4d00f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWV0aCUyMHdoaXRlbmluZ3xlbnwxfHx8fDE3NjUzNTI5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 13,
    name: 'Tẩy Trắng Răng Laser',
    category: 'Tẩy trắng răng',
    priceRange: '3.000.000đ - 5.000.000đ',
    image: 'https://images.unsplash.com/photo-1654373535457-383a0a4d00f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWV0aCUyMHdoaXRlbmluZ3xlbnwxfHx8fDE3NjUzNTI5OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: false
  },
  {
    id: 14,
    name: 'Khám Răng Trẻ Em',
    category: 'Nha khoa trẻ em',
    priceRange: '200.000đ - 500.000đ',
    image: 'https://images.unsplash.com/photo-1619236233405-bb5d430f0620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMGRlbnRpc3R8ZW58MXx8fHwxNzY1MzcxNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: true
  },
  {
    id: 15,
    name: 'Điều Trị Tủy Răng Hàm Lớn',
    category: 'Điều trị tủy - Nội nha',
    priceRange: '1.500.000đ - 2.500.000đ',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBoeWdpZW5lfGVufDF8fHx8MTc2NTI2ODI4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: false,
    bestseller: false
  },
  {
    id: 16,
    name: 'Cạo Vôi Răng Chuyên Sâu',
    category: 'Điều trị nha khoa tổng quát',
    priceRange: '300.000đ - 500.000đ',
    image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBoeWdpZW5lfGVufDF8fHx8MTc2NTI2ODI4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    featured: true,
    bestseller: true
  }
];

type FilterType = 'all' | 'featured' | 'bestseller' | 'price-high' | 'price-low';

interface ServicesGridProps {
  services?: any[];
  title?: string;
}

export function ServicesGrid({ services, title }: ServicesGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const dataToUse = services && services.length > 0 ? services : servicesData;

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
                <ImageWithFallback
                  src={service.HinhAnh || service.image}
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
