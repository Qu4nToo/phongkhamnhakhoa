import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function AboutHero() {
  return (
    <section className="relative h-[400px] bg-gradient-to-r from-blue-900 to-blue-700">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1704455306925-1401c3012117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50YWwlMjBjbGluaWMlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjUxMjMyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Nha khoa hiện đại"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white">
          <h1 className="text-white mb-4">
            Về Chúng Tôi
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl">
            Nha Khoa Nụ Cười - Đơn vị tiên phong trong lĩnh vực chăm sóc và điều trị răng miệng tại Việt Nam
          </p>
        </div>
      </div>
    </section>
  );
}
