"use client"
import { useEffect, useState } from "react"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    MoreHorizontal,
    UserIcon,
} from "lucide-react"
import {
    DialogFooter,
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
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
export default function phieuKhamView() {
    const [phieuKhams, setPhieuKhams] = useState([]);
    const [phieuKham, setPhieuKham] = useState<any>([]);
    const [chitietphieukhams, setChiTietphieukhams] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertView, setShowAlertView] = useState(false);
    const [selectedphieuKham, setSelectedphieuKham] = useState<any>([]);
    const [tongtien, setTongtien] = useState<number>();
    const [searchTerm, setSearchTerm] = useState("");

    const TRANG_THAI = [
        { value: "Chưa khám", label: "Chưa khám" },
        { value: "Đã khám", label: "Đã khám" },
    ];


    const formatPrice = (price: any): string => {
        // Kiểm tra và chuyển đổi giá trị đầu vào
        const numPrice = Number(price);
        
        if (price === null || price === undefined || isNaN(numPrice)) {
            return "0 VND";
        }

        // Định dạng giá sử dụng Intl.NumberFormat
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0, // Không có phần thập phân
        });

        // Loại bỏ ký hiệu "₫" mặc định
        return formatter.format(numPrice).replace('₫', 'VND').trim();
    };
    useEffect(() => {
        axios.get("http://localhost:5000/api/phieu-kham/get")
            .then(phieuKhams => setPhieuKhams(phieuKhams.data))
            .catch(err => console.log(err))
    }, []);
    const handleDeleteClick = (phieuKham: React.SetStateAction<null>) => {
        console.log(phieuKham);
        setSelectedphieuKham(phieuKham);
        setShowAlert(true);
    }
    const handleViewClick = (phieuKham: any) => {
        setPhieuKham(phieuKham);
        axios.get("http://localhost:5000/api/chi-tiet-phieu-kham/getByPhieuKhamID/" + phieuKham.MaPhieuKham)
            .then(chitietphieukhams => {
                setChiTietphieukhams(chitietphieukhams.data)
                if (chitietphieukhams.data && chitietphieukhams.data.length > 0) {
                    const tong = chitietphieukhams.data.reduce((acc: number, item: { DonGia: number; SoLuong: number; }) => acc + (item.DonGia * item.SoLuong), 0);
                    setTongtien(tong);
                }
                else {
                    setTongtien(0);
                }
            })
            .catch(err => console.log(err))


        setShowAlertView(true);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedphieuKham(null);
    }

    const handleConfirmDelete = () => {

        if (selectedphieuKham) {
            axios.delete(`http://localhost:5000/api/phieu-kham/delete/${selectedphieuKham.MaPhieuKham}`)
                .then(() => {
                    toast("phieuKham Deleted: phieuKham has been deleted.");
                    axios.get("http://localhost:5000/api/phieu-kham/get")
                        .then((response) => setPhieuKhams(response.data))
                        .catch((err) => console.error("Error fetching phieuKhams:", err));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting phieuKham:", err);
                    toast("Delete Failed: There was an error deleting the phieuKham.");
                });
        }
    };
    return (
        <>
            <title>phieuKham</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        {TRANG_THAI.map((status) => (
                            <TabsTrigger key={status.value} value={status.value}>
                                {status.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Input
                            placeholder="Tìm theo tên khách hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách phiếu khám</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên khách hàng</TableHead>
                                        <TableHead>Tên bác sĩ</TableHead>
                                        <TableHead>Ngày khám</TableHead>
                                        <TableHead>chuẩn đoán</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                        <TableHead>Tình trạng</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {phieuKhams
                                    .filter((phieuKham: any) => 
                                        phieuKham.TenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((phieuKhams: any) => (
                                    <TableBody key={phieuKhams.MaPhieuKham}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {phieuKhams.TenKhachHang}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.TenBacSi}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.NgayKham}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.ChuanDoan ? phieuKhams.ChuanDoan : "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.GhiChu ? phieuKhams.GhiChu : "Chưa có"}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.TrangThai}
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
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(phieuKhams)}>Xem chi tiết</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(phieuKhams)}>Xóa</DropdownMenuItem>
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
                {TRANG_THAI.map((status) => (
                    <TabsContent key={status.value} value={status.value}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Danh sách phiếu khám - {status.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tên khách hàng</TableHead>
                                            <TableHead>Tên bác sĩ</TableHead>
                                            <TableHead>Ngày khám</TableHead>
                                            <TableHead>chuẩn đoán</TableHead>
                                            <TableHead>Ghi chú</TableHead>
                                            <TableHead>Tình trạng</TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {phieuKhams
                                        .filter((phieuKham: any) => 
                                            phieuKham.TrangThai === status.value &&
                                            phieuKham.TenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((phieuKhams: any) => (
                                            <TableBody key={phieuKhams.MaPhieuKham}>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.TenKhachHang}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.TenBacSi}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.NgayKham}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.ChuanDoan ? phieuKhams.ChuanDoan : "Chưa có"}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.GhiChu ? phieuKhams.GhiChu : "Chưa có"}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {phieuKhams.TrangThai}
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
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewClick(phieuKhams)}>Xem chi tiết</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDeleteClick(phieuKhams)}>Xóa</DropdownMenuItem>
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
                ))}
            </Tabs>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this phieuKham?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertClose}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showAlertView} onOpenChange={setShowAlertView} >
                <AlertDialogContent className="max-w-4xl">
                    <AlertDialogTitle>
                        <div className="flex justify-start item-start space-y-1 flex-col ">
                            <h1 className="text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
                                Phiếu Khám
                            </h1>
                            <p className="text-base font-medium leading-6 text-gray-600">
                                Ngày khám: {phieuKham.NgayKham}
                            </p>
                        </div>
                    </AlertDialogTitle>

                    <div className="mt-4 flex flex-col md:flex-row gap-8">

                        <div className="w-full md:w-2/3 flex flex-col gap-6">

                            <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 w-full">
                                <p className="text-lg font-semibold leading-6 text-gray-800">
                                    Các Dịch Vụ Đã Thực Hiện
                                </p>
                                <ScrollArea className="h-60 w-full rounded-md border p-3 mt-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="sticky top-0 bg-gray-200 text-black">
                                                <TableHead>Tên Dịch Vụ</TableHead>
                                                <TableHead>Đơn Giá</TableHead>
                                                <TableHead>SL</TableHead>
                                                <TableHead>Thành Tiền</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {chitietphieukhams?.map((item: any) => (
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

                            <div className="flex flex-col px-4 py-6 md:p-6 w-full bg-gray-50 space-y-6">
                                <div className="flex justify-between items-center w-full border-t border-gray-200 pt-4">
                                    <p className="text-base font-semibold leading-4 text-gray-800">Tổng Tiền</p>
                                    <p className="text-base font-semibold leading-4 text-gray-600">
                                        {formatPrice(tongtien || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-1/3 bg-gray-50 px-4 py-6 md:p-6 flex flex-col gap-6">

                            <div>
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">Khách hàng</h3>
                                <div className="flex flex-col justify-start items-start mt-4 space-y-4">
                                    <div className="flex justify-start items-center space-x-4 w-full border-b border-gray-200 pb-4">

                                        <UserIcon className="w-6 h-6" />
                                        <p className="text-base font-semibold leading-4 text-gray-800">
                                            {phieuKham.TenKhachHang || "Không rõ"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold leading-5 text-gray-800">Chi Tiết Khám</h3>
                                <div className="flex flex-col justify-start items-start mt-4 space-y-4">
                                    <div className="flex flex-col justify-start items-start w-full">
                                        <p className="text-base font-semibold leading-4 text-gray-800">Bác Sĩ Phụ Trách</p>
                                        <p className="text-sm leading-5 text-gray-600">
                                            {phieuKham.TenBacSi || "Không rõ"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-start items-start w-full">
                                        <p className="text-base font-semibold leading-4 text-gray-800">Chuẩn Đoán</p>
                                        <p className="text-sm leading-5 text-gray-600">
                                            {phieuKham.ChuanDoan}
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-start items-start w-full">
                                        <p className="text-base font-semibold leading-4 text-gray-800">Ghi Chú</p>
                                        <p className="text-sm leading-5 text-gray-600 whitespace-pre-wrap">
                                            {phieuKham.GhiChu || "Không có"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={() => setShowAlertView(false)}>Đóng</Button>
                    </DialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Toaster />
        </>
    )
}