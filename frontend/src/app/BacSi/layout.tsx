"use client";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/features/app-sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { isAuthenticatedDoctor, getCurrentDoctor } from "@/lib/auth";
import { useTokenRefresh } from "@/lib/tokenRefresh";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Enable automatic token refresh
  useTokenRefresh();

  useEffect(() => {
    if (!isAuthenticatedDoctor()) {
      toast.error("Bạn chưa đăng nhập");
      router.push("/DangNhap");
      return;
    }

    const user = getCurrentDoctor();
    
    if (!user) {
      toast.error("Token không hợp lệ");
      router.push("/DangNhap");
      return;
    }

    // Kiểm tra role
    if (user.role !== 'Bác sĩ') {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push("/");
      return;
    }

    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!socket) return;

    const storedUserInfo = sessionStorage.getItem("doctor_info");
    if (!storedUserInfo) return;

    const user = JSON.parse(storedUserInfo);

    socket.on('phieuKham:created', (data) => {
      console.log('Received phieuKham:created event:', data);
      
      if (data.maBacSi === user.MaBacSi) {
        toast.success('Có phiếu khám mới!', {
          description: `Khách hàng: ${data.phieuKham?.TenKhachHang || 'N/A'}`,
          duration: 5000,
        });
      }
    });

    socket.on('lichHen:created', (data) => {
      console.log('Received lichHen:created event:', data);
      
      if (data.maBacSi === user.MaBacSi) {
        toast.info('Có lịch hẹn mới!', {
          description: `${data.lichHen?.TenKhachHang || 'N/A'} - ${data.lichHen?.NgayHen} lúc ${data.lichHen?.GioHen}`,
          duration: 5000,
        });
      }
    });

    return () => {
      socket.off('phieuKham:created');
      socket.off('lichHen:created');
    };
  }, [socket]);

  // Nếu đang tải (isLoading), hiển thị một màn hình chờ
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-center text-gray-500">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <SidebarTrigger className="ml-2" />
          <Breadcrumb />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />
      <SocketProvider>
        <LayoutContent>{children}</LayoutContent>
      </SocketProvider>
    </>
  );
}
