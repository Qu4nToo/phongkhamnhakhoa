import { ArrowRight, Phone, Calendar, MapPin, Facebook } from 'lucide-react';

export function FloatingContact() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-0 z-50 shadow-lg">
      <button className="bg-green-500 hover:bg-green-600 text-white p-3 transition-colors flex items-center justify-center">
        <ArrowRight className="w-5 h-5" />
      </button>
      <button className="bg-gray-700 hover:bg-gray-800 text-white p-3 transition-colors flex items-center justify-center">
        <Phone className="w-5 h-5" />
      </button>
      <button className="bg-gray-600 hover:bg-gray-700 text-white p-3 transition-colors flex items-center justify-center">
        <Calendar className="w-5 h-5" />
      </button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white p-3 transition-colors flex items-center justify-center">
        <MapPin className="w-5 h-5" />
      </button>
      <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 transition-colors flex items-center justify-center">
        <Facebook className="w-5 h-5" />
      </button>
    </div>
  );
}