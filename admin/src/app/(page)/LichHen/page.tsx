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
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export default function BookingView() {
    const router = useRouter();
    const [bookings, setbookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [booking, setbooking] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedbooking, setSelectedbooking] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");


    const TIME_SLOTS = [
        { value: "08:00 - 10:00", label: "08:00 - 10:00" },
        { value: "10:00 - 12:00", label: "10:00 - 12:00" },
        { value: "13:00 - 15:00", label: "13:00 - 15:00" },
        { value: "15:00 - 17:00", label: "15:00 - 17:00" },
    ];

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
        TinhTrang: "",
    });

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [lichLamViec, setLichLamViec] = useState<any[]>([]);
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
        axios.get("http://localhost:5000/api/lich-hen/get")
            .then(bookings => setbookings(bookings.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/bac-si/get")
            .then(doctors => setDoctors(doctors.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/khach-hang/get")
            .then(customers => setCustomers(customers.data))
            .catch(err => console.log(err))
    }, []);

    // Fetch giờ đã đặt khi thay đổi ngày hoặc bác sĩ
    useEffect(() => {
        if (newbooking.NgayHen && newbooking.MaBacSi) {
            axios
                .get(`http://localhost:5000/api/lich-hen/getByBacSiID/${newbooking.MaBacSi}`)
                .then((res) => {
                    const bookedTimes = res.data
                        .filter((booking: any) => booking.NgayHen === newbooking.NgayHen)
                        .map((booking: any) => booking.GioHen);
                    setBookedSlots(bookedTimes);
                })
                .catch((error) => console.log(error));
        } else {
            setBookedSlots([]);
        }
    }, [newbooking.NgayHen, newbooking.MaBacSi]);

    // Fetch lịch làm việc khi chọn bác sĩ
    useEffect(() => {
        if (newbooking.MaBacSi) {
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${newbooking.MaBacSi}`)
                .then(res => {
                    setLichLamViec(res.data);
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
        } else {
            setAvailableDays([]);
        }
    }, [newbooking.MaBacSi]);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (booking: React.SetStateAction<null>) => {
        console.log(booking);
        setSelectedbooking(booking);
        setShowAlert(true);
    }
    const handleEditClick = (booking: any) => {
        setbooking(booking);
        setNewbooking(booking);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedbooking(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/lich-hen/update/${booking.MaLichHen}`, newbooking)
            .then(() => {
                // toast({
                //     title: "booking Edit",
                //     description: `booking has been edit.`,
                // });
                // Reload the bookings or update state after deletion
                axios.get("http://localhost:5000/api/lich-hen/get")
                    .then((response) => setbookings(response.data))
                    .catch((err) => console.error("Error fetching bookings:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting booking:", err);
                // toast({
                //     title: "Edit Failed",
                //     description: `There was an error edit the booking.`,
                //     variant: "destructive",
                // });
            });
    }

    const handleConfirmDelete = () => {

        if (selectedbooking) {
            axios.delete(`http://localhost:5000/api/lich-hen/delete/${selectedbooking.MaLichHen}`)
                .then(() => {
                    toast("booking Deleted: booking has been deleted.");
                    axios.get("http://localhost:5000/api/lich-hen/get")
                        .then((response) => setbookings(response.data))
                        .catch((err) => console.error("Error fetching bookings:", err));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting booking:", err);
                    toast("Delete Failed: There was an error deleting the booking.");
                });
        }
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
        };
        axios.post("http://localhost:5000/api/lich-hen/create", bookingToCreate)
            .then(() => {
                toast("booking Created: New booking has been added successfully.");
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/lich-hen/get")
                    .then((response) => setbookings(response.data))
                    .catch((err) => console.error("Error fetching bookings:", err));
                setNewbooking({
                    GhiChu: "",
                    NgayHen: "",
                    GioHen: "",
                    MaBacSi: "",
                    MaKhachHang: "",
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
        if(booking.TinhTrang === "Chờ xác nhận" ){
            await axios.put(`http://localhost:5000/api/lich-hen/update/${booking.MaLichHen}`, {
                MaKhachHang: booking.MaKhachHang,
                MaBacSi: booking.MaBacSi,
                NgayHen: booking.NgayHen,
                GioHen: booking.GioHen,
                TinhTrang: "Đã xác nhận",
                GhiChu: booking.GhiChu
            });
            toast.success("Xác nhận lịch hẹn thành công");
            // Reload danh sách lịch hẹn
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
            <title>booking</title>
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
                                            id="MaKhachHang"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Chọn khách hàng</option>
                                            {customers.map((customer: any) => (
                                                <option key={customer.MaKhachHang} value={customer.MaKhachHang}>{customer.HoTen}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MaBacSi" className="text-right col-span-2">
                                            Bác Sĩ
                                        </Label>
                                        <select
                                            id="MaBacSi"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Chọn bác sĩ</option>
                                            {doctors.map((doctor: any) => (
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
                                                            return date < today || !availableDays.includes(dayOfWeek);
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
                                            disabled={!newbooking.NgayHen || !newbooking.MaBacSi}
                                        >
                                            <option value="">
                                                {!newbooking.NgayHen || !newbooking.MaBacSi
                                                    ? "Vui lòng chọn ngày và bác sĩ trước"
                                                    : "Chọn giờ hẹn"}
                                            </option>
                                            {TIME_SLOTS.map((slot) => {
                                                const isBooked = bookedSlots.includes(slot.value);
                                                return (
                                                    <option key={slot.value} value={slot.value} disabled={isBooked}>
                                                        {slot.label} {isBooked ? "(Đã đặt)" : ""}
                                                    </option>
                                                );
                                            })}
                                        </select>
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
                                        <TableHead>Bác sĩ</TableHead>
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
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleAcceptClick(bookings)}>Xác nhận</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleCreatePhieuKhamClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(bookings)}>Xóa</DropdownMenuItem>
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
                                                                <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Sửa</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAcceptClick(bookings)}>Xác nhận</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleCreatePhieuKhamClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleDeleteClick(bookings)}>Xóa</DropdownMenuItem>
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
                            Are you sure you want to delete this booking?
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
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit booking</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="HoTen" className="text-right col-span-2">
                                Khách Hàng
                            </Label>
                            <Input id="HoTen" type="text" className="col-span-4" defaultValue={booking.TenKhachHang} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="HoTen" className="text-right col-span-2">
                                Bác sĩ
                            </Label>
                            <Input id="HoTen" type="text" className="col-span-4" defaultValue={booking.TenBacSi} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="NgayHen" className="text-right col-span-2">
                                Ngày hẹn
                            </Label>
                            <Input onChange={handleInputChange} id="NgayHen" type="date" className="col-span-4" defaultValue={booking.NgayHen} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="GioHen" className="text-right col-span-2">
                                Giờ hẹn
                            </Label>
                            <select
                                id="GioHen"
                                onChange={handleInputChange2}
                                className="col-span-4"
                                defaultValue={booking.GioHen}
                            >
                                {TIME_SLOTS.map((slot) => (
                                    <option key={slot.value} value={slot.value}>
                                        {slot.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TinhTrang" className="text-right col-span-2">
                                Tình Trạng
                            </Label>
                            <select
                                id="TinhTrang"
                                onChange={handleInputChange2}
                                className="col-span-4"
                                defaultValue={booking.TinhTrang}
                            >
                                {TINH_TRANG.map((status) => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertEditClose}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmEdit}>
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Toaster />
        </>
    )
}