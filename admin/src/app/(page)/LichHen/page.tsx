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
export default function BookingView() {
    const [bookings, setbookings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [booking, setbooking] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedbooking, setSelectedbooking] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);


    const [newbooking, setNewbooking] = useState({
        GhiChu: "",
        NgayHen: "",
        TinhTrang: "0"
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
                    TinhTrang: "0"
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating booking:", err));
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
                            <CardTitle>Danh sách khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Bác sĩ</TableHead>
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
                                                {bookings.TenBacSi}
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
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleEditClick(bookings)}>Tạo phiếu khám</DropdownMenuItem>
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
                            <Label htmlFor="MaBacSi" className="text-right col-span-2">
                                Tình Trạng
                            </Label>
                            <select
                                id="TinhTrang"  // Đây là ID cho dropdown
                                onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                className="col-span-4"
                            >
                                <option value="">Chọn Tình Trạng</option>
                                <option value="0" selected={newbooking.TinhTrang === "0"}>Chưa hoàn thành</option>
                                <option value="1" selected={newbooking.TinhTrang === "1"}>Đã hoàn thành</option>
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