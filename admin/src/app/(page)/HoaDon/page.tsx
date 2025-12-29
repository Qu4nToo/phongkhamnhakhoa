"use client"
import { useEffect, useState } from "react"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    MoreHorizontal,
    PlusCircle,
    UserIcon,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from "@/lib/axios"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
export default function hoaDonView() {
    const [hoaDons, setHoaDons] = useState([]);
    const [hoaDon, setHoaDon] = useState<any>([]);
    const [chitiethoadons, setChiTietHoaDons] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertView, setShowAlertView] = useState(false);
    const [showAlertUpdateStatus, setShowAlertUpdateStatus] = useState(false);
    const [selectedhoaDon, setSelectedhoaDon] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [tongtien, setTongtien] = useState<number>();
    const [selectedStatus, setSelectedStatus] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");


    const TRANG_THAI = [
        { value: "Chưa thanh toán", label: "Chưa thanh toán" },
        { value: "Đã thanh toán", label: "Đã thanh toán" },
        { value: "Đã hủy", label: "Đã hủy" },
    ];

    const formatPrice = (price: number): string => {
        // Kiểm tra giá trị đầu vào
        if (isNaN(price)) {
            throw new Error("Giá trị không hợp lệ");
        }

        // Định dạng giá sử dụng Intl.NumberFormat
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0, // Không có phần thập phân
        });

        // Loại bỏ ký hiệu "₫" mặc định
        return formatter.format(price).replace('₫', 'VND').trim();
    };

    // Hàm load danh sách hóa đơn
    const loadHoaDons = () => {
        axios.get("http://localhost:5000/api/hoa-don/get")
            .then(hoaDons => setHoaDons(hoaDons.data))
            .catch(err => console.log(err))
    };

    useEffect(() => {
        loadHoaDons();
    }, []);
    const handleDeleteClick = (hoaDon: React.SetStateAction<null>) => {
        console.log(hoaDon);
        setSelectedhoaDon(hoaDon);
        setShowAlert(true);
    }
    const handleUpdateStatusClick = (hoaDon: any) => {
        setSelectedhoaDon(hoaDon);
        setSelectedStatus(hoaDon.TrangThai);
        setShowAlertUpdateStatus(true);
    }

    const handleConfirmUpdateStatus = async () => {
        if (selectedhoaDon && selectedStatus) {
            try {
                await axios.put(`http://localhost:5000/api/hoa-don/update/${selectedhoaDon.MaHoaDon}`, {
                    MaPhieuKham: selectedhoaDon.MaPhieuKham,
                    MaKhachHang: selectedhoaDon.MaKhachHang,
                    MaNguoiDung: selectedhoaDon.MaNguoiDung,
                    NgayThanhToan: new Date().toISOString().split('T')[0],
                    TongTien: selectedhoaDon.TongTien,
                    PhuongThuc: selectedhoaDon.PhuongThuc,
                    TrangThai: selectedStatus,
                });
                toast.success("Cập nhật trạng thái thành công!");
                axios.get("http://localhost:5000/api/hoa-don/get")
                    .then((response) => setHoaDons(response.data))
                    .catch((err) => console.error("Error fetching hoaDons:", err));
                setShowAlertUpdateStatus(false);
            } catch (error) {
                console.error("Error updating status:", error);
                toast.error("Lỗi khi cập nhật trạng thái!");
            }
        }
    }

    const handleViewClick = (hoaDon: any) => {
        setHoaDon(hoaDon);
        axios.get("http://localhost:5000/api/chi-tiet-phieu-kham/getByPhieuKhamID/" + hoaDon.MaPhieuKham)
            .then(chitiethoadons => {
                setChiTietHoaDons(chitiethoadons.data)
                if (chitiethoadons.data && chitiethoadons.data.length > 0) {
                    const tong = chitiethoadons.data.reduce((acc: number, item: { DonGia: number; SoLuong: number; }) => acc + (item.DonGia * item.SoLuong), 0);
                    setTongtien(tong);
                }
                else {
                    setTongtien(0);
                }
                console.log(chitiethoadons.data);
            })
            .catch(err => console.log(err))


        setShowAlertView(true);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedhoaDon(null);
    }

    const handleConfirmDelete = () => {

        if (selectedhoaDon) {
            axios.delete(`http://localhost:5000/api/hoa-don/delete/${selectedhoaDon.MaHoaDon}`)
                .then(() => {
                    toast.success("Xóa hóa đơn thành công!");
                    axios.get("http://localhost:5000/api/hoa-don/get")
                        .then((response) => setHoaDons(response.data))
                        .catch((err) => console.error("Error fetching hoaDons:", err));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting hoaDon:", err);
                    toast.error("Có lỗi xảy ra khi xóa hóa đơn!");
                });
        }
    };

    // Lọc hóa đơn theo trạng thái
    const filteredHoaDons = hoaDons.filter((hoaDon: any) => {
        if (filterStatus === "all") return true;
        if (filterStatus === "paid") return hoaDon.TrangThai === "Đã thanh toán";
        if (filterStatus === "unpaid") return hoaDon.TrangThai === "Chưa thanh toán";
        return true;
    });

    return (
        <>
            <title>Quản Lý Hóa Đơn</title>
            <Tabs defaultValue="all" onValueChange={setFilterStatus}>
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
                        <TabsTrigger value="unpaid">Chưa thanh toán</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách hóa đơn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khách hàng</TableHead>
                                        <TableHead>Ngày Tạo</TableHead>
                                        <TableHead>Ngày Thanh Toán</TableHead>
                                        <TableHead>Tổng tiền</TableHead>
                                        <TableHead>Phương thức</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {filteredHoaDons.map((hoaDons: any) => (
                                    <TableBody key={hoaDons.MaHoaDon}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {hoaDons.HoTen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayTao || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayThanhToan || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatPrice(hoaDons.TongTien)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.PhuongThuc}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.TrangThai}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        // onClick={() => handleToggleMenuClick(product)}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(hoaDons)}>Xem chi tiết</DropdownMenuItem>
                                                        {hoaDons.TrangThai !== "Đã thanh toán" && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatusClick(hoaDons)}>Cập nhật trạng thái</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="paid">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách hóa đơn đã thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khách hàng</TableHead>
                                        <TableHead>Ngày Tạo</TableHead>
                                        <TableHead>Ngày Thanh Toán</TableHead>
                                        <TableHead>Tổng tiền</TableHead>
                                        <TableHead>Phương thức</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {filteredHoaDons.map((hoaDons: any) => (
                                    <TableBody key={hoaDons.MaHoaDon}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {hoaDons.HoTen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayTao || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayThanhToan || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatPrice(hoaDons.TongTien)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.PhuongThuc}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.TrangThai}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(hoaDons)}>Xem chi tiết</DropdownMenuItem>
                                                        {hoaDons.TrangThai !== "Đã thanh toán" && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatusClick(hoaDons)}>Cập nhật trạng thái</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="unpaid">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách hóa đơn chưa thanh toán</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khách hàng</TableHead>
                                        <TableHead>Ngày Tạo</TableHead>
                                        <TableHead>Ngày Thanh Toán</TableHead>
                                        <TableHead>Tổng tiền</TableHead>
                                        <TableHead>Phương thức</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {filteredHoaDons.map((hoaDons: any) => (
                                    <TableBody key={hoaDons.MaHoaDon}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {hoaDons.HoTen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayTao || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.NgayThanhToan || "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatPrice(hoaDons.TongTien)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.PhuongThuc}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {hoaDons.TrangThai}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            aria-haspopup="true"
                                                            size="icon"
                                                            variant="ghost"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(hoaDons)}>Xem chi tiết</DropdownMenuItem>
                                                        {hoaDons.TrangThai !== "Đã thanh toán" && (
                                                            <DropdownMenuItem onClick={() => handleUpdateStatusClick(hoaDons)}>Cập nhật trạng thái</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác Nhận Xóa Hóa Đơn</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa hóa đơn này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertClose}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showAlertView} onOpenChange={setShowAlertView}>
                <AlertDialogContent className="max-w-sm md:max-w-5xl">

                    {/* === PHẦN TIÊU ĐỀ (HEADER) === */}
                    <AlertDialogTitle>
                        <div className="flex justify-between items-start">
                            <div className="flex justify-start item-start space-y-1 flex-col ">
                                {/* FIX 2: Font Responsive */}
                                <h1 className="text-2xl md:text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
                                    Hóa Đơn
                                </h1>
                                <p className="text-base font-medium leading-6 text-gray-600">
                                    Ngày Tạo: {hoaDon.NgayTao || "Chưa có"}
                                </p>
                                <p className="text-base font-medium leading-6 text-gray-600">
                                    Ngày Thanh Toán: {hoaDon.NgayThanhToan || "Chưa có"}
                                </p>
                            </div>
                            {/* LÀM ĐẸP 1: Thêm "Trạng Thái" cho nó xịn! */}
                            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                {hoaDon.TrangThai}
                            </span>
                        </div>
                    </AlertDialogTitle>

                    {/* LÀM ĐẸP 2: Dùng "grid" 3 cột cho bố cục
          (col-span-2 cho nội dung, col-span-1 cho sidebar)
        */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* --- CỘT BÊN TRÁI (MAIN - 2/3) --- */}
                        <div className="md:col-span-2 flex flex-col gap-6">
                            {/* FIX 3: Padding Responsive */}
                            <div className="flex flex-col justify-start items-start bg-gray-50 p-4 md:p-6 w-full rounded-lg">
                                {/* FIX 2: Font Responsive */}
                                <p className="text-base md:text-lg font-semibold leading-6 text-gray-800">
                                    Các Dịch Vụ Đã Thực Hiện
                                </p>

                                {/* FIX 4: SỬA LỖI HYDRATION (ScrollArea bọc Table) */}
                                <ScrollArea className="h-72 w-full rounded-md border mt-3">
                                    <Table className="relative">
                                        <TableHeader>
                                            <TableRow className="sticky top-0 bg-gray-200 text-black hover:bg-gray-200">
                                                <TableHead>Tên Dịch Vụ</TableHead>
                                                <TableHead>Đơn Giá</TableHead>
                                                <TableHead>SL</TableHead>
                                                <TableHead>Thành Tiền</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {chitiethoadons?.map((item: any) => (
                                                <TableRow key={item.MaCTPK} className="bg-white">
                                                    <TableCell className="font-medium">{item.TenDichVu}</TableCell>
                                                    <TableCell>{formatPrice(item.DonGia)}</TableCell>
                                                    <TableCell>{item.SoLuong}</TableCell>
                                                    <TableCell>{formatPrice(item.DonGia * item.SoLuong)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </div>
                        </div>

                        {/* --- CỘT BÊN PHẢI (SIDEBAR - 1/3) --- */}
                        {/* Gom tất cả thông tin phụ vào đây */}
                        <div className="md:col-span-1 flex flex-col gap-6">

                            {/* Khối Khách Hàng */}
                            <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                                {/* FIX 2: Font Responsive */}
                                <h3 className="text-lg md:text-xl font-semibold leading-5 text-gray-800">Khách hàng</h3>
                                <div className="flex flex-col justify-start items-start mt-4 space-y-4">
                                    <div className="flex justify-start items-center space-x-4 w-full border-b border-gray-200 pb-4">
                                        <UserIcon className="w-6 h-6 text-gray-500" />
                                        <p className="text-base font-semibold leading-4 text-gray-800">
                                            {hoaDon.HoTen || "Không rõ"}
                                        </p>
                                    </div>
                                    {/* LÀM ĐẸP 3: Thêm SĐT/Email (nếu có) */}
                                    <div className="flex justify-start items-center space-x-4 w-full">
                                        <p className="text-sm leading-5 text-gray-600">
                                            {hoaDon.SoDienThoai || "Không có SĐT"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* LÀM ĐẸP 4: Gom "Thanh Toán" vào Sidebar */}
                            <div className="flex flex-col p-4 md:p-6 w-full bg-gray-50 space-y-4 rounded-lg">
                                <h3 className="text-lg md:text-xl font-semibold leading-5 text-gray-800">Thanh Toán</h3>
                                <div className="flex justify-between items-center w-full border-t border-gray-200 pt-4">
                                    <p className="text-base text-gray-600">Phương thức</p>
                                    <p className="text-base font-medium text-gray-900">
                                        {hoaDon.PhuongThuc}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center w-full border-t border-gray-200 pt-4">
                                    <p className="text-lg font-semibold text-gray-800">Tổng Cộng</p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {formatPrice(tongtien || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* LÀM ĐẸP 5: Thêm Footer cho chuẩn bài Dialog */}
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setShowAlertView(false)}>Đóng</Button>
                        <Button>
                            In Hóa Đơn
                        </Button>
                    </DialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showAlertUpdateStatus} onOpenChange={setShowAlertUpdateStatus}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cập nhật trạng thái thanh toán</AlertDialogTitle>
                        <AlertDialogDescription>
                            Chọn trạng thái thanh toán mới cho hóa đơn này.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                                Trạng thái
                            </Label>
                            <select
                                id="status"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="col-span-3 border rounded px-3 py-2"
                            >
                                {TRANG_THAI.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowAlertUpdateStatus(false)}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmUpdateStatus}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Toaster />
        </>
    )
}