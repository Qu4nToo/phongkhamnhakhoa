"use client"
import { useEffect, useState } from "react"
import React from "react"
import { sha3_512 } from "js-sha3";
import {
  MoreHorizontal,
  PlusCircle,
  Search,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Pagination } from "@/components/ui/pagination"
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
  const [user, setUser] = useState<any>([]); // User đang được chỉnh sửa
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertEdit, setShowAlertEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State mới cho tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [newUser, setNewUser] = useState({
    HoTen: "",
    SoDienThoai: "",
    Email: "",
    NgaySinh: "",
    MatKhau: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Phân trang
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/khach-hang/get")
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
    console.log("User to edit:", user);
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
    // Gửi dữ liệu cập nhật
    axios.put(`http://localhost:5000/api/khach-hang/update/${user.MaKhachHang}`, newUser)
      .then(() => {
        toast.success("Cập nhật khách hàng thành công!");
        // Tải lại danh sách
        axios.get("http://localhost:5000/api/khach-hang/get")
          .then((response) => setUsers(response.data))
          .catch((err) => console.error("Error fetching users:", err));
        setNewUser({
          HoTen: "",
          SoDienThoai: "",
          Email: "",
          NgaySinh: "",
          MatKhau: ""
        });
        setShowAlertEdit(false);
      })
      .catch((err) => {
        console.error("Error editing user:", err);
        if(err?.response?.data?.message){
          toast.error(err.response.data.message);
          return;
        }
        toast.error("Có lỗi xảy ra khi cập nhật khách hàng!");
      });
  }

  const handleConfirmDelete = () => {
    if (selectedUser) {
      axios.delete(`http://localhost:5000/api/khach-hang/delete/${selectedUser.MaKhachHang}`)
        .then(() => {
          toast.success("Xóa khách hàng thành công!");
          axios.get("http://localhost:5000/api/khach-hang/get")
            .then((response) => setUsers(response.data))
            .catch((err) => console.error("Error fetching users:", err));
          setShowAlert(false);
          setNewUser({
            HoTen: "",
            SoDienThoai: "",
            Email: "",
            NgaySinh: "",
            MatKhau: ""
          });
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          toast.error("Có lỗi xảy ra khi xóa khách hàng!");
        });
    }
  };

  const handleCreateUser = () => {
    const userToCreate = {
      ...newUser,
      MatKhau: sha3_512(newUser.MatKhau) // hash mật khẩu
    };
    axios.post("http://localhost:5000/api/khach-hang/create", userToCreate)
      .then(() => {
        toast.success("Thêm khách hàng thành công!");
        axios.get("http://localhost:5000/api/khach-hang/get")
          .then((response) => setUsers(response.data))
          .catch((err) => console.error("Error fetching users:", err));
        setNewUser({
          HoTen: "",
          SoDienThoai: "",
          Email: "",
          NgaySinh: "",
          MatKhau: ""
        });
        setDialogOpen(false);
        toast.success("User created successfully!");
      })
      .catch((err) => console.error("Error creating user:", err));
  };

  return (
    <RoleGuard allowedRoles={["Quản lý"]}>
      <title>Quản Lý Khách Hàng</title>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">Tất cả</TabsTrigger>
          </TabsList>

          {/* Phần Tìm kiếm và Nút Thêm */}
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
                    Thêm khách hàng
                  </span>
                </Button>
              </DialogTrigger>

              {/* Dialog Thêm Khách Hàng (Giữ nguyên) */}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm khách hàng</DialogTitle>
                  <DialogDescription>
                    Thêm khách hàng mới vào danh sách.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <Label htmlFor="SoDienThoai" className="text-right col-span-2">
                      Số điện thoại
                    </Label>
                    <Input onChange={handleInputChange} id="SoDienThoai" type="text" className="col-span-4" value={newUser.SoDienThoai} />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="NgaySinh" className="text-right col-span-2">
                      Ngày sinh
                    </Label>
                    <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" value={newUser.NgaySinh} />
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
              <CardTitle>Danh sách khách hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ và Tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {/* Dùng paginatedUsers để hiển thị kết quả phân trang */}
                <TableBody>
                  {paginatedUsers.map((user: any) => (
                    <TableRow key={user.MaKhachHang}>
                      <TableCell className="font-medium">
                        {user.HoTen}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.SoDienThoai}
                      </TableCell>
                      <TableCell className="font-medium">
                        {user.Email}
                      </TableCell>
                      <TableCell>
                        {/* Hiển thị ngày sinh ở định dạng YYYY-MM-DD */}
                        {user.NgaySinh ? user.NgaySinh.split('T')[0] : ''}
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
            <CardFooter>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredUsers.length}
              />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AlertDialog Xóa */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa Khách Hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng này không? Hành động này không thể hoàn tác.
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
            <AlertDialogTitle>Sửa thông tin khách hàng</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="HoTen" className="text-right col-span-2">
                Họ và Tên
              </Label>
              {/* Dùng newUser.HoTen làm giá trị và handleInputChange để cập nhật */}
              <Input onChange={handleInputChange} id="HoTen" type="text" className="col-span-4" defaultValue={newUser.HoTen} readOnly/>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="Email" className="text-right col-span-2">
                Email
              </Label>
              <Input onChange={handleInputChange} id="Email" type="text" className="col-span-4" defaultValue={newUser.Email} readOnly/>
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="SoDienThoai" className="text-right col-span-2">
                Số điện thoại
              </Label>
              <Input onChange={handleInputChange} id="SoDienThoai" type="text" className="col-span-4" defaultValue={newUser.SoDienThoai} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="NgaySinh" className="text-right col-span-2">
                Ngày sinh
              </Label>
              {/* Giá trị NgaySinh đã được format YYYY-MM-DD trong handleEditClick */}
              <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" defaultValue={newUser.NgaySinh} />
            </div>
            {/* MatKhau (hidden) - dùng để giữ nguyên mật khẩu cũ nếu không muốn đổi */}
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