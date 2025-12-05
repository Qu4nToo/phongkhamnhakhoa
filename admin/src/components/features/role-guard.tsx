"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser, isAuthenticated } from "@/lib/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = "/Dashboard" }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra token
    if (!isAuthenticated()) {
      toast.error("Bạn chưa đăng nhập");
      router.push("/Login");
      return;
    }

    // Giải mã token để lấy role
    const user = getCurrentUser();
    
    if (!user) {
      toast.error("Token không hợp lệ");
      router.push("/Login");
      return;
    }

    const userRole = user.role;

    if (!allowedRoles.includes(userRole)) {
      toast.error("Bạn không có quyền truy cập trang này");
      router.push(redirectTo);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  }, [allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-500">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
