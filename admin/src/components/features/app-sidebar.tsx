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
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo(user);
      setUserRole(user?.nguoiDung?.VaiTro || "");
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("user_info");
    globalThis.location.reload();
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
                  <User2 /> {userInfo?.nguoiDung.HoTen}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span className="font-medium">{userInfo?.nguoiDung.HoTen}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
