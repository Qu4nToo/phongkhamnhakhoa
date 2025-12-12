"use client"
import { useEffect, useState } from "react"
import React from "react"
import {
    MoreHorizontal,
    PlusCircle,
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import axios from "@/lib/axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export default function BookingView() {
    const router = useRouter();
    const [bookings, setbookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState<any>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [dichVuList, setDichVuList] = useState([]);
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    const [filterDate, setFilterDate] = useState("");

    const [newbooking, setNewbooking] = useState({
        MaDichVu: "",
        GhiChu: "",
        NgayHen: "",
        GioHen: "",
    });

    const [availableDays, setAvailableDays] = useState<number[]>([]);

    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewbooking((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newbooking);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target;

        const { value } = e.target;
        setNewbooking((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newbooking);
    };

    useEffect(() => {
        axios.get("http://localhost:5000/api/khach-hang/get")
            .then(customers => setCustomers(customers.data))
            .catch(err => console.log(err))
        
        axios.get("http://localhost:5000/api/dich-vu/get")
            .then(res => setDichVuList(res.data))
            .catch(err => console.log(err))
        
        const storedUserInfo = sessionStorage.getItem("user_info");
        if (storedUserInfo) {

            const user = JSON.parse(storedUserInfo);
            axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${user.MaBacSi}`)
                .then(response => {
                    // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                    const filteredBookings = response.data.filter((booking: any) => 
                        booking.TinhTrang === "Đã xác nhận" || booking.TinhTrang === "Chờ xác nhận"
                    );
                    setbookings(filteredBookings);
                    setFilteredBookings(filteredBookings);
                })
                .catch(err => console.log(err))
            
            // Fetch lịch làm việc của bác sĩ
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${user.MaBacSi}`)
                .then(res => {
                    // Chuyển đổi thứ thành số (0=CN, 1=T2, ..., 6=T7)
                    const thuMap: Record<string, number> = {
                        "Chủ Nhật": 0,
                        "Thứ Hai": 1,
                        "Thứ Ba": 2,
                        "Thứ Tư": 3,
                        "Thứ Năm": 4,
                        "Thứ Sáu": 5,
                        "Thứ Bảy": 6,
                    };
                    const days = res.data.map((lv: any) => thuMap[lv.ThuTrongTuan?.trim()]);
                    setAvailableDays(days);
                })
                .catch(err => console.log(err));
        }
    }, []);

    // Fetch khung giờ động dựa trên dịch vụ, bác sĩ và ngày hẹn
    useEffect(() => {
        if (newbooking.MaDichVu && newbooking.NgayHen && doctors?.bacSi?.MaBacSi) {
            axios
                .get(`http://localhost:5000/api/lich-hen/available-slots`, {
                    params: {
                        bacSiId: doctors.bacSi.MaBacSi,
                        ngayHen: newbooking.NgayHen,
                        dichVuId: newbooking.MaDichVu,
                    },
                })
                .then((res) => {
                    setTimeSlots(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeSlots([]);
                });
        } else {
            setTimeSlots([]);
        }
    }, [newbooking.MaDichVu, newbooking.NgayHen, doctors]);

    // Auto-reset khi thay đổi dịch vụ
    useEffect(() => {
        if (newbooking.MaDichVu) {
            setNewbooking((prev) => ({
                ...prev,
                NgayHen: "",
                GioHen: "",
            }));
            setTimeSlots([]);
        }
    }, [newbooking.MaDichVu]);

    // Lọc lịch hẹn theo ngày
    useEffect(() => {
        if (filterDate) {
            const filtered = bookings.filter((booking: any) => 
                booking.NgayHen === filterDate
            );
            setFilteredBookings(filtered);
        } else {
            setFilteredBookings(bookings);
        }
    }, [filterDate, bookings]);

    const handleViewClick = (booking: any) => {
        setSelectedBooking(booking);
        setViewDialogOpen(true);
    };

    const handleCreatebooking = () => {
        console.log(newbooking);
        
        // Kiểm tra ngày hẹn có thuộc lịch làm việc không
        const selectedDate = new Date(newbooking.NgayHen);
        const dayOfWeek = selectedDate.getDay();
        if (!availableDays.includes(dayOfWeek)) {
            toast.error("Ngày hẹn không thuộc lịch làm việc của bác sĩ!", {
                action: {
                    label: "Đóng",
                    onClick: () => toast.dismiss(),
                },
                style: {
                    background: "#fef2f2",
                    color: "#dc2626",
                    borderRadius: "10px",
                    border: "1px solid #fca5a5",
                },
            });
            return;
        }
        
        const bookingToCreate = {
            ...newbooking,
            MaBacSi: doctors.bacSi.MaBacSi,
        };
        axios.post("http://localhost:5000/api/lich-hen/create", bookingToCreate)
            .then(() => {
                toast.success("Đặt lịch thành công!", {
                    action: {
                        label: "Đóng",
                        onClick: () => toast.dismiss(),
                    },
                    style: {
                        background: "#ecfdf5",
                        color: "#065f46",
                        borderRadius: "10px",
                        border: "1px solid #10b981",
                    },
                });
                // Reload lại danh sách lịch hẹn của bác sĩ
                axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${doctors.bacSi.MaBacSi}`)
                    .then((response) => {
                        // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                        const filteredBookings = response.data.filter((booking: any) => 
                            booking.TinhTrang === "Đã xác nhận"
                        );
                        setbookings(filteredBookings);
                    })
                    .catch((err) => console.error("Error fetching bookings:", err));
                
                // Reset form
                setNewbooking({
                    MaDichVu: "",
                    GhiChu: "",
                    NgayHen: "",
                    GioHen: "",
                });
                setTimeSlots([]);

                setDialogOpen(false);
            })
            .catch((error) => {
                console.error("Lỗi đặt lịch:", error);
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Lỗi không xác định!", {
                        action: {
                            label: "Đóng",
                            onClick: () => toast.dismiss(),
                        },
                        style: {
                            background: "#bf0407",
                            color: "#bf0407",
                            borderRadius: "10px",
                            border: "1px solid #10b981",
                        },
                    });
                } else {
                    toast.error("Lỗi không xác định!", {
                        action: {
                            label: "Đóng",
                            onClick: () => toast.dismiss(),
                        },
                        style: {
                            background: "#bf0407",
                            color: "#bf0407",
                            borderRadius: "10px",
                            border: "1px solid #10b981",
                        },
                    });
                }
            });
    };

    const handleCreatePhieuKhamClick = async (booking: any) => {
        const newPhieuKham = {
            MaLichHen: booking.MaLichHen,
            MaKhachHang: booking.MaKhachHang,
            MaBacSi: booking.MaBacSi,
            NgayKham: booking.NgayHen,
        };
        console.log("Dữ liệu phiếu khám mới:", newPhieuKham);
        try {
            const response = await axios.post(
                "http://localhost:5000/api/phieu-kham/create",
                newPhieuKham
            );

            console.log("Tạo phiếu khám thành công:", response.data);
            toast.success("Tạo phiếu khám thành công!", {
                action: {
                    label: "Đóng",
                    onClick: () => toast.dismiss(),
                },
                style: {
                    background: "#ecfdf5",
                    color: "#065f46",
                    borderRadius: "10px",
                    border: "1px solid #10b981",
                },
            });
            await axios.put(`http://localhost:5000/api/lich-hen/update/${booking.MaLichHen}`, {
                MaKhachHang: booking.MaKhachHang,
                MaBacSi: booking.MaBacSi,
                NgayHen: booking.NgayHen,
                GioHen: booking.GioHen,
                TinhTrang: "Đang khám",
                GhiChu: booking.GhiChu
            });
            
            console.log("Cập nhật trạng thái lịch hẹn thành công");
            
            // Reload danh sách lịch hẹn
            const storedUserInfo = sessionStorage.getItem("user_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const response = await axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${user.MaBacSi}`);
                // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                const filteredBookings = response.data.filter((booking: any) => 
                    booking.TinhTrang === "Đã xác nhận"
                );
                setbookings(filteredBookings);
                setFilteredBookings(filteredBookings);
            }
            router.push(`/BacSi/PhieuKham/`);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Lỗi không xác định!";
            toast.error(errorMessage, {
                action: {
                    label: "Đóng",
                    onClick: () => toast.dismiss(),
                },
                style: {
                    background: "#fef2f2", 
                    color: "#dc2626",
                    borderRadius: "10px",
                    border: "1px solid #fca5a5",
                },
            });
        }
    };

    return (
        <>
            <title>Lịch Hẹn - Bác Sĩ</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="w-auto"
                            placeholder="Lọc theo ngày"
                        />
                        {filterDate && (
                            <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setFilterDate("")}
                            >
                                Xóa lọc
                            </Button>
                        )}
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1 bg-black text-white hover:bg-white hover:text-black border border-black">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Hẹn tái khám
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Hẹn tái khám</DialogTitle>
                                    <DialogDescription>
                                        Tạo lịch hẹn tái khám cho bệnh nhân.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MaKhachHang" className="text-right col-span-2">
                                            Khách Hàng
                                        </Label>
                                        <select
                                            id="MaKhachHang"
                                            onChange={handleInputChange2}
                                            className="col-span-4"
                                        >
                                            <option value="">Chọn khách hàng</option>
                                            {customers.map((customer: any) => (
                                                <option key={customer.MaKhachHang} value={customer.MaKhachHang}>{customer.HoTen}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MaDichVu" className="text-right col-span-2">
                                            Dịch vụ
                                        </Label>
                                        <select
                                            id="MaDichVu"
                                            onChange={handleInputChange2}
                                            className="col-span-4"
                                            value={newbooking.MaDichVu}
                                        >
                                            <option value="">Chọn dịch vụ</option>
                                            {dichVuList.map((dichVu: any) => (
                                                <option key={dichVu.MaDichVu} value={dichVu.MaDichVu}>
                                                    {dichVu.TenDichVu} ({dichVu.ThoiLuong} phút)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="NgayHen" className="text-right col-span-2">
                                            Ngày hẹn
                                        </Label>
                                        <div className="col-span-4">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal",
                                                            !newbooking.NgayHen && "text-gray-500"
                                                        )}
                                                        disabled={!newbooking.MaDichVu}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {newbooking.NgayHen ? (
                                                            format(new Date(newbooking.NgayHen), "dd/MM/yyyy", { locale: vi })
                                                        ) : (
                                                            <span>{!newbooking.MaDichVu ? "Chọn dịch vụ trước" : "Chọn ngày hẹn"}</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                {newbooking.MaDichVu && (
                                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={newbooking.NgayHen ? new Date(newbooking.NgayHen) : undefined}
                                                            onSelect={(date) => {
                                                                if (!date) return;
                                                                setNewbooking((prev) => ({
                                                                    ...prev,
                                                                    NgayHen: date.toLocaleDateString("en-CA"),
                                                                }));
                                                            }}
                                                            disabled={(date) => {
                                                                const today = new Date();
                                                                today.setHours(0, 0, 0, 0);
                                                                const dayOfWeek = date.getDay();
                                                                return date < today || !availableDays.includes(dayOfWeek);
                                                            }}
                                                        />
                                                    </PopoverContent>
                                                )}
                                            </Popover>
                                            {availableDays.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Bác sĩ làm việc: {availableDays.map(day => 
                                                        ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][day]
                                                    ).join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="GioHen" className="text-right col-span-2">
                                            Giờ hẹn
                                        </Label>
                                        <select
                                            id="GioHen"
                                            onChange={handleInputChange2}
                                            className="col-span-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!newbooking.NgayHen || !newbooking.MaDichVu}
                                            value={newbooking.GioHen}
                                        >
                                            <option value="">
                                                {!newbooking.MaDichVu
                                                    ? "Chọn dịch vụ trước"
                                                    : !newbooking.NgayHen
                                                    ? "Chọn ngày hẹn trước"
                                                    : timeSlots.length === 0
                                                    ? "Đang tải..."
                                                    : "Chọn giờ hẹn"}
                                            </option>
                                            {timeSlots.map((slot) => (
                                                <option key={slot.value} value={slot.value} disabled={!slot.available}>
                                                    {slot.label} {!slot.available ? "❌ (Đã đặt)" : "✅"}
                                                </option>
                                            ))}
                                        </select>
                                        {timeSlots.length > 0 && timeSlots.every((slot) => !slot.available) && (
                                            <p className="col-span-6 text-sm text-red-500 text-center">
                                                ⚠️ Tất cả các khung giờ đã được đặt. Vui lòng chọn ngày khác.
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="GhiChu" className="text-right col-span-2">
                                            Ghi chú
                                        </Label>
                                        <Input onChange={handleInputChange} id="GhiChu" type="text" className="col-span-4" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button className="bg-black text-white hover:bg-white hover:text-black border-1" type="button" onClick={handleCreatebooking}>
                                        Confirm
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
                <TabsContent value="all">
                    <Card x-chunk="dashboard-06-chunk-0">
                        <CardHeader>
                            <CardTitle>Danh sách lich hẹn</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Ngày hẹn</TableHead>
                                        <TableHead>Giờ hẹn</TableHead>
                                        <TableHead>Tình trạng</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {filteredBookings.map((bookings: any) => (
                                    <TableBody key={bookings.MaLichHen}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {bookings.TenKhachHang}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {bookings.NgayHen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {bookings.GioHen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {bookings.TinhTrang}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {bookings.GhiChu}
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
                                                        <DropdownMenuItem onClick={() => handleViewClick(bookings)}>Xem chi tiết</DropdownMenuItem>
                                                        {bookings.TinhTrang == ""}
                                                        {bookings.TinhTrang === "Đã xác nhận" && (
                                                            <DropdownMenuItem onClick={() => handleCreatePhieuKhamClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
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

            {/* Dialog xem chi tiết */}
            <Dialog open={isViewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="font-semibold">Khách hàng:</div>
                                <div>{selectedBooking.TenKhachHang}</div>
                                
                                <div className="font-semibold">Số điện thoại:</div>
                                <div>{selectedBooking.SoDienThoai || "Chưa có"}</div>
                                
                                <div className="font-semibold">Dịch vụ:</div>
                                <div>{selectedBooking.TenDichVu || "Chưa xác định"}</div>
                                
                                <div className="font-semibold">Ngày hẹn:</div>
                                <div>{new Date(selectedBooking.NgayHen).toLocaleDateString("vi-VN")}</div>
                                
                                <div className="font-semibold">Giờ hẹn:</div>
                                <div>{selectedBooking.GioHen}</div>
                                
                                <div className="font-semibold">Trạng thái:</div>
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        selectedBooking.TinhTrang === "Đã xác nhận" ? "bg-blue-100 text-blue-700" :
                                        selectedBooking.TinhTrang === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-700" :
                                        selectedBooking.TinhTrang === "Đang khám" ? "bg-green-100 text-green-700" :
                                        selectedBooking.TinhTrang === "Hoàn thành" ? "bg-gray-100 text-gray-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {selectedBooking.TinhTrang}
                                    </span>
                                </div>
                                
                                <div className="font-semibold">Ghi chú:</div>
                                <div>{selectedBooking.GhiChu || "Không có"}</div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Toaster />
        </>
    )
}