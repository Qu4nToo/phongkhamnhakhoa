"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const storedUserInfo = sessionStorage.getItem("user_info");

    if (!storedUserInfo) {
      toast.error("Bạn chưa đăng nhập");
      router.push("/Login");
      return;
    }

    const user = JSON.parse(storedUserInfo);
    const userRole = user?.nguoiDung?.VaiTro;

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
