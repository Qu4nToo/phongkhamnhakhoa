"use client"
import { useState, useEffect } from 'react';
import { CustomerInfo } from '@/components/features/CustomerInfo';
import { Appointments } from '@/components/features/Appointments';
import { MedicalRecords } from '@/components/features/MedicalRecords';
import { Invoices } from '@/components/features/Invoices';
import { User, Calendar, FileText, Receipt, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from "sonner";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";

export default function App() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('ThongTin');
  const { socket } = useSocket();
  
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['ThongTin', 'LichHen', 'PhieuKham', 'HoaDon'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else {
      setActiveTab('ThongTin');
    }
  }, [searchParams]);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (!storedUserInfo || !socket) return;

    const user = JSON.parse(storedUserInfo);

    const handleLichHenApproved = (data: any) => {
      console.log("✅ Received lichHen:approved event:", data);
      if (data.lichHen && data.lichHen.MaKhachHang === user.MaKhachHang) {
        const ngayHen = new Date(data.lichHen.NgayHen).toLocaleDateString('vi-VN');
        toast.success(` Lịch hẹn của bạn vào ngày ${ngayHen} lúc ${data.lichHen.GioHen} đã được xác nhận!`);
      }
    };

    const handleLichHenCancelled = (data: any) => {
      console.log("❌ Received lichHen:cancelled event:", data);
      if (data.lichHen && data.lichHen.MaKhachHang === user.MaKhachHang) {
        const ngayHen = new Date(data.lichHen.NgayHen).toLocaleDateString('vi-VN');
        toast.error(`Lịch hẹn của bạn vào ngày ${ngayHen} lúc ${data.lichHen.GioHen} đã bị hủy!`);
      }
    };

    socket.on('lichHen:approved', handleLichHenApproved);
    socket.on('lichHen:cancelled', handleLichHenCancelled);

    return () => {
      socket.off('lichHen:approved', handleLichHenApproved);
      socket.off('lichHen:cancelled', handleLichHenCancelled);
    };
  }, [socket]);



  const tabs = [
    { id: 'ThongTin', label: 'Thông Tin Khách Hàng', icon: User },
    { id: 'LichHen', label: 'Lịch Hẹn', icon: Calendar },
    { id: 'PhieuKham', label: 'Phiếu Khám', icon: FileText },
    { id: 'HoaDon', label: 'Hóa Đơn', icon: Receipt },
  ];

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Trang chủ</span>
                </Link>
                <div className="h-6 w-px bg-slate-300"></div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Nha Khoa Hoàng Quân</h1>
                  <p className="text-sm text-slate-600 mt-0.5">Quản lý thông tin cá nhân</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-4 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="min-h-[600px]">
            <div className={activeTab === 'ThongTin' ? 'block animate-in fade-in duration-200' : 'hidden'}>
              <CustomerInfo />
            </div>
            <div className={activeTab === 'LichHen' ? 'block animate-in fade-in duration-200' : 'hidden'}>
              <Appointments />
            </div>
            <div className={activeTab === 'PhieuKham' ? 'block animate-in fade-in duration-200' : 'hidden'}>
              <MedicalRecords />
            </div>
            <div className={activeTab === 'HoaDon' ? 'block animate-in fade-in duration-200' : 'hidden'}>
              <Invoices />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
