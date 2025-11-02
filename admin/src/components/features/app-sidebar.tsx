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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/Dashboard",
    icon: ChartPie,
  },
  {
    title: "Khách hàng",
    url: "/KhachHang",
    icon: User,
  },
      {
    title: "Bác sĩ",
    url: "/BacSi",
    icon: UserPen,
  },
        {
    title: "Người dùng",
    url: "/NguoiDung",
    icon: UserStar,
  },
  {
    title: "Lịch hẹn",
    url: "/LichHen",
    icon: Calendar,
  },
    {
    title: "Phiếu khám",
    url: "/PhieuKham",
    icon: ReceiptText,
  },
  {
    title: "Dịch vụ",
    url: "/DichVu",
    icon: BookPlusIcon,
  },
  {
    title: "Hóa đơn",
    url: "/HoaDon",
    icon: Receipt,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row px-2 py-4">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground" />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">ADMIN PAGE</span>
          <span className="truncate text-xs">Quản Trị Viên</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
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
