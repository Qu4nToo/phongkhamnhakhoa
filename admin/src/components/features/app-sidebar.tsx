import {
  Calendar,
  ChevronUp,
  Home,
  ChartPie,
  User,
  User2,
  UserPen,
  UserStar,
  BookPlusIcon,
  Receipt,
  ReceiptText,
  Book,
} from "lucide-react";
import { getCurrentUser, logout } from "@/lib/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useEffect, useState } from "react";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/Dashboard",
    icon: ChartPie,
    roles: ["Quản lý", "Lễ tân"], // Tất cả role đều truy cập được
  },
  {
    title: "Khách hàng",
    url: "/KhachHang",
    icon: User,
    roles: ["Quản lý"], // Chỉ Quản lý
  },
  {
    title: "Bác sĩ",
    url: "/BacSi",
    icon: UserPen,
    roles: ["Quản lý"], // Chỉ Quản lý
  },
  {
    title: "Người dùng",
    url: "/NguoiDung",
    icon: UserStar,
    roles: ["Quản lý"], // Chỉ Quản lý
  },
  {
    title: "Lịch hẹn",
    url: "/LichHen",
    icon: Calendar,
    roles: ["Quản lý", "Lễ tân"], // Cả hai role
  },
  {
    title: "Phiếu khám",
    url: "/PhieuKham",
    icon: ReceiptText,
    roles: ["Quản lý", "Lễ tân"], // Cả hai role
  },
  {
    title: "Dịch vụ",
    url: "/DichVu",
    icon: BookPlusIcon,
    roles: ["Quản lý", "Lễ tân"], // Cả hai role
  },
  {
    title: "Hóa đơn",
    url: "/HoaDon",
    icon: Receipt,
    roles: ["Quản lý", "Lễ tân"], // Cả hai role
  },
  {
    title: "Loại dịch vụ",
    url: "/LoaiDichVu",
    icon: Book,
    roles: ["Quản lý", "Lễ tân"], // Cả hai role
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    // Giải mã token để lấy thông tin user
    const user = getCurrentUser();
    if (user) {
      setUserInfo(user);
      setUserRole(user.role || "");
    }
  }, []);

  const handleSignOut = () => {
    logout();
  };

  // Lọc menu items dựa trên role của user
  const filteredItems = items.filter((item) => 
    item.roles.includes(userRole)
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row px-2 py-4">
        <img src="/logo.png" alt="Test Logo" width="40" height="40" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Nha khoa Hoàng Quân</span>
          <span className="truncate text-xs">{userRole || "Quản Trị Viên"}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {userInfo?.hoTen || "User"}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span className="font-medium">{userInfo?.hoTen}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-xs text-gray-500">{userInfo?.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
