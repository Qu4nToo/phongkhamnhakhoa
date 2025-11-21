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
import axios from "axios"
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
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState<any>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const TIME_SLOTS = [
        { value: "08:00 - 10:00", label: "08:00 - 10:00" },
        { value: "10:00 - 12:00", label: "10:00 - 12:00" },
        { value: "13:00 - 15:00", label: "13:00 - 15:00" },
        { value: "15:00 - 17:00", label: "15:00 - 17:00" },
    ];

    const [newbooking, setNewbooking] = useState({
        GhiChu: "",
        NgayHen: "",
        GioHen: "",
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
        axios.get("http://localhost:5000/api/khach-hang/get")
            .then(customers => setCustomers(customers.data))
            .catch(err => console.log(err))
        const storedUserInfo = sessionStorage.getItem("bacsi_info");
        if (storedUserInfo) {

            const doctorsinfo = JSON.parse(storedUserInfo);
            axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${doctorsinfo.bacSi.MaBacSi}`)
                .then(response => {
                    // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                    const filteredBookings = response.data.filter((booking: any) => 
                        booking.TinhTrang === "Đã xác nhận"
                    );
                    setbookings(filteredBookings);
                })
                .catch(err => console.log(err))
            
            // Fetch lịch làm việc của bác sĩ
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${doctorsinfo.bacSi.MaBacSi}`)
                .then(res => {
                    setLichLamViec(res.data);
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
            
            setDoctors(doctorsinfo);
        }
    }, []);

    // Fetch giờ đã đặt khi thay đổi ngày
    useEffect(() => {
        if (newbooking.NgayHen && doctors?.bacSi?.MaBacSi) {
            axios
                .get(`http://localhost:5000/api/lich-hen/getByBacSiID/${doctors.bacSi.MaBacSi}`)
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
    }, [newbooking.NgayHen, doctors]);

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
                    GhiChu: "",
                    NgayHen: "",
                    GioHen: "",
                });
                setBookedSlots([]);

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
            const storedUserInfo = sessionStorage.getItem("bacsi_info");
            if (storedUserInfo) {
                const doctorsinfo = JSON.parse(storedUserInfo);
                const response = await axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${doctorsinfo.bacSi.MaBacSi}`);
                // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                const filteredBookings = response.data.filter((booking: any) => 
                    booking.TinhTrang === "Đã xác nhận"
                );
                setbookings(filteredBookings);
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
            <title>booking</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1 bg-black text-white hover:bg-white hover:text-black border border-black">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Tạo lịch hẹn
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Tạo lịch hẹn</DialogTitle>
                                    <DialogDescription>
                                        Tạo lịch hẹn mới.
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
                                                    >
                                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                                        {newbooking.NgayHen ? (
                                                            format(new Date(newbooking.NgayHen), "dd/MM/yyyy", { locale: vi })
                                                        ) : (
                                                            <span>Chọn ngày hẹn</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
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
                                            disabled={!newbooking.NgayHen}
                                        >
                                            <option value="">
                                                {!newbooking.NgayHen
                                                    ? "Vui lòng chọn ngày hẹn trước"
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
                                {bookings.map((bookings: any) => (
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
                                                        <DropdownMenuItem onClick={() => handleCreatePhieuKhamClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
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

        </>
    )
}