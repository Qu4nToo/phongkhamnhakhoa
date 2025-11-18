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
                                                        <DropdownMenuItem>Tạo phiếu khám</DropdownMenuItem>
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