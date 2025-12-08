import React from 'react';
import { DollarSign } from 'lucide-react';

export function PricingHero() {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-700 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <DollarSign className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-white mb-4">
          Bảng Giá Dịch Vụ
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
          Bảng giá niềng răng, trồng răng implant, bọc răng sứ và các dịch vụ nha khoa tại Nha Khoa Nụ Cười
        </p>
      </div>
    </section>
  );
}
