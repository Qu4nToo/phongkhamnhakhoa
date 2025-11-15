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
export default function BookingView() {
    const router = useRouter();
    const [bookings, setbookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState<any>(null);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const [newbooking, setNewbooking] = useState({
        GhiChu: "",
        NgayHen: "",
    });

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
            axios.get(`http://localhost:5000/api/lich-hen/get/bacsi/${doctorsinfo.bacSi.MaBacSi}`)
                .then(bookings => setbookings(bookings.data))
                .catch(err => console.log(err))
            setDoctors(doctorsinfo);
        }
    }, []);

    const handleCreatebooking = () => {
        console.log(newbooking);
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
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/lich-hen/get")
                    .then((response) => setbookings(response.data))
                    .catch((err) => console.error("Error fetching bookings:", err));
                setNewbooking({
                    GhiChu: "",
                    NgayHen: "",
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

    const handleCreatePhieuKhamClick = async (booking: any) => { // 👈 Cần thêm 'async' vì ta dùng 'await'
        // 1. Chuẩn bị dữ liệu
        // const today = new Date();
        const newPhieuKham = {
            MaLichHen: booking.MaLichHen,
            MaKhachHang: booking.MaKhachHang,
            MaBacSi: booking.MaBacSi,
            NgayKham: booking.NgayHen,
        };
        console.log("Dữ liệu phiếu khám mới:", newPhieuKham);
        try {
            const response = await axios.post( // 👈 Cần thêm 'await'
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
            router.push('/BacSi/PhieuKham');
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
            <Toaster />
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
                                        <Input onChange={handleInputChange} id="NgayHen" type="date" className="col-span-4" />
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