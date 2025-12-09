"use client"
import { useEffect, useState } from "react"
import React from "react"
import { sha3_512 } from "js-sha3";
import Image from "next/image"
import {
  MoreHorizontal,
  PlusCircle,
  Search,
  Trash2,
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
  CardDescription,
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
import { ScrollArea } from "@/components/ui/scroll-area";



export default function User() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState<any>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertEdit, setShowAlertEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAlertService, setShowAlertService] = useState(false);
  const [showAddServiceDialog, setShowAddServiceDialog] = useState(false);
  const [showDeleteServiceDialog, setShowDeleteServiceDialog] = useState(false);
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [selectedDichVu, setSelectedDichVu] = useState("");
  const [selectedServiceToDelete, setSelectedServiceToDelete] = useState<string>("");
  const [dichVuList, setDichVuList] = useState<any[]>([]);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [showDeleteScheduleDialog, setShowDeleteScheduleDialog] = useState(false);
  const [scheduleList, setScheduleList] = useState<any[]>([]);
  const [selectedScheduleToDelete, setSelectedScheduleToDelete] = useState<string>("");
  const [newSchedule, setNewSchedule] = useState({
    ThuTrongTuan: ""
  });

  const [newUser, setNewUser] = useState({
    HoTen: "",
    SoDienThoai: "",
    Email: "",
    NgaySinh: "",
    MatKhau: "",
    KinhNghiem: "",
    DiaChi: "",
    AnhDaiDien: "",
    ChuyenKhoa: "",
    BangCap: "",
    ChuyenMon: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const formatPrice = (price: any): string => {
    // Kiểm tra và chuyển đổi giá trị đầu vào
    const numPrice = Number(price);

    if (price === null || price === undefined || isNaN(numPrice)) {
      return "0 VND";
    }

    // Định dạng giá sử dụng Intl.NumberFormat
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0, // Không cólp=
      // -n thập phân
    });

    // Loại bỏ ký hiệu "₫" mặc định
    return formatter.format(numPrice).replace('₫', 'VND').trim();
  };

  const filteredUsers = users.filter((user: any) => {
    const term = searchTerm.toLowerCase();
    const hoTen = user.HoTen?.toLowerCase() || "";
    const email = user.Email?.toLowerCase() || "";

    return hoTen.includes(term) || email.includes(term);
  });

  const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [id]: value,
    }));
    console.log(newUser);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;

    const { value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [id]: value,
    }));
    console.log(newUser);
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
    formData.append('avatar', file);

    try {
      const token = sessionStorage.getItem('access_token');
      const response = await axios.put(
        `http://localhost:5000/api/bac-si/update-avatar/${userId}`,
        formData,
        { 
          headers: { 
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      return response.data.avatarUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };


  useEffect(() => {
    axios.get("http://localhost:5000/api/bac-si/get")
      .then(users => setUsers(users.data))
      .catch(err => console.log(err))
    axios.get("http://localhost:5000/api/dich-vu/get")
      .then(response => setDichVuList(response.data))
      .catch(err => console.error("Error fetching services:", err));
  }, []);
  const handleServiceClick = (user: any) => {
    console.log("🔍 Selected User:", user);
    console.log("🔍 MaBacSi:", user.MaBacSi);
    setSelectedUser(user);

    const apiUrl = `http://localhost:5000/api/chi-tiet-dich-vu/getByBacSiId/${user.MaBacSi}`;
    console.log("🔍 API URL:", apiUrl);

    axios.get(apiUrl)
      .then(response => {
        const data = Array.isArray(response.data) ? response.data : [];
        setServiceList(data);
      })
      .catch(err => {
        console.error("API Error:", err);
        console.error("Error Response:", err.response);
        setServiceList([]);
      });
    setShowAlertService(true);
  }
  const handleDeleteClick = (user: React.SetStateAction<null>) => {
    console.log(user);
    setSelectedUser(user);
    setShowAlert(true);
  }
  const handleEditClick = (user: any) => {
    setUser(user);
    setNewUser(user);
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
        console.log("📸 Uploading new image for doctor:", user.MaBacSi);
        const avatarUrl = await uploadImage(user.MaBacSi, imageFile);
        newUser.AnhDaiDien = avatarUrl;
        console.log("✅ New image uploaded:", newUser.AnhDaiDien);
      }

      await axios.put(`http://localhost:5000/api/bac-si/update/${user.MaBacSi}`, newUser);
      toast.success("Cập nhật bác sĩ thành công!");

      const response = await axios.get("http://localhost:5000/api/bac-si/get");
      setUsers(response.data);
      setImageFile(null);
      setImagePreview("");
      setShowAlertEdit(false);
    } catch (err: any) {
      console.error("Error editing user:", err);
      toast.error(err.response?.data?.message || "Có lỗi xảy ra khi cập nhật bác sĩ");
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      // Avatar sẽ tự động bị xóa khi xóa bác sĩ
      await axios.delete(`http://localhost:5000/api/bac-si/delete/${selectedUser.MaBacSi}`);
      toast.success("Xóa bác sĩ thành công!");

      const response = await axios.get("http://localhost:5000/api/bac-si/get");
      setUsers(response.data);
      setShowAlert(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi xóa bác sĩ");
    }
  };
  const handleCreateUser = async () => {
    console.log(newUser);
    try {
      const response = await axios.post("http://localhost:5000/api/bac-si/create", newUser);
      const newMaBacSi = response.data.MaBacSi;

      // Upload ảnh nếu có
      if (imageFile && newMaBacSi) {
        await uploadImage(newMaBacSi, imageFile);
      }

      toast.success("Thêm bác sĩ thành công!");
      const refreshData = await axios.get("http://localhost:5000/api/bac-si/get");
      setUsers(refreshData.data);

      setNewUser({
        HoTen: "",
        SoDienThoai: "",
        Email: "",
        NgaySinh: "",
        MatKhau: "",
        KinhNghiem: "",
        DiaChi: "",
        AnhDaiDien: "",
        ChuyenKhoa: "",
        BangCap: "",
        ChuyenMon: ""
      });
      setImageFile(null);
      setImagePreview("");
      setDialogOpen(false);
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Có lỗi xảy ra khi tạo bác sĩ");
    }
  };

  const handleAddService = async () => {
    if (!selectedDichVu) {
      toast.error("Vui lòng chọn dịch vụ!");
      return;
    }

    if (!selectedUser?.MaBacSi) {
      toast.error("Không tìm thấy thông tin bác sĩ!");
      return;
    }

    try {
      const dataToSend = {
        MaBacSi: selectedUser.MaBacSi,
        MaDichVu: selectedDichVu,
        GhiChu: "",
      };
      console.log("📤 Sending data:", dataToSend);
      await axios.post("http://localhost:5000/api/chi-tiet-dich-vu/create", dataToSend);

      toast.success("Thêm dịch vụ thành công!");
      const response = await axios.get(`http://localhost:5000/api/chi-tiet-dich-vu/getByBacSiId/${selectedUser.MaBacSi}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setServiceList(data);
      setSelectedDichVu("");
      setShowAddServiceDialog(false);
    } catch (err: any) {
      console.error("❌ Error adding service:", err);
      if (err.response?.status === 409) {
        toast.error("Bác sĩ này đã có dịch vụ này rồi!");
      } else {
        toast.error(err.response?.data?.message || "Có lỗi xảy ra khi thêm dịch vụ!");
      }
    }
  };

  const handleDeleteServiceClick = (maBSDV: string) => {
    setSelectedServiceToDelete(maBSDV);
    setShowDeleteServiceDialog(true);
  };

  const handleConfirmDeleteService = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/chi-tiet-dich-vu/delete/${selectedServiceToDelete}`);
      toast.success("Xóa dịch vụ thành công!");
      const response = await axios.get(`http://localhost:5000/api/chi-tiet-dich-vu/getByBacSiId/${selectedUser.MaBacSi}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setServiceList(data);
      setShowDeleteServiceDialog(false);
      setSelectedServiceToDelete("");
    } catch (err: any) {
      console.error("❌ Error deleting service:", err);
      toast.error("Có lỗi xảy ra khi xóa dịch vụ!");
    }
  };

  // Lịch làm việc handlers
  const handleScheduleClick = async (user: any) => {
    setSelectedUser(user);
    try {
      const response = await axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${user.MaBacSi}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setScheduleList(data);
      setShowScheduleDialog(true);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setScheduleList([]);
      setShowScheduleDialog(true);
    }
  };

  const handleAddSchedule = async () => {
    if (!newSchedule.ThuTrongTuan) {
      toast.error("Vui lòng chọn ngày làm việc!");
      return;
    }

    try {
      const dataToSend = {
        MaBacSi: selectedUser.MaBacSi,
        ThuTrongTuan: newSchedule.ThuTrongTuan
      };
      await axios.post("http://localhost:5000/api/lich-lam-viec/create", dataToSend);
      toast.success("Thêm lịch làm việc thành công!");

      const response = await axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${selectedUser.MaBacSi}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setScheduleList(data);
      setNewSchedule({ ThuTrongTuan: "" });
      setShowAddScheduleDialog(false);
    } catch (err: any) {
      console.error("Error adding schedule:", err);
      toast.error("Có lỗi xảy ra khi thêm lịch làm việc!");
    }
  };

  const handleDeleteScheduleClick = (maLichLamViec: string) => {
    setSelectedScheduleToDelete(maLichLamViec);
    setShowDeleteScheduleDialog(true);
  };

  const handleConfirmDeleteSchedule = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/lich-lam-viec/delete/${selectedScheduleToDelete}`);
      toast.success("Xóa lịch làm việc thành công!");
      const response = await axios.get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${selectedUser.MaBacSi}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setScheduleList(data);
      setShowDeleteScheduleDialog(false);
      setSelectedScheduleToDelete("");
    } catch (err: any) {
      console.error("Error deleting schedule:", err);
      toast.error("Có lỗi xảy ra khi xóa lịch làm việc!");
    }
  };

  const days = [
    { value: "Chủ Nhật", label: "Chủ Nhật" },
    { value: "Thứ Hai", label: "Thứ Hai" },
    { value: "Thứ Ba", label: "Thứ Ba" },
    { value: "Thứ Tư", label: "Thứ Tư" },
    { value: "Thứ Năm", label: "Thứ Năm" },
    { value: "Thứ Sáu", label: "Thứ Sáu" },
    { value: "Thứ Bảy", label: "Thứ Bảy" }
  ];

  return (
    <RoleGuard allowedRoles={["Quản lý"]}>
      <title>Quản Lý Bác Sĩ</title>
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
                    Thêm bác sĩ
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Thêm Bác Sĩ Mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin để thêm bác sĩ mới vào hệ thống.
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
                    <Label htmlFor="HoTen" className="text-right col-span-2">
                      Họ và Tên
                    </Label>
                    <Input onChange={handleInputChange} id="HoTen" type="text" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="Email" className="text-right col-span-2">
                      Email
                    </Label>
                    <Input onChange={handleInputChange} id="Email" type="text" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="SoDienThoai" className="text-right col-span-2">
                      Số điện thoại
                    </Label>
                    <Input onChange={handleInputChange} id="SoDienThoai" type="text" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="NgaySinh" className="text-right col-span-2">
                      Ngày sinh
                    </Label>
                    <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="KinhNghiem" className="text-right col-span-2">
                      Kinh nghiệm
                    </Label>
                    <Input onChange={handleInputChange} id="KinhNghiem" type="text" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="DiaChi" className="text-right col-span-2">
                      Địa chỉ
                    </Label>
                    <Input onChange={handleInputChange} id="DiaChi" type="text" className="col-span-4" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="ChuyenKhoa" className="text-right col-span-2">
                      Chuyên khoa
                    </Label>
                    <Input onChange={handleInputChange} id="ChuyenKhoa" type="text" className="col-span-4" placeholder="VD: Nha khoa tổng quát" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="BangCap" className="text-right col-span-2">
                      Bằng cấp
                    </Label>
                    <Input onChange={handleInputChange} id="BangCap" type="text" className="col-span-4" placeholder="VD: Đại học Y Hà Nội" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="ChuyenMon" className="text-right col-span-2">
                      Chuyên môn
                    </Label>
                    <Input onChange={handleInputChange} id="ChuyenMon" type="text" className="col-span-4" placeholder="VD: Chỉnh nha, Cấy ghép Implant" />
                  </div>
                  <div className="grid grid-cols-6 items-center gap-4">
                    <Label htmlFor="MatKhau" className="text-right col-span-2">
                      Mật khẩu
                    </Label>
                    <Input onChange={handleInputChange} id="MatKhau" type="text" className="col-span-4" />
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
              <CardTitle>Danh sách bác sĩ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Họ và Tên</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày sinh</TableHead>
                    <TableHead>Kinh nghiệm</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                {filteredUsers.map((users: any) => (
                  <TableBody key={users.MaBacSi}>
                    <TableRow>
                      <TableCell>
                        {users.AnhDaiDien ? (
                          <Image
                            src={users.AnhDaiDien}
                            alt={users.HoTen}
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
                      <TableCell className="hidden sm:table-cell">
                        {users.HoTen}
                      </TableCell>
                      <TableCell className="font-medium">
                        {users.SoDienThoai}
                      </TableCell>
                      <TableCell className="font-medium">
                        {users.Email}
                      </TableCell>
                      <TableCell>{users.NgaySinh}</TableCell>
                      <TableCell>{users.KinhNghiem}</TableCell>
                      <TableCell>{users.DiaChi}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleEditClick(users)}>Sửa</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(users)}>Xóa</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleServiceClick(users)}>Thêm dịch vụ</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleScheduleClick(users)}>Lịch làm việc</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                  </TableBody>
                ))}
              </Table>
            </CardContent>
            {/* <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                users
              </div>
            </CardFooter> */}
          </Card>
        </TabsContent>
      </Tabs>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa Bác Sĩ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bác sĩ này không? Hành động này không thể hoàn tác.
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
            <AlertDialogTitle>Chỉnh Sửa Thông Tin Bác Sĩ</AlertDialogTitle>
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
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="HoTen" className="text-right col-span-2">
                Họ và Tên
              </Label>
              <Input onChange={handleInputChange} id="HoTen" type="text" className="col-span-4" defaultValue={user.HoTen} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="Email" className="text-right col-span-2">
                Email
              </Label>
              <Input onChange={handleInputChange} id="Email" type="text" className="col-span-4" defaultValue={user.Email} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="SoDienThoai" className="text-right col-span-2">
                Số điện thoại
              </Label>
              <Input onChange={handleInputChange} id="SoDienThoai" type="text" className="col-span-4" defaultValue={user.SoDienThoai} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="NgaySinh" className="text-right col-span-2">
                Ngày sinh
              </Label>
              <Input onChange={handleInputChange} id="NgaySinh" type="date" className="col-span-4" defaultValue={user.NgaySinh} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="KinhNghiem" className="text-right col-span-2">
                Kinh nghiệm
              </Label>
              <Input onChange={handleInputChange} id="KinhNghiem" type="text" className="col-span-4" defaultValue={user.KinhNghiem} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="DiaChi" className="text-right col-span-2">
                Địa chỉ
              </Label>
              <Input onChange={handleInputChange} id="DiaChi" type="text" className="col-span-4" defaultValue={user.DiaChi} />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="ChuyenKhoa" className="text-right col-span-2">
                Chuyên khoa
              </Label>
              <Input onChange={handleInputChange} id="ChuyenKhoa" type="text" className="col-span-4" defaultValue={user.ChuyenKhoa} placeholder="VD: Nha khoa tổng quát" />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="BangCap" className="text-right col-span-2">
                Bằng cấp
              </Label>
              <Input onChange={handleInputChange} id="BangCap" type="text" className="col-span-4" defaultValue={user.BangCap} placeholder="VD: Đại học Y Hà Nội" />
            </div>
            <div className="grid grid-cols-6 items-center gap-4">
              <Label htmlFor="ChuyenMon" className="text-right col-span-2">
                Chuyên môn
              </Label>
              <Input onChange={handleInputChange} id="ChuyenMon" type="text" className="col-span-4" defaultValue={user.ChuyenMon} placeholder="VD: Chỉnh nha, Cấy ghép Implant" />
            </div>
            <Input onChange={handleInputChange} id="MatKhau" type="text" className="col-span-4" defaultValue={user.MatKhau} hidden />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertEditClose}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEdit}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showAlertService} onOpenChange={setShowAlertService} >
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogTitle>
            <div className="flex justify-start item-start space-y-1 flex-col ">
              <h1 className="text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
                Thêm dịch vụ
              </h1>
            </div>
          </AlertDialogTitle>

          <div className="mt-4 flex flex-col md:flex-row gap-8">

            <div className="w-full md:w-2/3 flex flex-col gap-6">

              <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <p className="text-lg font-semibold leading-6 text-gray-800">
                    Các Dịch Vụ Đã Có
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setShowAddServiceDialog(true)}
                    className="bg-black border text-white flex items-center gap-2 hover:bg-gray-200 hover:text-black border-black"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Thêm dịch vụ
                  </Button>
                </div>
                <ScrollArea className="h-60 w-full rounded-md border p-3 mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="sticky top-0 bg-gray-200 text-black">
                        <TableHead>Tên Dịch Vụ</TableHead>
                        <TableHead>Đơn Giá</TableHead>
                        <TableHead>Đơn Vị Tính</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {serviceList && serviceList.length > 0 ? (
                        serviceList.map((item: any, index: number) => (
                          <TableRow key={item.MaBSDV || index} className="bg-white">
                            <TableCell className="font-medium">{item.TenDichVu || "N/A"}</TableCell>
                            <TableCell>{formatPrice(item.Gia)}</TableCell>
                            <TableCell>{item.DonVi || "N/A"}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteServiceClick(item.MaBSDV)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                            Không có dịch vụ nào
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 px-4 py-6 md:p-6 flex flex-col gap-6">

              <div>
                <h3 className="text-xl font-semibold leading-5 text-gray-800">Bác sĩ</h3>
                <div className="flex flex-col justify-start items-start mt-4 space-y-4">
                  <div className="flex justify-start items-center space-x-4 w-full border-b border-gray-200 pb-4">

                    <UserIcon className="w-6 h-6" />
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      {selectedUser?.HoTen || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowAlertService(false)}>Đóng</Button>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog thêm dịch vụ */}
      <Dialog open={showAddServiceDialog} onOpenChange={setShowAddServiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Dịch Vụ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDichVu}
                onChange={(e) => setSelectedDichVu(e.target.value)}
              >
                <option value="">Chọn dịch vụ</option>
                {dichVuList
                  .filter((dv: any) => !serviceList.some((s: any) => s.MaDichVu === dv.MaDichVu)) // hàm some để kiểm tra trong list đã có chưa nếu có trả về true và !array.some để đảo ngược kết quả nếu chưa có trong list thì xuất ra
                  .map((dv: any) => (
                    <option key={dv.MaDichVu} value={dv.MaDichVu}>
                      {dv.TenDichVu} - {formatPrice(dv.Gia)} - {dv.DonVi}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowAddServiceDialog(false)}>
              Hủy
            </Button>
            <Button className="bg-black text-white border hover:text-black hover:bg-white border-black" onClick={handleAddService}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Service Confirmation Dialog */}
      <AlertDialog open={showDeleteServiceDialog} onOpenChange={setShowDeleteServiceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa dịch vụ</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa dịch vụ này khỏi bác sĩ không?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteServiceDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteService}
              className="bg-black text-white hover:bg-white hover:text-black border border-black"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Lịch Làm Việc */}
      <AlertDialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogTitle>
            <div className="flex justify-start item-start space-y-1 flex-col">
              <h1 className="text-3xl font-semibold leading-7 lg:leading-9 text-gray-800">
                Lịch Làm Việc
              </h1>
            </div>
          </AlertDialogTitle>

          <div className="mt-4 flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <div className="flex flex-col justify-start items-start bg-gray-50 px-4 py-4 w-full">
                <div className="flex justify-between items-center w-full">
                  <p className="text-lg font-semibold leading-6 text-gray-800">
                    Lịch Làm Việc Trong Tuần
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setShowAddScheduleDialog(true)}
                    className="bg-black border text-white flex items-center gap-2 hover:bg-gray-200 hover:text-black border-black"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Thêm lịch
                  </Button>
                </div>
                <ScrollArea className="h-60 w-full rounded-md border p-3 mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="sticky top-0 bg-gray-200 text-black">
                        <TableHead>Thứ</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {scheduleList && scheduleList.length > 0 ? (
                        scheduleList.map((item: any, index: number) => (
                          <TableRow key={item.MaLichLamViec || index} className="bg-white">
                            <TableCell className="font-medium">{item.ThuTrongTuan}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteScheduleClick(item.MaLichLamViec)}
                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                            Chưa có lịch làm việc
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>

            <div className="w-full md:w-1/3 bg-gray-50 px-4 py-6 md:p-6 flex flex-col gap-6">
              <div>
                <h3 className="text-xl font-semibold leading-5 text-gray-800">Bác sĩ</h3>
                <div className="flex flex-col justify-start items-start mt-4 space-y-4">
                  <div className="flex justify-start items-center space-x-4 w-full border-b border-gray-200 pb-4">
                    <UserIcon className="w-6 h-6" />
                    <p className="text-base font-semibold leading-4 text-gray-800">
                      {selectedUser?.HoTen || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4 flex gap-2">
            <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowScheduleDialog(false)}>Đóng</Button>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Thêm Lịch Làm Việc */}
      <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Lịch Làm Việc</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Thứ trong tuần</Label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newSchedule.ThuTrongTuan}
                onChange={(e) => setNewSchedule({ ...newSchedule, ThuTrongTuan: e.target.value })}
              >
                <option value="">Chọn ngày</option>
                {days
                  .filter((day) => !scheduleList.some((s: any) => s.ThuTrongTuan === day.value))
                  .map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button className="hover:bg-gray-300" variant="outline" onClick={() => setShowAddScheduleDialog(false)}>
              Hủy
            </Button>
            <Button className="bg-black text-white border hover:text-black hover:bg-white border-black" onClick={handleAddSchedule}>
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Schedule Confirmation Dialog */}
      <AlertDialog open={showDeleteScheduleDialog} onOpenChange={setShowDeleteScheduleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa lịch làm việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch làm việc này không?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteScheduleDialog(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteSchedule}
              className="bg-black text-white hover:bg-white hover:text-black border border-black"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </RoleGuard>
  )
}
