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

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoading để kiểm tra xem có cần tải không

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("bacsi_info");

    if (!storedUserInfo) {
      alert("Bạn chưa đăng nhập");
      router.push("/DangNhap");
    } else {
      const user = JSON.parse(storedUserInfo);
      console.log("User info from sessionStorage:", user);
      if (user.bacSi.VaiTro !== 'Bác sĩ') {
        toast.error("Bạn không có quyền truy cập trang này");
        router.push("/");
      } else {
        setIsLoading(false);
      }
    }
  }, [router]);

  // Nếu đang tải (isLoading), hiển thị một màn hình chờ
  if (isLoading) {
    return (
      <><Toaster /><div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl text-center text-gray-500">Đang kiểm tra quyền truy cập...</div>
      </div></>
    );
  }
  return (
    <>
      <Toaster />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <SidebarTrigger className="ml-2" />
            <Breadcrumb />
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
        </SidebarInset>
      </SidebarProvider></>
  );
}
