import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Image src="/logo.png" alt="Nha Khoa Nụ Cười Logo" width={40} height={40} />
              </div>
              <span className="ml-3">Nha Khoa Hoàng Quân</span>
            </div>
            <p className="text-gray-400">
              Tạo nên nụ cười khỏe đẹp cho cộng đồng hơn 15 năm qua.
            </p>
          </div>

          <div>
            <h3 className="mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Trang Chủ
                </a>
              </li>
              <li>
                <a href="/DichVu/nha-khoa-tong-quat" className="text-gray-400 hover:text-white transition-colors">
                  Dịch Vụ
                </a>
              </li>
              <li>
                <a href="/GioiThieu" className="text-gray-400 hover:text-white transition-colors">
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a href="/BangGia" className="text-gray-400 hover:text-white transition-colors">
                  Bảng giá
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Dịch Vụ</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Vệ Sinh Răng Miệng</li>
              <li>Tẩy Trắng Răng</li>
              <li>Cấy Ghép Implant</li>
              <li>Chỉnh Nha</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4">Kết Nối Với Chúng Tôi</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
            <p className="text-gray-400">
              Theo dõi để nhận mẹo chăm sóc răng và nụ cười đẹp.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Nha Khoa Hoàng Quân.</p>
        </div>
      </div>
    </footer>
  );
}