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
import { getCurrentUser, isAuthenticated } from "@/lib/auth";
import { useTokenRefresh } from "@/lib/tokenRefresh";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");

  // Enable automatic token refresh
  useTokenRefresh();

  useEffect(() => {
    // Kiểm tra token có tồn tại không
    if (!isAuthenticated()) {
      toast.error("Bạn chưa đăng nhập");
      router.push("/Login");
      return;
    }

    // Giải mã token để lấy thông tin user
    const user = getCurrentUser();
    
    if (!user) {
      toast.error("Token không hợp lệ");
      router.push("/Login");
      return;
    }

    setUserRole(user.role);
    setIsLoading(false);
  }, [router]);

  // Lắng nghe Socket.IO events cho admin
  useEffect(() => {
    if (!socket) return;

    // Lắng nghe khi có phiếu khám mới được tạo
    socket.on('phieuKham:created', (data) => {
      console.log('Admin received phieuKham:created event:', data);
      toast.success('Có phiếu khám mới!', {
        description: `Bác sĩ ${data.phieuKham?.TenBacSi || 'N/A'} - Khách hàng: ${data.phieuKham?.TenKhachHang || 'N/A'}`,
        duration: 5000,
        descriptionClassName: 'font-bold'
      });
    });

    // Lắng nghe khi phiếu khám được hoàn thành
    socket.on('phieuKham:completed', (data) => {
      console.log('Admin received phieuKham:completed event:', data);
      toast.success('Phiếu khám đã hoàn thành!', {
        description: `Bác sĩ ${data.phieuKham?.TenBacSi || 'N/A'} - Khách hàng: ${data.phieuKham?.TenKhachHang || 'N/A'}`,
        duration: 5000,
        descriptionClassName: 'font-bold'
      });
    });

    // Lắng nghe khi có lịch hẹn mới
    socket.on('lichHen:created', (data) => {
      console.log('Admin received lichHen:created event:', data);
      toast.info('Có lịch hẹn mới!', {
        description: `${data.lichHen?.TenKhachHang || 'N/A'} - ${data.lichHen?.NgayHen} lúc ${data.lichHen?.GioHen}`,
        duration: 5000,
        descriptionClassName: 'font-bold'
      });
    });

    socket.on('lichHen:cancelled', (data) => {
      console.log('Admin received lichHen:cancelled event:', data);
      toast.error(data.message);
    });

    // Cleanup khi component unmount
    return () => {
      socket.off('phieuKham:created');
      socket.off('phieuKham:completed');
      socket.off('lichHen:created');
      socket.off('lichHen:cancelled');
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
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="ml-2" />
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
