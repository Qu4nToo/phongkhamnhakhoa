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
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import { useTokenRefresh } from "@/lib/tokenRefresh";
import { SocketProvider, useSocket } from "@/contexts/SocketContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { socket } = useSocket();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Enable automatic token refresh
  useTokenRefresh();

  useEffect(() => {
    // Kiểm tra token có tồn tại không
    if (!isAuthenticated()) {
      toast.error("Bạn chưa đăng nhập");
      router.push("/DangNhap");
      return;
    }

    // Giải mã token để lấy thông tin user
    const user = getCurrentUser();
    
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

  // Lắng nghe Socket.IO events cho tất cả các trang
  useEffect(() => {
    if (!socket) return;

    const storedUserInfo = sessionStorage.getItem("user_info");
    if (!storedUserInfo) return;

    const user = JSON.parse(storedUserInfo);

    // Lắng nghe khi có phiếu khám mới được tạo cho bác sĩ này
    socket.on('phieuKham:created', (data) => {
      console.log('Received phieuKham:created event:', data);
      
      // Kiểm tra xem phiếu khám có dành cho bác sĩ này không
      if (data.maBacSi === user.MaBacSi) {
        toast.success('Có phiếu khám mới!', {
          description: `Khách hàng: ${data.phieuKham?.TenKhachHang || 'N/A'}`,
          duration: 5000,
        });
      }
    });

    // Lắng nghe khi có lịch hẹn mới được tạo cho bác sĩ này
    socket.on('lichHen:created', (data) => {
      console.log('Received lichHen:created event:', data);
      
      // Kiểm tra xem lịch hẹn có dành cho bác sĩ này không
      if (data.maBacSi === user.MaBacSi) {
        toast.info('Có lịch hẹn mới!', {
          description: `${data.lichHen?.TenKhachHang || 'N/A'} - ${data.lichHen?.NgayHen} lúc ${data.lichHen?.GioHen}`,
          duration: 5000,
        });
      }
    });

    // Cleanup khi component unmount
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
