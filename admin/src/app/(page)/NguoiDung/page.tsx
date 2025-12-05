"use client"
import { useEffect, useState } from "react"
import React from "react"
import { sha3_512 } from "js-sha3";
import Image from "next/image"
import {
    MoreHorizontal,
    PlusCircle,
    Search,
    UserIcon,
} from "lucide-react"
import { RoleGuard } from "@/components/features/role-guard"
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


export default function User() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [newUser, setNewUser] = useState({
        HoTen: "",
        SDT: "",
        Email: "",
        NgaySinh: "",
        MatKhau: "",
        DiaChi: "",
        VaiTro: "",
        AnhDaiDien: ""
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");


    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(newUser);
        const { id, value } = e.target;
        setNewUser((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (userId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        try {
            const response = await axios.post(
                'http://localhost:5000/api/upload/by-user?folder=NguoiDungAvatar&prefix=avatar',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const filteredUsers = users.filter((user: any) => {
        const term = searchTerm.toLowerCase();
        const hoTen = user.HoTen?.toLowerCase() || "";
        const email = user.Email?.toLowerCase() || "";

        return hoTen.includes(term) || email.includes(term);
    });

    useEffect(() => {
        // Lấy danh sách Người dùng
        axios.get("http://localhost:5000/api/nguoi-dung/get")
            .then(users => setUsers(users.data))
            .catch(err => console.log(err))
    }, []);

    const handleDeleteClick = (user: React.SetStateAction<null>) => {
        setSelectedUser(user);
        setShowAlert(true);
    }

    const handleEditClick = (user: any) => {
        setUser(user);
        const formattedDate = user.NgaySinh ? user.NgaySinh.split('T')[0] : '';
        setNewUser({
            HoTen: user.HoTen,
            SDT: user.SDT,
            Email: user.Email,
            NgaySinh: formattedDate,
            MatKhau: user.MatKhau,
            DiaChi: user.DiaChi,
            VaiTro: user.VaiTro,
            AnhDaiDien: user.AnhDaiDien || ""
        });
        setImagePreview(user.AnhDaiDien || "");
        setImageFile(null);
        setShowAlertEdit(true);
    }

    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }

    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedUser(null);
    }

    const handleConfirmEdit = async () => {
        try {
            // Upload ảnh mới nếu có
            if (imageFile) {
                console.log("📸 Uploading new image, old URL:", user.AnhDaiDien);

                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('userId', user.MaNguoiDung);

                // Thêm oldFileUrl nếu đã có ảnh cũ
                if (user.AnhDaiDien) {
                    formData.append('oldFileUrl', user.AnhDaiDien);
                }

                const uploadResponse = await axios.post(
                    'http://localhost:5000/api/upload/by-user?folder=NguoiDungAvatar&prefix=avatar',
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );

                newUser.AnhDaiDien = uploadResponse.data.url;
                console.log("✅ New image uploaded:", newUser.AnhDaiDien);
            }

            const maNguoiDung = user.MaNguoiDung;
            console.log("📤 Dữ liệu gửi lên server:", newUser);
            console.log("🖼️ AnhDaiDien sẽ update:", newUser.AnhDaiDien);
            await axios.put(`http://localhost:5000/api/nguoi-dung/update/${maNguoiDung}`, newUser);
            toast.success("Cập nhật người dùng thành công!");
            
            const response = await axios.get("http://localhost:5000/api/nguoi-dung/get");
            setUsers(response.data);
            
            setNewUser({
                HoTen: "",
                SDT: "",
                Email: "",
                NgaySinh: "",
                MatKhau: "",
                DiaChi: "",
                VaiTro: "",
                AnhDaiDien: ""
            });
            setImageFile(null);
            setImagePreview("");
            setShowAlertEdit(false);
        } catch (err: any) {
            console.error("Error editing user:", err);
            toast.error(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật người dùng!");
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;

        try {
            // Xóa ảnh từ Firebase nếu có
            if (selectedUser.AnhDaiDien) {
                try {
                    console.log("🗑️ Đang xóa ảnh:", selectedUser.AnhDaiDien);
                    await axios.delete('http://localhost:5000/api/upload', {
                        data: { fileUrl: selectedUser.AnhDaiDien.trim() }
                    });
                    console.log("✅ Xóa ảnh thành công");
                } catch (error: any) {
                    console.error("❌ Lỗi xóa ảnh:", error.response?.data || error.message);
                }
            }

            await axios.delete(`http://localhost:5000/api/nguoi-dung/delete/${selectedUser.MaNguoiDung}`);
            toast.success("Xóa người dùng thành công!");
            
            const response = await axios.get("http://localhost:5000/api/nguoi-dung/get");
            setUsers(response.data);
            
            setNewUser({
                HoTen: "",
                SDT: "",
                Email: "",
                NgaySinh: "",
                MatKhau: "",
                DiaChi: "",
                VaiTro: "",
                AnhDaiDien: ""
            });
            setShowAlert(false);
            setSelectedUser(null);
        } catch (error: any) {
            console.error("Error deleting user:", error);
            toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa người dùng!");
        }
    };

    const handleCreateUser = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/nguoi-dung/create", newUser);
            const newMaNguoiDung = response.data.data.insertId;

            // Upload ảnh nếu có
            if (imageFile && newMaNguoiDung) {
                const imageUrl = await uploadImage(newMaNguoiDung.toString(), imageFile);
                await axios.put(`http://localhost:5000/api/nguoi-dung/update/${newMaNguoiDung}`, {
                    ...newUser,
                    AnhDaiDien: imageUrl
                });
            }

            toast.success("Thêm người dùng thành công!");
            
            // Reload users list
            const refreshData = await axios.get("http://localhost:5000/api/nguoi-dung/get");
            setUsers(refreshData.data);
            
            // Reset form
            setNewUser({
                HoTen: "",
                SDT: "",
                Email: "",
                NgaySinh: "",
                MatKhau: "",
                DiaChi: "",
                VaiTro: "",
                AnhDaiDien: ""
            });
            setImageFile(null);
            setImagePreview("");
            setDialogOpen(false);
        } catch (err: any) {
            console.error("Error creating user:", err);
            console.error("Error response:", err.response?.data);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Có lỗi xảy ra khi thêm người dùng");
            }
        }
    };

    return (
        <RoleGuard allowedRoles={["Quản lý"]}>
            <title>Quản Lý Người Dùng</title>
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">Tất cả</TabsTrigger>
                    </TabsList>

                    <div className="ml-auto flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm theo tên hoặc Email..."
                                className="w-full pl-8 md:w-[250px] lg:w-[350px]"
                                onChange={handleSearchChange}
                                value={searchTerm}
                            />
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="h-7 gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                        Thêm người dùng
                                    </span>
                                </Button>
                            </DialogTrigger>

                            {/* Dialog Thêm Người Dùng */}
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Thêm người dùng</DialogTitle>
                                    <DialogDescription>
                                        Thêm người dùng mới vào danh sách.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="avatar" className="text-right col-span-2">
                                            Ảnh đại diện
                                        </Label>
                                        <div className="col-span-4">
                                            <Input
                                                id="avatar"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="cursor-pointer"
                                            />
                                            {imagePreview && (
                                                <div className="mt-2">
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        width={80}
                                                        height={80}
                                                        className="rounded-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="VaiTro" className="text-right col-span-2">
                                            Vai trò
                                        </Label>
                                        <select
                                            id="VaiTro"
                                            onChange={handleInputChange2}
                                            className="col-span-4 border border-input p-2 rounded-md"
                                            value={newUser.VaiTro}
                                        >
                                            <option value="">Chọn vai trò</option>
                                            <option value="Lễ tân">Lễ tân</option>
                                            <option value="Quản lý">Quản lý</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="HoTen" className="text-right col-span-2">
                                            Họ và Tên
                                        </Label>
                                        <Input onChange={handleInputChange} id="HoTen" type="text" className="col-span-4" value={newUser.HoTen} />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="Email" className="text-right col-span-2">
                                            Email
                                        </Label>
                                        <Input onChange={handleInputChange} id="Email" type="text" className="col-span-4" value={newUser.Email} />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="SDT" className="text-right col-span-2">
                                            Số điện thoại
                                        </Label>
                                        <Input onChange={handleInputChange} id="SDT" type="text" className="col-span-4" value={newUser.SDT} />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="NgaySinh" className="text-right col-span-2">
                                            Ngày sinh
                                        </Label>
                                        <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" value={newUser.NgaySinh} />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="DiaChi" className="text-right col-span-2">
                                            Địa chỉ
                                        </Label>
                                        <Input onChange={handleInputChange} id="DiaChi" type="text" className="col-span-4" value={newUser.DiaChi} />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MatKhau" className="text-right col-span-2">
                                            Mật khẩu
                                        </Label>
                                        <Input onChange={handleInputChange} id="MatKhau" type="password" className="col-span-4" value={newUser.MatKhau} />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreateUser}>
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
                            <CardTitle>Danh sách người dùng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Ảnh</TableHead>
                                        <TableHead>Vai trò</TableHead>
                                        <TableHead>Họ và Tên</TableHead>
                                        <TableHead>Số điện thoại</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Ngày sinh</TableHead>
                                        <TableHead>Địa chỉ</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user: any) => (
                                        <TableRow key={user.MaNguoiDung}>
                                            <TableCell>
                                                {user.AnhDaiDien ? (
                                                    <Image
                                                        src={user.AnhDaiDien}
                                                        alt={user.HoTen}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <UserIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.VaiTro}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.HoTen}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.SDT}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {user.Email}
                                            </TableCell>
                                            <TableCell>
                                                {user.NgaySinh ? user.NgaySinh.split('T')[0] : ''}
                                            </TableCell>
                                            <TableCell>{user.DiaChi}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(user)}>Sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* AlertDialog Xóa */}
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác Nhận Xóa Người Dùng</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác.
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

            {/* AlertDialog Sửa */}
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sửa thông tin người dùng</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="avatar-edit" className="text-right col-span-2">
                                Ảnh đại diện
                            </Label>
                            <div className="col-span-4">
                                <Input
                                    id="avatar-edit"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="cursor-pointer"
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Dropdown Chức vụ (Edit) */}
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="VaiTro" className="text-right col-span-2">
                                Vai trò
                            </Label>
                            <select
                                id="VaiTro"
                                onChange={handleInputChange2}
                                className="col-span-4 border border-input p-2 rounded-md"
                                defaultValue={newUser.VaiTro}
                            >
                                <option value="">Chọn vai trò</option>
                                <option value="Lễ tân">Lễ tân</option>
                                <option value="Quản lý">Quản lý</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="HoTen" className="text-right col-span-2">
                                Họ và Tên
                            </Label>
                            <Input onChange={handleInputChange} id="HoTen" type="text" className="col-span-4" defaultValue={newUser.HoTen} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="Email" className="text-right col-span-2">
                                Email
                            </Label>
                            <Input onChange={handleInputChange} id="Email" type="text" className="col-span-4" defaultValue={newUser.Email} readOnly />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="SDT" className="text-right col-span-2">
                                Số điện thoại
                            </Label>
                            <Input onChange={handleInputChange} id="SDT" type="text" className="col-span-4" defaultValue={newUser.SDT} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="NgaySinh" className="text-right col-span-2">
                                Ngày sinh
                            </Label>
                            {/* Giá trị NgaySinh đã được format YYYY-MM-DD trong handleEditClick */}
                            <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" defaultValue={newUser.NgaySinh} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="DiaChi" className="text-right col-span-2">
                                Địa chỉ
                            </Label>
                            <Input onChange={handleInputChange} id="DiaChi" type="text" className="col-span-4" defaultValue={newUser.DiaChi} />
                        </div>
                        <Input id="MatKhau" type="hidden" defaultValue={newUser.MatKhau} />
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
        </RoleGuard>
    )
}