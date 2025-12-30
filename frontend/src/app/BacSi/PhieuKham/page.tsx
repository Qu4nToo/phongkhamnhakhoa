"use client"
import { useEffect, useState } from "react"
import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    MoreHorizontal,
    UserIcon,
    PlusCircle,
    Trash2,
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
    AlertDialogContent,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from "@/lib/axiosDoctor"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
export default function phieuKhamView() {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [phieuKhams, setPhieuKhams] = useState<any[]>([]);
    const [phieuKham, setPhieuKham] = useState<any>([]);
    const [chitietphieukhams, setChiTietphieukhams] = useState<any>([]);
    const [showAlertView, setShowAlertView] = useState(false);
    const [tongtien, setTongtien] = useState<number>();
    const [editedChuanDoan, setEditedChuanDoan] = useState("");
    const [editedGhiChu, setEditedGhiChu] = useState("");
    const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
    const [dichVuList, setDichVuList] = useState<any[]>([]);
    const [selectedDichVu, setSelectedDichVu] = useState("");
    const [soLuong, setSoLuong] = useState(1);
    const [tempServices, setTempServices] = useState<any[]>([]);


    const formatPrice = (price: number): string => {
        if (price === null || price === undefined || isNaN(price)) {
            return "0 VND";
        }

        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        });

        return formatter.format(price).replace('₫', 'VND').trim();
    };

    const loadPhieuKhams = () => {
        const storedUserInfo = sessionStorage.getItem("doctor_info");
        if (storedUserInfo) {
            const user = JSON.parse(storedUserInfo);
            setUserInfo(user);
            axios.get(`http://localhost:5000/api/phieu-kham/getByBacSiID/${user.MaBacSi}`)
                .then(response => {
                    console.log("Response data:", response.data);
                    if (Array.isArray(response.data)) {
                        const filteredData = response.data.filter((pk: any) =>
                            pk.TrangThai === "Chưa khám" || pk.TrangThai === null || pk.TrangThai === ""
                        );
                        setPhieuKhams(filteredData);
                    } else {
                        console.error("Data is not an array:", response.data);
                        setPhieuKhams([]);
                    }
                })
                .catch(err => {
                    console.error("Error fetching phieu kham:", err);
                    setPhieuKhams([]);
                })
        }
    };

    useEffect(() => {
        loadPhieuKhams();
    }, []);

    const handleViewClick = (phieuKham: any) => {
        setPhieuKham(phieuKham);
        setEditedChuanDoan(phieuKham.ChuanDoan || "");
        setEditedGhiChu(phieuKham.GhiChu || "");
        setTempServices([]);
        setShowAlertView(true);
    }
    const handleAddServiceDialog = () => {

        axios.get(`http://localhost:5000/api/dich-vu/getDichVuByBacSi/${userInfo.MaBacSi}`)
            .then(res => setDichVuList(res.data))
            .catch(err => console.log(err))
        setShowAddServiceDialog(true);
    }

    const handleSaveEdit = async () => {
        try {
            console.log("Saving phieu kham:", phieuKham.MaPhieuKham, editedChuanDoan, editedGhiChu);
            for (const service of tempServices) {
                console.log("Saving service:", service);
                await axios.post("http://localhost:5000/api/chi-tiet-phieu-kham/create", {
                    MaPhieuKham: phieuKham.MaPhieuKham,
                    MaDichVu: service.MaDichVu,
                    SoLuong: service.SoLuong,
                    ThanhTien: service.DonGia * service.SoLuong
                });
            }

            await axios.put(`http://localhost:5000/api/phieu-kham/update/${phieuKham.MaPhieuKham}`, {
                MaKhachHang: phieuKham.MaKhachHang,
                MaBacSi: phieuKham.MaBacSi,
                NgayKham: phieuKham.NgayKham,
                MaLichHen: phieuKham.MaLichHen,
                ChuanDoan: editedChuanDoan,
                GhiChu: editedGhiChu,
                TrangThai: "Đã khám"
            });

            if (phieuKham.MaLichHen) {
                const lichHenResponse = await axios.get(`http://localhost:5000/api/lich-hen/get/${phieuKham.MaLichHen}`);
                console.log("LichHen response:", lichHenResponse.data);
                const lichHen = lichHenResponse.data;
                if (lichHen) {
                    const updatedLichHen = {
                        NgayHen: lichHen.NgayHen,
                        GioHen: lichHen.GioHen,
                        TinhTrang: "Hoàn thành",
                        GhiChu: lichHen.GhiChu || ""
                    };
                    console.log("Updating lich hen with:", updatedLichHen);

                    await axios.put(`http://localhost:5000/api/lich-hen/update/${phieuKham.MaLichHen}`, updatedLichHen);
                }
            }            // Cập nhật state local
            setPhieuKham({
                ...phieuKham,
                ChuanDoan: editedChuanDoan,
                GhiChu: editedGhiChu
            });

            // Cập nhật danh sách
            const storedUserInfo = sessionStorage.getItem("doctor_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const response = await axios.get(`http://localhost:5000/api/phieu-kham/getByBacSiID/${user.MaBacSi}`);
                if (Array.isArray(response.data)) {
                    const filteredData = response.data.filter((pk: any) =>
                        pk.TrangThai === "Chưa khám" || pk.TrangThai === null || pk.TrangThai === ""
                    );
                    setPhieuKhams(filteredData);
                }
            }

            toast.success("Đã hoàn tất phiếu khám!");
            setShowAlertView(false);
        } catch (error) {
            console.error("Error updating phieu kham:", error);
            toast.error("Có lỗi xảy ra khi cập nhật!");
        }
    }

    const handleAddService = () => {
        if (!selectedDichVu || soLuong < 1) {
            toast.error("Vui lòng chọn dịch vụ và nhập số lượng!");
            return;
        }

        const dichVu = dichVuList.find(dv => dv.MaDichVu === selectedDichVu);
        if (!dichVu) return;

        // Thêm vào mảng tạm
        const newService = {
            MaDichVu: selectedDichVu,
            TenDichVu: dichVu.TenDichVu,
            DonGia: dichVu.Gia,
            SoLuong: soLuong,
            isTemp: true
        };

        setTempServices([...tempServices, newService]);

        // Tính lại tổng tiền
        const tongCu = tongtien || 0;
        const tongMoi = tongCu + (dichVu.Gia * soLuong);
        setTongtien(tongMoi);

        // Reset form
        setSelectedDichVu("");
        setSoLuong(1);
        setShowAddServiceDialog(false);
        toast.success("Đã thêm dịch vụ vào danh sách!");
    }

    const handleDeleteService = (index: number) => {
        const deletedService = tempServices[index];

        // Trừ tổng tiền
        const tongMoi = (tongtien || 0) - (deletedService.DonGia * deletedService.SoLuong);
        setTongtien(tongMoi);

        // Xóa khỏi mảng
        const newTempServices = tempServices.filter((_, i) => i !== index);
        setTempServices(newTempServices);

        toast.success("Đã xóa dịch vụ!");
    }

    return (
        <>
            <title>phieuKham</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
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
                                        <TableHead>Giờ hẹn</TableHead>
                                        <TableHead>Ngày khám</TableHead>
                                        <TableHead>chuẩn đoán</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {phieuKhams.map((phieuKhams: any) => (
                                    <TableBody key={phieuKhams.MaPhieuKham}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {phieuKhams.TenKhachHang}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {phieuKhams.GioHen}
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
                                                        // onClick={() => handleToggleMenuClick(product)}
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="bg-white" align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleViewClick(phieuKhams)}>Hoàn tất phiếu khám</DropdownMenuItem>
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
                                <div className="flex justify-between items-center w-full">
                                    <p className="text-lg font-semibold leading-6 text-gray-800">
                                        Các Dịch Vụ Đã Thực Hiện
                                    </p>
                                    <Button
                                        size="sm"
                                        onClick={handleAddServiceDialog}
                                        // onClick={() => setShowAddServiceDialog(true)}
                                        className=" bg-black border-1 text-white flex items-center gap-2 hover:bg-gray-200 hover:text-black border-black"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Thêm dịch vụ
                                    </Button>
                                </div>
                                <ScrollArea className="h-60 w-full rounded-md border p-3 mt-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="sticky top-0 bg-gray-200 text-black">
                                                <TableHead>Tên Dịch Vụ</TableHead>
                                                <TableHead>Đơn Giá</TableHead>
                                                <TableHead>SL</TableHead>
                                                <TableHead>Thành Tiền</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {tempServices?.map((item: any, index: number) => (
                                                <TableRow key={`temp-${index}`} className="bg-white">
                                                    <TableCell className="font-medium">{item.TenDichVu}</TableCell>
                                                    <TableCell>{formatPrice(item.DonGia)}</TableCell>
                                                    <TableCell>{item.SoLuong}</TableCell>
                                                    <TableCell>{formatPrice(item.DonGia * item.SoLuong)}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteService(index)}
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
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
                                        <p className="text-base font-semibold leading-4 text-gray-800 mb-2">Chuẩn Đoán</p>
                                        <Input
                                            value={editedChuanDoan}
                                            onChange={(e) => setEditedChuanDoan(e.target.value)}
                                            placeholder="Nhập chuẩn đoán"
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-start items-start w-full">
                                        <p className="text-base font-semibold leading-4 text-gray-800 mb-2">Ghi Chú</p>
                                        <Textarea
                                            value={editedGhiChu}
                                            onChange={(e) => setEditedGhiChu(e.target.value)}
                                            placeholder="Nhập ghi chú"
                                            className="w-full min-h-[100px]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowAlertView(false)}>Đóng</Button>
                        <Button className="bg-black text-white border-1 hover:text-black hover:bg-white border-black" onClick={handleSaveEdit}>Lưu</Button>
                    </DialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Dialog thêm dịch vụ */}
            <Dialog open={showAddServiceDialog} onOpenChange={setShowAddServiceDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm Dịch Vụ</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Dịch Vụ</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={selectedDichVu}
                                onChange={(e) => setSelectedDichVu(e.target.value)}
                            >
                                <option value="">Chọn dịch vụ</option>
                                {dichVuList.map((dv: any) => (
                                    <option key={dv.MaDichVu} value={dv.MaDichVu}>
                                        {dv.TenDichVu} - {formatPrice(dv.Gia)} - {dv.DonVi}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Số Lượng</label>
                            <Input
                                type="number"
                                min="1"
                                value={soLuong}
                                onChange={(e) => setSoLuong(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowAddServiceDialog(false)}>
                            Hủy
                        </Button>
                        <Button className="bg-black text-white border-1 hover:text-black hover:bg-white border-black" onClick={handleAddService}>
                            Thêm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}