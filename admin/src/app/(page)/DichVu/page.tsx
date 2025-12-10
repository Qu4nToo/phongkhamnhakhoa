"use client"
import { useEffect, useState } from "react"
import React from "react"
import {
    MoreHorizontal,
    PlusCircle,
    Upload,
    X,
    Image as ImageIcon,
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
export default function ServiceView() {
    const [services, setServices] = useState([]);
    const [categorys, setCategorys] = useState([]);
    const [service, setService] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedservice, setSelectedservice] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isImageDialogOpen, setImageDialogOpen] = useState(false);
    const [selectedServiceForImages, setSelectedServiceForImages] = useState<any>(null);
    const [serviceImages, setServiceImages] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);


    const [newService, setNewService] = useState({
        TenDichVu: "",
        MoTa: "",
        Gia: "",
        DonVi: "",
        MaLoaiDV: "",
        ThoiLuong: "",
        TrangThai: "Đang hoạt động"
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
                    ThoiLuong: "",
                    TrangThai: "Đang hoạt động"
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating service:", err));
    };

    const reloadServices = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/dich-vu/get");
            setServices(response.data);
        } catch (err) {
            console.error("Error fetching services:", err);
        }
    };

    const handleImageManageClick = async (service: any) => {
        setSelectedServiceForImages(service);
        setImageDialogOpen(true);
        // Fetch images for this service
        try {
            const response = await axios.get(`http://localhost:5000/api/hinh-anh-dich-vu/get/${service.MaDichVu}`);
            setServiceImages(response.data);
        } catch (err) {
            console.error("Error fetching images:", err);
            setServiceImages([]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedFiles.length > 10) {
            toast.error("Chỉ được upload tối đa 10 ảnh!");
            return;
        }
        
        setSelectedFiles(prev => [...prev, ...files]);
        
        // Create preview URLs
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleUploadImages = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Vui lòng chọn ít nhất 1 ảnh!");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            await axios.post(
                `http://localhost:5000/api/hinh-anh-dich-vu/upload/${selectedServiceForImages.MaDichVu}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            toast.success(`Upload thành công ${selectedFiles.length} ảnh!`);
            
            // Refresh images list
            const response = await axios.get(`http://localhost:5000/api/hinh-anh-dich-vu/get/${selectedServiceForImages.MaDichVu}`);
            setServiceImages(response.data);
            
            // Reload services to update image count
            await reloadServices();
            
            // Clear selected files
            setSelectedFiles([]);
            previewUrls.forEach(url => URL.revokeObjectURL(url));
            setPreviewUrls([]);
        } catch (err) {
            console.error("Error uploading images:", err);
            toast.error("Có lỗi xảy ra khi upload ảnh!");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (maHinhAnh: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/hinh-anh-dich-vu/delete/${maHinhAnh}`);
            toast.success("Xóa ảnh thành công!");
            
            // Refresh images list
            const response = await axios.get(`http://localhost:5000/api/hinh-anh-dich-vu/get/${selectedServiceForImages.MaDichVu}`);
            setServiceImages(response.data);
            
            // Reload services to update image count
            await reloadServices();
        } catch (err) {
            console.error("Error deleting image:", err);
            toast.error("Có lỗi xảy ra khi xóa ảnh!");
        }
    };

    const handleSetMainImage = async (maHinhAnh: string) => {
        try {
            await axios.put(`http://localhost:5000/api/hinh-anh-dich-vu/set-main/${maHinhAnh}`);
            toast.success("Đặt ảnh chính thành công!");
            
            // Refresh images list
            const response = await axios.get(`http://localhost:5000/api/hinh-anh-dich-vu/get/${selectedServiceForImages.MaDichVu}`);
            setServiceImages(response.data);
        } catch (err) {
            console.error("Error setting main image:", err);
            toast.error("Có lỗi xảy ra!");
        }
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
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="TrangThai" className="text-right col-span-2">
                                            Trạng thái
                                        </Label>
                                        <select
                                            id="TrangThai"
                                            onChange={handleInputChange2}
                                            className="col-span-4"
                                            defaultValue="Đang hoạt động"
                                        >
                                            <option value="Đang hoạt động">Đang hoạt động</option>
                                            <option value="Dừng hoạt động">Dừng hoạt động</option>
                                        </select>
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
                                        <TableHead>Hình ảnh</TableHead>
                                        <TableHead>Trạng thái</TableHead>
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
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-1">
                                                    <ImageIcon className="h-4 w-4 text-gray-500" />
                                                    <span className="text-sm">{services.SoLuongHinh || 0}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    services.TrangThai === 'Đang hoạt động' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {services.TrangThai || 'Đang hoạt động'}
                                                </span>
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
                                                        <DropdownMenuItem onClick={() => handleImageManageClick(services)}>Quản lý ảnh</DropdownMenuItem>
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
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="TrangThai" className="text-right col-span-2">
                                Trạng thái
                            </Label>
                            <select
                                id="TrangThai"
                                onChange={handleInputChange2}
                                className="col-span-4"
                                defaultValue={service.TrangThai || 'Đang hoạt động'}
                            >
                                <option value="Đang hoạt động">Đang hoạt động</option>
                                <option value="Dừng hoạt động">Dừng hoạt động</option>
                            </select>
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

            {/* Image Management Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Quản lý ảnh dịch vụ: {selectedServiceForImages?.TenDichVu}</DialogTitle>
                        <DialogDescription>
                            Upload và quản lý ảnh cho dịch vụ này (tối đa 10 ảnh)
                        </DialogDescription>
                    </DialogHeader>

                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-center">
                            <label className="flex flex-col items-center gap-2 cursor-pointer">
                                <Upload className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-600">
                                    Nhấn để chọn ảnh (tối đa 10 ảnh, mỗi ảnh &lt; 5MB)
                                </span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {/* Preview Selected Files */}
                        {previewUrls.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Ảnh đã chọn ({previewUrls.length}):</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {previewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={handleUploadImages}
                                    disabled={uploading}
                                    className="w-full"
                                >
                                    {uploading ? "Đang upload..." : `Upload ${previewUrls.length} ảnh`}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Existing Images */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Ảnh hiện có ({serviceImages.length}):</p>
                        {serviceImages.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Chưa có ảnh nào</p>
                        ) : (
                            <div className="grid grid-cols-4 gap-3">
                                {serviceImages.map((image: any) => (
                                    <div key={image.MaHinhAnh} className="relative group border rounded-lg overflow-hidden">
                                        <img
                                            src={image.URL}
                                            alt={`Service image ${image.ThuTu}`}
                                            className="w-full h-32 object-cover"
                                        />
                                        {image.LaAnhChinh === 1 && (
                                            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                Ảnh chính
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            {image.LaAnhChinh !== 1 && (
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleSetMainImage(image.MaHinhAnh)}
                                                    className="flex-1 text-xs h-7"
                                                >
                                                    Đặt làm chính
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteImage(image.MaHinhAnh)}
                                                className="text-xs h-7"
                                            >
                                                Xóa
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setImageDialogOpen(false);
                            setSelectedFiles([]);
                            previewUrls.forEach(url => URL.revokeObjectURL(url));
                            setPreviewUrls([]);
                        }}>
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster />
        </>
    )
}