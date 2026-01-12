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
    CardFooter,
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
import axios from "@/lib/axiosDoctor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { isAxiosError } from "axios";
import { PaginationCustom } from "@/components/ui/pagination-custom";

export default function BookingView() {
    const router = useRouter();
    const [bookings, setbookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState<any>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isViewDialogOpen, setViewDialogOpen] = useState(false);
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [dichVuList, setDichVuList] = useState([]);
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    const [filterDate, setFilterDate] = useState("");
    const [searchName, setSearchName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const statusTabs = [
        { value: '', label: 'Tất cả' },
        { value: 'Chờ xác nhận', label: 'Chờ xác nhận' },
        { value: 'Đã xác nhận', label: 'Đã xác nhận' },
        { value: 'Đang khám', label: 'Đang khám' },
        { value: 'Hoàn thành', label: 'Hoàn thành' },
    ];

    const [newbooking, setNewbooking] = useState({
        MaDichVu: "",
        GhiChu: "",
        NgayHen: "",
        GioHen: "",
    });

    const [availableDays, setAvailableDays] = useState<number[]>([]);
    const [ngayNghi, setNgayNghi] = useState<string[]>([]); // yyyy-mm-dd (ngày nghỉ cá nhân bác sĩ)
    const [clinicHolidays, setClinicHolidays] = useState<string[]>([]); // yyyy-mm-dd (ngày nghỉ lễ phòng khám)

    // Helper function: Chuyển đổi từ range (NgayBatDau -> NgayKetThuc) thành array các ngày
    const generateDateRange = (startDate: string, endDate: string): string[] => {
        const dates: string[] = [];
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            dates.push(date.toLocaleDateString("en-CA")); // yyyy-mm-dd
        }
        
        return dates;
    };

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
        
        // Fetch lịch nghỉ phòng khám
        axios.get("http://localhost:5000/api/lich-nghi-phong-kham/getUpcoming")
            .then(res => {
                const allHolidayDates: string[] = [];
                res.data.forEach((holiday: any) => {
                    const dates = generateDateRange(holiday.NgayBatDau, holiday.NgayKetThuc);
                    allHolidayDates.push(...dates);
                });
                setClinicHolidays(allHolidayDates);
            })
            .catch(err => {
                console.log("Không thể tải lịch nghỉ phòng khám:", err);
                setClinicHolidays([]);
            });
        
        const storedUserInfo = sessionStorage.getItem("doctor_info");
        if (storedUserInfo) {
            const user = JSON.parse(storedUserInfo);
            setDoctors(user);
            axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${user.MaBacSi}`)
                .then(response => {
                    // Lọc chỉ lấy lịch hẹn có tình trạng "Đã xác nhận"
                    const filteredBookings = response.data.filter((booking: any) =>
                        booking.TinhTrang !== "không đến" && booking.TinhTrang !== "Đã hủy"
                    );
                    setbookings(filteredBookings);
                    setFilteredBookings(filteredBookings);
                })
                .catch(err => console.log(err))
            axios.get(`http://localhost:5000/api/dich-vu/getDichVuByBacSi/${user.MaBacSi}`)
                .then(res => setDichVuList(res.data))
                .catch(err => console.log(err))
            // Fetch lịch làm việc của bác sĩ
            axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${user.MaBacSi}`)
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
            // Fetch ngày nghỉ của bác sĩ
            axios.get(`http://localhost:5000/api/ngay-nghi-bac-si/getByBacSi/${user.MaBacSi}`)
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setNgayNghi(res.data.map((d: any) => d.NgayNghi));
                    } else {
                        setNgayNghi([]);
                    }
                })
                .catch(err => {
                    setNgayNghi([]);
                    console.log(err);
                });
        }
    }, []);

    useEffect(() => {
        console.log("Fetching time slots for:", doctors);
        if (newbooking.MaDichVu && newbooking.NgayHen && doctors?.MaBacSi) {
            axios
                .get(`http://localhost:5000/api/lich-hen/available-slots`, {
                    params: {
                        bacSiId: doctors.MaBacSi,
                        ngayHen: newbooking.NgayHen,
                        dichVuId: newbooking.MaDichVu,
                    },
                })
                .then((res) => {
                    setTimeSlots(res.data);
                    console.log("Available time slots:", res.data);
                })
                .catch((error) => {
                    console.log(error);
                    setTimeSlots([]);
                });
        } else {
            setTimeSlots([]);
        }
    }, [newbooking.MaDichVu, newbooking.NgayHen, doctors]);

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


    useEffect(() => {
        let filtered = bookings;
        if (filterDate) {
            filtered = filtered.filter((booking: any) => booking.NgayHen === filterDate);
        }
        if (searchName) {
            filtered = filtered.filter((booking: any) =>
                booking.TenKhachHang?.toLowerCase().includes(searchName.toLowerCase())
            );
        }
        if (filterStatus && filterStatus !== '') {
            filtered = filtered.filter((booking: any) => booking.TinhTrang === filterStatus);
        }
        setFilteredBookings(filtered);
    }, [filterDate, bookings, searchName, filterStatus]);

    const handleViewClick = (booking: any) => {
        setSelectedBooking(booking);
        setViewDialogOpen(true);
    };
    const handleCreateClick = (booking: any) => {
        setSelectedCustomer({ MaKhachHang: booking.MaKhachHang, HoTen: booking.TenKhachHang });
        setCreateDialogOpen(true);
    };

    const handleCreatebooking = () => {
        console.log(newbooking);

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
            MaBacSi: doctors.MaBacSi,
            MaKhachHang: selectedCustomer.MaKhachHang,
        };
        axios.post("http://localhost:5000/api/lich-hen/create", bookingToCreate)
            .then(() => {
                toast.success("Đặt lịch thành công!");
                axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${doctors.MaBacSi}`)
                    .then((response) => {
                        const filteredBookings = response.data.filter((booking: any) =>
                            booking.TinhTrang !== "không đến" && booking.TinhTrang !== "Đã hủy"
                        );
                        setbookings(filteredBookings);
                    })
                    .catch((err) => console.error("Error fetching bookings:", err));

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
                if (isAxiosError(error)) {
                    toast.error(error.response?.data?.message || "Lỗi không xác định!", {
                    });
                } else {
                    toast.error("Lỗi không xác định!", {
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
            const storedUserInfo = sessionStorage.getItem("doctor_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const response = await axios.get(`http://localhost:5000/api/lich-hen/getByBacSiID/${user.MaBacSi}`);
                const filteredBookings = response.data.filter((booking: any) =>
                    booking.TinhTrang !== "không đến" && booking.TinhTrang !== "Đã hủy"
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
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 ">
                    <TabsList className="bg-gray-100 p-4 rounded-md">
                        {statusTabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 ml-auto">
                        <Input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="w-auto"
                            placeholder="Tìm theo tên khách hàng"
                        />
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
                    </div>
                </div>

                {statusTabs.map(tab => {
                    const tabFilteredBookings = filteredBookings.filter((booking: any) => tab.value === '' || booking.TinhTrang === tab.value);
                    const totalPages = Math.ceil(tabFilteredBookings.length / itemsPerPage);
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const paginatedBookings = tabFilteredBookings.slice(startIndex, endIndex);
                    
                    return (
                    <TabsContent key={tab.value} value={tab.value}>
                        <Card x-chunk="dashboard-06-chunk-0">
                            <CardHeader>
                                <CardTitle>Danh sách lịch hẹn {tab.label !== 'Tất cả' ? `- ${tab.label}` : ''}</CardTitle>
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
                                    {paginatedBookings.map((bookings: any) => (
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
                                                                >
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                    <span className="sr-only">Toggle menu</span>
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent className="bg-white" align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewClick(bookings)}>Xem chi tiết</DropdownMenuItem>
                                                                {bookings.TinhTrang === "Đã xác nhận" && (
                                                                    <DropdownMenuItem onClick={() => handleCreatePhieuKhamClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
                                                                )}
                                                                {bookings.TinhTrang === "Hoàn thành" && (
                                                                    <DropdownMenuItem onClick={() => handleCreateClick(bookings)}>Tạo lịch tái khám</DropdownMenuItem>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        ))}
                                </Table>
                            </CardContent>
                            <CardFooter className="w-full p-0">
                                <PaginationCustom
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => setCurrentPage(page)}
                                    itemsPerPage={itemsPerPage}
                                    totalItems={tabFilteredBookings.length}
                                />
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    );
                })}
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
                                    <span className={`px-3 py-1 rounded-full text-sm ${selectedBooking.TinhTrang === "Đã xác nhận" ? "bg-blue-100 text-blue-700" :
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

            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chi tiết lịch hẹn</DialogTitle>
                    </DialogHeader>
                    {selectedCustomer && (
                        
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-6 items-center gap-4">
                                <Label htmlFor="MaKhachHang" className="text-right col-span-2">
                                    Khách Hàng
                                </Label>
                                <Input type="text" className="col-span-4" defaultValue={selectedCustomer.HoTen} readOnly />
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
                                                        const dateStr = date.toLocaleDateString("en-CA");
                                                        return (
                                                            date < today ||
                                                            !availableDays.includes(dayOfWeek) ||
                                                            ngayNghi.includes(dateStr) ||
                                                            clinicHolidays.includes(dateStr) // Disable ngày nghỉ lễ phòng khám
                                                        );
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
                    )}
                    <DialogFooter>
                        <Button className="bg-black text-white hover:bg-white hover:text-black border-1" type="button" onClick={handleCreatebooking}>
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}