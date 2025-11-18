"use client"
import { useEffect, useState } from "react"
import React from "react"
import { sha3_512 } from "js-sha3";
import {
    MoreHorizontal,
    PlusCircle,
    Search, // Import Search icon
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
        VaiTro: ""
    });


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
            ...user,
            NgaySinh: formattedDate,
        });
        setShowAlertEdit(true);
    }

    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }

    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedUser(null);
    }

    const handleConfirmEdit = () => {
        const maNguoiDung = user.MaNguoiDung;
        axios.put(`http://localhost:5000/api/nguoi-dung/update/${maNguoiDung}`, newUser)
            .then(() => {
                toast("User Edited: User information has been updated.");
                axios.get("http://localhost:5000/api/nguoi-dung/get")
                    .then((response) => setUsers(response.data))
                    .catch((err) => console.error("Error fetching users:", err));
                setNewUser({
                    HoTen: "",
                    SDT: "",
                    Email: "",
                    NgaySinh: "",
                    MatKhau: "",
                    DiaChi: "",
                    VaiTro: ""
                });
                setShowAlertEdit(false);
            })
            .catch((err) => {
                console.error("Error editing user:", err);
                toast("Edit Failed: There was an error updating the user.");
            });
    }

    const handleConfirmDelete = () => {
        if (selectedUser) {
            axios.delete(`http://localhost:5000/api/nguoi-dung/delete/${selectedUser.MaNguoiDung}`)
                .then(() => {
                    toast("User Deleted: User has been deleted.");
                    axios.get("http://localhost:5000/api/nguoi-dung/get")
                        .then((response) => setUsers(response.data))
                        .catch((err) => console.error("Error fetching users:", err));
                    setNewUser({
                        HoTen: "",
                        SDT: "",
                        Email: "",
                        NgaySinh: "",
                        MatKhau: "",
                        DiaChi: "",
                        VaiTro: ""
                    });
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting user:", err);
                    toast("Delete Failed: There was an error deleting the user.");
                });
        }
    };

    const handleCreateUser = async () => {
        try {
            await axios.post("http://localhost:5000/api/nguoi-dung/create", newUser);
            toast("User Created: New User has been added successfully.");
            
            // Reload users list
            const response = await axios.get("http://localhost:5000/api/nguoi-dung/get");
            setUsers(response.data);
            
            // Reset form
            setNewUser({
                HoTen: "",
                SDT: "",
                Email: "",
                NgaySinh: "",
                MatKhau: "",
                DiaChi: "",
                VaiTro: ""
            });
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
        <>
            <title>User</title>
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
                            <CardTitle>Danh sách người dùng</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
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
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
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
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this user?
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

            {/* AlertDialog Sửa */}
            <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Sửa thông tin người dùng</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
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