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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export default function BookingView() {
    const [bookings, setbookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [dichVuList, setDichVuList] = useState([]);
    const [booking, setBooking] = useState<any>([]);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);

    const TINH_TRANG = [
        { value: "Chờ xác nhận", label: "Chờ xác nhận" },
        { value: "Đã xác nhận", label: "Đã xác nhận" },
        { value: "Không đến", label: "Không đến" },
        { value: "Đang khám", label: "Đang khám" },
        { value: "Đã hủy", label: "Đã hủy" },
        { value: "Hoàn thành", label: "Hoàn thành" },
    ];

    const [newbooking, setNewbooking] = useState({
        GhiChu: "",
        NgayHen: "",
        GioHen: "",
        MaBacSi: "",
        MaKhachHang: "",
        MaDichVu: "",
        TinhTrang: "",
    });
    const [bookingEdit, setBookingEdit] = useState({
        GhiChu: "",
        NgayHen: "",
        GioHen: "",
        TinhTrang: "",
    });

    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [availableDaysEdit, setAvailableDaysEdit] = useState<number[]>([]);
    const [dayOffList, setDayOffList] = useState<string[]>([]); // yyyy-mm-dd
    const [dayOffListEdit, setDayOffListEdit] = useState<string[]>([]);
    const [timeSlotsEdit, setTimeSlotsEdit] = useState<any[]>([]);
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewbooking((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newbooking);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setNewbooking((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newbooking);
    };
    const handleInputChangeEdit2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setBookingEdit((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(bookingEdit);
    };
    const handleInputChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setBookingEdit((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(bookingEdit);
    };

    useEffect(() => {
        axios.get("http://localhost:5000/api/lich-hen/get")
            .then(bookings => setbookings(bookings.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/khach-hang/get")
            .then(customers => setCustomers(customers.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/dich-vu/get")
            .then(dichvu => setDichVuList(dichvu.data))
            .catch(err => console.log(err))
    }, []);

    // Fetch time slots khi ngày hẹn thay đổi trong form edit
    useEffect(() => {
        if (bookingEdit.NgayHen && booking.MaBacSi && booking.MaDichVu && showAlertEdit) {
            axios
                .get(`http://localhost:5000/api/lich-hen/available-slots`, {
                    params: {
                        bacSiId: booking.MaBacSi,
                        ngayHen: bookingEdit.NgayHen,
                        dichVuId: booking.MaDichVu,
                        excludeBookingId: booking.MaLichHen,
                    },
                })
                .then((res) => {
                    setTimeSlotsEdit(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeSlotsEdit([]);
                });
        }
    }, [bookingEdit.NgayHen, booking.MaBacSi, booking.MaDichVu, booking.MaLichHen, showAlertEdit]);

    // Lọc bác sĩ theo dịch vụ
    useEffect(() => {
        if (newbooking.MaDichVu) {
            // Reset bác sĩ, ngày, giờ khi thay đổi dịch vụ
            setNewbooking(prev => ({ ...prev, MaBacSi: "", NgayHen: "", GioHen: "" }));
            setAvailableDays([]);
            setTimeSlots([]);

            axios.get(`http://localhost:5000/api/bac-si/getBacSiByDichVu/${newbooking.MaDichVu}`)
                .then(res => {
                    setFilteredDoctors(res.data);
                })
                .catch(error => {
                    console.log(error);
                    setFilteredDoctors([]);
                    toast.error("Đã có lỗi khi lấy danh sách bác sĩ!");
                });
        } else {
            setFilteredDoctors([]);
            setNewbooking(prev => ({ ...prev, MaBacSi: "", NgayHen: "", GioHen: "" }));
            setAvailableDays([]);
            setTimeSlots([]);
        }
    }, [newbooking.MaDichVu]);

    // Lấy các slot thời gian khả dụng
    useEffect(() => {
        if (newbooking.NgayHen && newbooking.MaBacSi && newbooking.MaDichVu) {
            axios
                .get(`http://localhost:5000/api/lich-hen/available-slots`, {
                    params: {
                        bacSiId: newbooking.MaBacSi,
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
    }, [newbooking.NgayHen, newbooking.MaBacSi, newbooking.MaDichVu]);

    // Fetch lịch làm việc khi chọn bác sĩ
    useEffect(() => {
        if (newbooking.MaBacSi) {
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${newbooking.MaBacSi}`)
                .then(res => {
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
            // Lấy ngày nghỉ
            axios.get(`http://localhost:5000/api/bac-si-ngay-nghi/getByBacSi/${newbooking.MaBacSi}`)
                .then(res => {
                    setDayOffList(Array.isArray(res.data) ? res.data.map((d: any) => d.NgayNghi) : []);
                })
                .catch(() => setDayOffList([]));
        } else {
            setAvailableDays([]);
            setDayOffList([]);
        }
    }, [newbooking.MaBacSi]);

    const handleEditClick = (booking: any) => {
        console.log("Editing booking:", booking);
        setBooking(booking);
        setBookingEdit(
            {
                GhiChu: booking.GhiChu,
                NgayHen: booking.NgayHen,
                GioHen: booking.GioHen,
                TinhTrang: booking.TinhTrang,
            }
        );
        
        // Fetch lịch làm việc của bác sĩ
        if (booking.MaBacSi) {
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${booking.MaBacSi}`)
                .then(res => {
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
                    setAvailableDaysEdit(days);
                })
                .catch(err => console.log(err));
            // Lấy ngày nghỉ
            axios.get(`http://localhost:5000/api/bac-si-ngay-nghi/getByBacSi/${booking.MaBacSi}`)
                .then(res => {
                    setDayOffListEdit(Array.isArray(res.data) ? res.data.map((d: any) => d.NgayNghi) : []);
                })
                .catch(() => setDayOffListEdit([]));
        }
        
        // Fetch time slots nếu có đủ thông tin
        if (booking.NgayHen && booking.MaBacSi && booking.MaDichVu) {
            axios
                .get(`http://localhost:5000/api/lich-hen/available-slots`, {
                    params: {
                        bacSiId: booking.MaBacSi,
                        ngayHen: booking.NgayHen,
                        dichVuId: booking.MaDichVu,
                        excludeBookingId: booking.MaLichHen,
                    },
                })
                .then((res) => {
                    setTimeSlotsEdit(res.data);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeSlotsEdit([]);
                });
        }
        
        setShowAlertEdit(true);
    }

    const handleViewClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsViewDialogOpen(true);
    }

    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }

    const handleConfirmEdit = () => {
        console.log("Updating booking:", booking.MaLichHen, bookingEdit);
        axios.put(`http://localhost:5000/api/lich-hen/update/${booking.MaLichHen}`, bookingEdit)
            .then(() => {
                axios.get("http://localhost:5000/api/lich-hen/get")
                    .then((response) => setbookings(response.data))
                    .catch((err) => console.error("Error fetching bookings:", err));
                setShowAlertEdit(false);
            })
            .catch((err) => {
                console.error("Error updating booking:", err);
            });
    }
    const handleCreatebooking = () => {
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
        };
        axios.post("http://localhost:5000/api/lich-hen/create", bookingToCreate)
            .then(() => {
                toast.success("Thêm lịch hẹn thành công!");
                axios.get("http://localhost:5000/api/lich-hen/get")
                    .then((response) => setbookings(response.data))
                    .catch((err) => console.error("Error fetching bookings:", err));
                setNewbooking({
                    GhiChu: "",
                    NgayHen: "",
                    GioHen: "",
                    MaBacSi: "",
                    MaKhachHang: "",
                    MaDichVu: "",
                    TinhTrang: "",
                });
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
                            background: "#fef2f2",
                            color: "#dc2626",
                            borderRadius: "10px",
                            border: "1px solid #fca5a5",
                        },
                    });
                } else {
                    toast.error("Lỗi không xác định!", {
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
            });
    };

    const handleAcceptClick = async (booking: any) => {
        if (booking.TinhTrang === "Chờ xác nhận") {
            await axios.put(`http://localhost:5000/api/lich-hen/update-status/${booking.MaLichHen}`, {
                TinhTrang: "Đã xác nhận"
            });
            toast.success("Xác nhận lịch hẹn thành công");
            axios.get("http://localhost:5000/api/lich-hen/get")
                .then((response) => setbookings(response.data))
                .catch((err) => console.error("Error fetching bookings:", err));
        } else {
            toast.error("Chỉ có thể xác nhận lịch hẹn đang ở trạng thái 'Chờ xác nhận'.");
        }
    };

    const handleCreatePhieuKhamClick = async (booking: any) => {
        if (booking.TinhTrang !== "Đã xác nhận") {
            toast.error("Chỉ có thể tạo phiếu khám cho lịch hẹn đang ở trạng thái 'Đã xác nhận'.");
            return;
        }
        const newPhieuKham = {
            MaLichHen: booking.MaLichHen,
            MaKhachHang: booking.MaKhachHang,
            MaBacSi: booking.MaBacSi,
            NgayKham: booking.NgayHen,
        };
        try {
            const response = await axios.post(
                "http://localhost:5000/api/phieu-kham/create",
                newPhieuKham
            );
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
                MaDichVu: booking.MaDichVu,
                NgayHen: booking.NgayHen,
                GioHen: booking.GioHen,
                TinhTrang: "Đang khám",
                GhiChu: booking.GhiChu
            });
            axios.get("http://localhost:5000/api/lich-hen/get")
                .then((response) => setbookings(response.data))
                .catch((err) => console.error("Error fetching bookings:", err));
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
            <title>Quản Lý Lịch Hẹn</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                        {TINH_TRANG.map((status) => (
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
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Thêm lịch hẹn
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Thêm lịch hẹn</DialogTitle>
                                    <DialogDescription>
                                        Thêm lịch hẹn mới vào danh sách.
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
                                        >
                                            <option value="">Chọn dịch vụ</option>
                                            {dichVuList.map((dv: any) => (
                                                <option key={dv.MaDichVu} value={dv.MaDichVu}>
                                                    {dv.TenDichVu} ({dv.ThoiLuong} phút - {dv.Gia?.toLocaleString()} {dv.DonVi})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MaBacSi" className="text-right col-span-2">
                                            Bác Sĩ
                                        </Label>
                                        <select
                                            id="MaBacSi"
                                            onChange={handleInputChange2}
                                            className="col-span-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            disabled={!newbooking.MaDichVu}
                                        >
                                            <option value="">
                                                {!newbooking.MaDichVu
                                                    ? "Vui lòng chọn dịch vụ trước"
                                                    : filteredDoctors.length === 0
                                                        ? "Không có bác sĩ cho dịch vụ này"
                                                        : "Chọn bác sĩ"}
                                            </option>
                                            {filteredDoctors.map((doctor: any) => (
                                                <option key={doctor.MaBacSi} value={doctor.MaBacSi}>{doctor.HoTen}</option>
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
                                                        disabled={!newbooking.MaBacSi}
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {newbooking.NgayHen ? (
                                                            format(new Date(newbooking.NgayHen), "dd/MM/yyyy", { locale: vi })
                                                        ) : (
                                                            <span>{!newbooking.MaBacSi ? "Vui lòng chọn bác sĩ trước" : "Chọn ngày hẹn"}</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-white" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={newbooking.NgayHen ? new Date(newbooking.NgayHen) : undefined}
                                                        onSelect={(date: Date | undefined) => {
                                                            if (!date) return;
                                                            setNewbooking((prev) => ({
                                                                ...prev,
                                                                NgayHen: date.toLocaleDateString("en-CA"),
                                                            }));
                                                        }}
                                                        disabled={(date: Date) => {
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);
                                                            const dayOfWeek = date.getDay();
                                                            const dateStr = date.toLocaleDateString("en-CA");
                                                            return date < today || !availableDays.includes(dayOfWeek) || dayOffList.includes(dateStr);
                                                        }}
                                                    />
                                                </PopoverContent>
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
                                            disabled={!newbooking.NgayHen || !newbooking.MaBacSi || !newbooking.MaDichVu}
                                        >
                                            <option value="">
                                                {!newbooking.NgayHen || !newbooking.MaBacSi || !newbooking.MaDichVu
                                                    ? "Vui lòng chọn bác sĩ, dịch vụ và ngày hẹn trước"
                                                    : timeSlots.length === 0
                                                        ? "Không có thời gian khả dụng"
                                                        : "Chọn giờ hẹn"}
                                            </option>
                                            {timeSlots.map((slot: any) => (
                                                <option
                                                    key={slot.value}
                                                    value={slot.value}
                                                    disabled={!slot.available}
                                                >
                                                    {slot.label} {!slot.available ? "❌ (Đã đặt)" : "✅"}
                                                </option>
                                            ))}
                                        </select>
                                        {timeSlots.length > 0 && timeSlots.filter((s: any) => s.available).length === 0 && (
                                            <p className="col-span-6 text-sm text-red-500 text-right">
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
                                    <Button type="button" onClick={handleCreatebooking}>
                                        Xác nhận
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
                                        <TableHead>Bác sĩ</TableHead>
                                        <TableHead>Dịch vụ</TableHead>
                                        <TableHead>Ngày hẹn</TableHead>
                                        <TableHead>Giờ hẹn</TableHead>
                                        <TableHead>Tình trạng</TableHead>
                                        <TableHead>Ghi chú</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {bookings
                                    .filter((booking: any) =>
                                        booking.TenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase())
                                    )
                                    .map((bookings: any) => (
                                        <TableBody key={bookings.MaLichHen}>
                                            <TableRow >
                                                <TableCell className="font-medium">
                                                    {bookings.TenKhachHang}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {bookings.TenBacSi}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {bookings.TenDichVu || "Chưa có"} {bookings.ThoiLuong ? `(${bookings.ThoiLuong} phút)` : ""}
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
                                                            >
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => handleViewClick(bookings)}>Xem chi tiết</DropdownMenuItem>
                                                            {bookings.TinhTrang !== "Đang khám" && bookings.TinhTrang !== "Hoàn thành" && (
                                                                <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Sửa</DropdownMenuItem>
                                                            )}
                                                            {bookings.TinhTrang === "Chờ xác nhận" && (
                                                                <DropdownMenuItem onClick={() => handleAcceptClick(bookings)}>Xác nhận</DropdownMenuItem>
                                                            )}
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
                {TINH_TRANG.map((status) => (
                    <TabsContent key={status.value} value={status.value}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Danh sách lịch hẹn - {status.label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Khách hàng</TableHead>
                                            <TableHead>Bác sĩ</TableHead>
                                            <TableHead>Dịch vụ</TableHead>
                                            <TableHead>Ngày hẹn</TableHead>
                                            <TableHead>Giờ hẹn</TableHead>
                                            <TableHead>Tình trạng</TableHead>
                                            <TableHead>Ghi chú</TableHead>
                                            <TableHead>
                                                <span className="sr-only">Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    {bookings
                                        .filter((booking: any) =>
                                            booking.TinhTrang === status.value &&
                                            booking.TenKhachHang?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((bookings: any) => (
                                            <TableBody key={bookings.MaLichHen}>
                                                <TableRow>
                                                    <TableCell className="font-medium">
                                                        {bookings.TenKhachHang}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {bookings.TenBacSi}
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {bookings.TenDichVu || "Chưa có"} {bookings.ThoiLuong ? `(${bookings.ThoiLuong} phút)` : ""}
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
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewClick(bookings)}>Xem chi tiết</DropdownMenuItem>
                                                                {bookings.TinhTrang !== "Đang khám" && bookings.TinhTrang !== "Hoàn thành" && (
                                                                    <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Sửa</DropdownMenuItem>
                                                                )}
                                                                {bookings.TinhTrang === "Chờ xác nhận" && (
                                                                    <DropdownMenuItem onClick={() => handleAcceptClick(bookings)}>Xác nhận</DropdownMenuItem>
                                                                )}
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
                ))}
            </Tabs>
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent className="max-w-[500px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh sửa lịch hẹn</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="HoTen" className="text-right col-span-2">
                                Khách Hàng
                            </Label>
                            <Input id="HoTen" type="text" className="col-span-4" defaultValue={booking.TenKhachHang} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TenBacSi" className="text-right col-span-2">
                                Bác sĩ
                            </Label>
                            <Input id="TenBacSi" type="text" className="col-span-4" defaultValue={booking.TenBacSi} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TenDichVu" className="text-right col-span-2">
                                Dịch vụ
                            </Label>
                            <Input id="TenDichVu" type="text" className="col-span-4" defaultValue={booking.TenDichVu} readOnly />
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
                                                !bookingEdit.NgayHen && "text-gray-500"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {bookingEdit.NgayHen ? (
                                                format(new Date(bookingEdit.NgayHen), "dd/MM/yyyy", { locale: vi })
                                            ) : (
                                                <span>Chọn ngày hẹn</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={bookingEdit.NgayHen ? new Date(bookingEdit.NgayHen) : undefined}
                                            onSelect={(date: Date | undefined) => {
                                                if (!date) return;
                                                const formattedDate = date.toLocaleDateString("en-CA");
                                                setBookingEdit((prev) => ({
                                                    ...prev,
                                                    NgayHen: formattedDate,
                                                    GioHen: "",
                                                }));
                                            }}
                                            disabled={(date: Date) => {
                                                const today = new Date();
                                                today.setHours(0, 0, 0, 0);
                                                const dayOfWeek = date.getDay();
                                                const dateStr = date.toLocaleDateString("en-CA");
                                                return date < today || !availableDaysEdit.includes(dayOfWeek) || dayOffListEdit.includes(dateStr);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {availableDaysEdit.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Bác sĩ làm việc: {availableDaysEdit.map(day =>
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
                            <div className="col-span-4">
                                <select
                                    id="GioHen"
                                    value={bookingEdit.GioHen}
                                    onChange={handleInputChangeEdit2}
                                    className="w-full disabled:bg-gray-100 disabled:cursor-not-allowed p-2 border rounded"
                                >
                                    <option value="">
                                        {timeSlotsEdit.length === 0
                                            ? "Đang tải..."
                                            : "Chọn giờ hẹn"}
                                    </option>
                                    {timeSlotsEdit.map((slot: any) => (
                                        <option
                                            key={slot.value}
                                            value={slot.value}
                                            disabled={!slot.available}
                                        >
                                            {slot.label} {!slot.available ? "❌ (Đã đặt)" : "✅"}
                                        </option>
                                    ))}
                                </select>
                                {timeSlotsEdit.length > 0 && timeSlotsEdit.filter((s: any) => s.available).length === 0 && (
                                    <p className="text-sm text-red-500 mt-1">
                                        ⚠️ Tất cả các khung giờ đã được đặt. Vui lòng chọn ngày khác.
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TinhTrang" className="text-right col-span-2">
                                Tình Trạng
                            </Label>
                            <select
                                id="TinhTrang"
                                value={bookingEdit.TinhTrang}
                                onChange={handleInputChangeEdit2}
                                className="col-span-4 p-2 border rounded"
                            >
                                {TINH_TRANG
                                    .filter(status => status.value !== "Đang khám" && status.value !== "Hoàn thành")
                                    .map((status) => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="GhiChu" className="text-right col-span-2">
                                Ghi chú
                            </Label>
                            <Input 
                                onChange={handleInputChangeEdit} 
                                id="GhiChu" 
                                type="text" 
                                className="col-span-4" 
                                value={bookingEdit.GhiChu}
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertEditClose}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmEdit}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                    </DialogHeader>
                    {selectedBooking && (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <div className="space-y-2">
                                <Label className="font-semibold">Khách hàng</Label>
                                <p>{selectedBooking.TenKhachHang}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Số điện thoại</Label>
                                <p>{selectedBooking.SoDienThoai || "Không có"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Bác sĩ</Label>
                                <p>{selectedBooking.TenBacSi}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Dịch vụ</Label>
                                <p>{selectedBooking.TenDichVu || "Chưa có"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Thời lượng</Label>
                                <p>{selectedBooking.ThoiLuong ? `${selectedBooking.ThoiLuong} phút` : "Chưa có"}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Ngày hẹn</Label>
                                <p>{new Date(selectedBooking.NgayHen).toLocaleDateString("vi-VN")}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Giờ hẹn</Label>
                                <p>{selectedBooking.GioHen}</p>
                            </div>
                            <div className="space-y-2">
                                <Label className="font-semibold">Trạng thái</Label>
                                <p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${selectedBooking.TinhTrang === "Chờ xác nhận" ? "bg-yellow-100 text-yellow-800" :
                                            selectedBooking.TinhTrang === "Đã xác nhận" ? "bg-blue-100 text-blue-800" :
                                                selectedBooking.TinhTrang === "Đang khám" ? "bg-green-100 text-green-800" :
                                                    selectedBooking.TinhTrang === "Hoàn thành" ? "bg-gray-100 text-gray-800" :
                                                        selectedBooking.TinhTrang === "Không đến" ? "bg-orange-100 text-orange-800" :
                                                            "bg-red-100 text-red-800"}`}>
                                        {selectedBooking.TinhTrang}
                                    </span>
                                </p>
                            </div>
                            <div className="space-y-2 col-span-2">
                                <Label className="font-semibold">Ghi chú</Label>
                                <p className="text-gray-600">{selectedBooking.GhiChu || "Không có ghi chú"}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster />
        </>
    )
}