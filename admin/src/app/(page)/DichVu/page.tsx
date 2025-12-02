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
export default function ServiceView() {
    const [services, setServices] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [service, setService] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedservice, setSelectedservice] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);


    const [newService, setNewService] = useState({
        TenDichVu: "",
        MoTa: "",
        Gia: "",
        DonVi: "",
        MaLoaiDV: "",
        ThoiLuong: ""
    });
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewService((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newService);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = e.target;

        const { value } = e.target;
        setNewService((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newService);
    };

    const DonVi = [
        "Gói",
        "Chiếc"
    ];
    useEffect(() => {
        axios.get("http://localhost:5000/api/dich-vu/get")
            .then(services => setServices(services.data))
            .catch(err => console.log(err))
        axios.get("http://localhost:5000/api/loai-dich-vu/get")
            .then(categorys => setCategorys(categorys.data))
            .catch(err => console.log(err))
    }, []);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (service: React.SetStateAction<null>) => {
        console.log(service);
        setSelectedservice(service);
        setShowAlert(true);
    }
    const handleEditClick = (service: any) => {
        setService(service);
        setNewService(service);
        console.log(newService);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedservice(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/dich-vu/update/${service.MaDichVu}`, newService)
            .then(() => {
                // toast({
                //     title: "service Edit",
                //     description: `service has been edit.`,
                // });
                // Reload the services or update state after deletion
                axios.get("http://localhost:5000/api/dich-vu/get")
                    .then((response) => setServices(response.data))
                    .catch((err) => console.error("Error fetching services:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting service:", err);
                // toast({
                //     title: "Edit Failed",
                //     description: `There was an error edit the service.`,
                //     variant: "destructive",
                // });
            });
    }

    const handleConfirmDelete = () => {

        if (selectedservice) {
            axios.delete(`http://localhost:5000/api/dich-vu/delete/${selectedservice.MaDichVu}`)
                .then(() => {
                    toast.success("Xóa dịch vụ thành công!");
                    axios.get("http://localhost:5000/api/dich-vu/get")
                        .then((response) => setServices(response.data))
                        .catch((err) => console.error("Error fetching services:", err));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting service:", err);
                    toast.error("Có lỗi xảy ra khi xóa dịch vụ!");
                });
        }
    };
    const handleCreateservice = () => {
        console.log(newService);
        const serviceToCreate = {
            ...newService,
        };
        axios.post("http://localhost:5000/api/dich-vu/create", serviceToCreate)
            .then(() => {
                toast.success("Thêm dịch vụ thành công!");
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/dich-vu/get")
                    .then((response) => setServices(response.data))
                    .catch((err) => console.error("Error fetching services:", err));
                setNewService({
                    TenDichVu: "",
                    MoTa: "",
                    Gia: "",
                    DonVi: "",
                    MaLoaiDV: "",
                    ThoiLuong: ""
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating service:", err));
    };

    return (
        <>
            <title>Quản Lý Dịch Vụ</title>
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
                                        Thêm dịch vụ
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Thêm dịch vụ</DialogTitle>
                                    <DialogDescription>
                                        Thêm dịch vụ mới vào danh sách.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MaLoaiDV" className="text-right col-span-2">
                                            Loại dịch vụ
                                        </Label>
                                        <select
                                            id="MaLoaiDV"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Chọn Loại dịch vụ</option>
                                            {categorys.map((category: any) => (
                                                <option key={category.MaLoaiDV} value={category.MaLoaiDV}>{category.TenLoaiDV}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="TenDichVu" className="text-right col-span-2">
                                            Tên dịch vụ
                                        </Label>
                                        <Input onChange={handleInputChange} id="TenDichVu" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MoTa" className="text-right col-span-2">
                                            Mô tả
                                        </Label>
                                        <Input onChange={handleInputChange} id="MoTa" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="DonVi" className="text-right col-span-2">
                                            Đơn vị
                                        </Label>
                                        <select
                                            id="DonVi"  // Đây là ID cho dropdown
                                            onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                            className="col-span-4"
                                        >
                                            <option value="">Chọn Đơn vị</option>
                                            {DonVi.map((donvi) => (
                                                <option key={donvi} value={donvi}>{donvi}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="Gia" className="text-right col-span-2">
                                            Giá
                                        </Label>
                                        <Input onChange={handleInputChange} id="Gia" type="number" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="ThoiLuong" className="text-right col-span-2">
                                            Thời lượng (phút)
                                        </Label>
                                        <Input onChange={handleInputChange} id="ThoiLuong" type="number" className="col-span-4" placeholder="VD: 30, 60, 90" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreateservice}>
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
                            <CardTitle>Danh sách dịch vụ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loại dịch vụ</TableHead>
                                        <TableHead>Tên dịch vụ</TableHead>
                                        <TableHead>Mô tả</TableHead>
                                        <TableHead>Đơn vị</TableHead>
                                        <TableHead>Giá</TableHead>
                                        <TableHead>Thời lượng</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {services.map((services: any) => (
                                    <TableBody key={services.MaDichVu}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {services.TenLoaiDV}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {services.TenDichVu}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {services.MoTa}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {services.DonVi}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {/* Sử dụng Intl.NumberFormat để định dạng tiền tệ */}
                                                {new Intl.NumberFormat('vi-VN', {
                                                    style: 'currency',
                                                    currency: 'VND'
                                                }).format(services.Gia)}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {services.ThoiLuong} phút
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
                                                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEditClick(services)}>Sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(services)}>Xóa</DropdownMenuItem>
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
                        <AlertDialogTitle>Xác Nhận Xóa Dịch Vụ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa dịch vụ này không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleAlertClose}>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Chỉnh Sửa Thông Tin Dịch Vụ</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="LoaiDichVu" className="text-right col-span-2">
                                Loại dịch vụ
                            </Label>
                            <Input id="LoaiDichVu" type="text" className="col-span-4" defaultValue={service.TenLoaiDV} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TenDichVu" className="text-right col-span-2">
                                Tên dịch vụ
                            </Label>
                            <Input id="TenDichVu" type="text" className="col-span-4" defaultValue={service.TenDichVu} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="MoTa" className="text-right col-span-2">
                                Mô tả
                            </Label>
                            <Input onChange={handleInputChange} id="MoTa" type="text" className="col-span-4" defaultValue={service.MoTa} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="DonVi" className="text-right col-span-2">
                                Đơn vị
                            </Label>
                            <select
                                id="MaLoaiDV"  // Đây là ID cho dropdown
                                onChange={handleInputChange2}  // Gọi handleInputChange khi có sự thay đổi
                                className="col-span-4"
                            >
                                <option key={service.MaLoaiDV} value={service.MaLoaiDV}>{service.TenLoaiDV}</option>
                                {categorys.map((category: any) => (
                                    <option key={category.MaLoaiDV} value={category.MaLoaiDV}>{category.TenLoaiDV}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="Gia" className="text-right col-span-2">
                                Giá
                            </Label>
                            <Input onChange={handleInputChange} id="Gia" type="text" className="col-span-4" defaultValue={service.Gia} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="ThoiLuong" className="text-right col-span-2">
                                Thời lượng (phút)
                            </Label>
                            <Input onChange={handleInputChange} id="ThoiLuong" type="number" className="col-span-4" defaultValue={service.ThoiLuong} />
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
            <Toaster />
        </>
    )
}