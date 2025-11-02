"use client"
import { useEffect, useState } from "react"
import React from "react"
import { sha3_512 } from "js-sha3";
import Image from "next/image"
import {
  File,
  ListFilter,
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


  const [newUser, setNewUser] = useState({
    HoTen: "",
    SoDienThoai: "",
    Email: "",
    NgaySinh: "",
    MatKhau: "",
    KinhNghiem: "",
    DiaChi: ""
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


  useEffect(() => {
    axios.get("http://localhost:5000/api/bac-si/get")
      .then(users => setUsers(users.data))
      .catch(err => console.log(err))
  }, []);
  // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
  //     setSelectedProduct(product);
  //     a = selectedProduct;
  // }
  const handleDeleteClick = (user: React.SetStateAction<null>) => {
    console.log(user);
    setSelectedUser(user);
    setShowAlert(true);
  }
  const handleEditClick = (user: any) => {
    setUser(user);
    setNewUser(user);
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
    axios.put(`http://localhost:5000/api/bac-si/update/${user.MaBacSi}`, newUser)
      .then(() => {
        toast("User Edit: User has been edit.");
        // toast({
        //     title: "User Edit",
        //     description: `User has been edit.`,
        // });
        // Reload the users or update state after deletion
        axios.get("http://localhost:5000/api/bac-si/get")
          .then((response) => setUsers(response.data))
          .catch((err) => console.error("Error fetching users:", err));

        setShowAlert(false);  // Close the alert dialog
      })
      .catch((err) => {
        console.error("Error deleting user:", err);
        toast("Edit Failed: There was an error edit the user.");
        // toast({
        //     title: "Edit Failed",
        //     description: `There was an error edit the user.`,
        //     variant: "destructive",
        // });
      });
  }

  const handleConfirmDelete = () => {

    if (selectedUser) {
      axios.delete(`http://localhost:5000/api/bac-si/delete/${selectedUser.MaBacSi}`)
        .then(() => {
          toast("User Deleted: User has been deleted.");
          axios.get("http://localhost:5000/api/bac-si/get")
            .then((response) => setUsers(response.data))
            .catch((err) => console.error("Error fetching users:", err));
          setShowAlert(false);
        })
        .catch((err) => {
          console.error("Error deleting user:", err);
          toast("Delete Failed: There was an error deleting the user.");
        });
    }
  };
  const handleCreateUser = () => {
    console.log(newUser);
    const userToCreate = {
      ...newUser,
      MatKhau: sha3_512(newUser.MatKhau) // hash mật khẩu
    };
    axios.post("http://localhost:5000/api/bac-si/create", userToCreate)
      .then(() => {
        toast("User Created: New User has been added successfully.");
        // Load lại danh sách sản phẩm
        axios.get("http://localhost:5000/api/bac-si/get")
          .then((response) => setUsers(response.data))
          .catch((err) => console.error("Error fetching users:", err));
        setNewUser({
          HoTen: "",
          SoDienThoai: "",
          Email: "",
          NgaySinh: "",
          MatKhau: "",
          KinhNghiem: "",
          DiaChi: ""
        });
        setDialogOpen(false);
      })
      .catch((err) => console.error("Error creating userduct:", err));
  };
  return (
    <>
      <title>User</title>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
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
                  <DialogTitle>Thêm bác sĩ</DialogTitle>
                  <DialogDescription>
                    Thêm bác sĩ mới vào danh sách.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                    <Label htmlFor="MatKhau" className="text-right col-span-2">
                      Mật khẩu
                    </Label>
                    <Input onChange={handleInputChange} id="MatKhau" type="text" className="col-span-4" />
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
              <CardTitle>Danh sách bác sĩ</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
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
                {users.map((users: any) => (
                  <TableBody key={users.MaBacSi}>
                    <TableRow>
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditClick(users)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(users)}>Delete</DropdownMenuItem>
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
      <AlertDialog open={showAlertEdit} onOpenChange={setShowAlertEdit}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit userduct</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
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
            <Input onChange={handleInputChange} id="MatKhau" type="text" className="col-span-4" defaultValue={user.MatKhau} hidden />
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
