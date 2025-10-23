import {
  Home,
  Package,
  PackageOpen,
  ShoppingCart,
  Ticket,
  Users,
} from "lucide-react";

export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "Home",
    label: "Home",
    path: "/admin/dashboard",
    icon: <Home />,
  },
  {
    key: "KhachHang",
    label: "Khách Hàng",
    path: "/admin/user",
    icon: <Users />,
  },
  {
    key: "BacSi",
    label: "Bác Sĩ",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
  {
    key: "LichHen",
    label: "Lịch Hẹn",
    path: "/admin/category",
    icon: <Package />,
  },
  {
    key: "PhieuKham",
    label: "Phiếu Khám",
    path: "/admin/products",
    icon: <PackageOpen />,
  },
  {
    key: "DichVu",
    label: "Dịch Vụ",
    path: "/admin/coupon",
    icon: <Ticket />,
  },
  {
    key: "ChucVu",
    label: "Chức Vụ",
    path: "/admin/coupon",
    icon: <Ticket />,
  },
  {
    key: "NguoiDung",
    label: "Người Dùng",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
  {
    key: "DanhGia",
    label: "Đánh Giá",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
  {
    key: "HoaDon",
    label: "Hóa Đơn",
    path: "/admin/orders",
    icon: <ShoppingCart />,
  },
];
