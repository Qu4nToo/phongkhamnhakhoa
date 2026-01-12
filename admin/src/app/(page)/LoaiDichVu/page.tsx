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
export default function categoryView() {
    const [categorys, setCategorys] = useState([]);
    const [category, setCategory] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedcategory, setSelectedcategory] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Phân trang
    const totalPages = Math.ceil(categorys.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedCategorys = categorys.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const [newCategory, setNewCategory] = useState({
        TenLoaiDV: "",
        MoTa: "",
    });
    const handleInputChange2 = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newCategory);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id } = e.target;

        const { value } = e.target;
        setNewCategory((prev) => ({
            ...prev,
            [id]: value,
        }));
        console.log(newCategory);
    };
    useEffect(() => {
        axios.get("http://localhost:5000/api/loai-dich-vu/get")
            .then(categorys => setCategorys(categorys.data))
            .catch(err => console.log(err))
    }, []);
    // const handleToggleMenuClick = (product: React.SetStateAction<null>)=>{
    //     setSelectedProduct(product);
    //     a = selectedProduct;
    // }
    const handleDeleteClick = (category: React.SetStateAction<null>) => {
        console.log(category);
        setSelectedcategory(category);
        setShowAlert(true);
    }
    const handleEditClick = (category: any) => {
        setCategory(category);
        setNewCategory(category);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedcategory(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/loai-dich-vu/update/${category.MaLoaiDV}`, newCategory)
            .then(() => {
                // toast({
                //     title: "category Edit",
                //     description: `category has been edit.`,
                // });
                // Reload the categorys or update state after deletion
                axios.get("http://localhost:5000/api/loai-dich-vu/get")
                    .then((response) => setCategorys(response.data))
                    .catch((err) => console.error("Error fetching categorys:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting category:", err);
                // toast({
                //     title: "Edit Failed",
                //     description: `There was an error edit the category.`,
                //     variant: "destructive",
                // });
            });
    }

    const handleConfirmDelete = () => {

        if (selectedcategory) {
            axios.delete(`http://localhost:5000/api/loai-dich-vu/delete/${selectedcategory.MaLoaiDV}`)
                .then(() => {
                    toast.success("Xóa loại dịch vụ thành công!");
                    axios.get("http://localhost:5000/api/loai-dich-vu/get")
                        .then((response) => setCategorys(response.data))
                        .catch((err) => console.error("Error fetching categorys:", err));
                    setShowAlert(false);
                })
                .catch((err) => {
                    console.error("Error deleting category:", err);
                    toast.error("Có lỗi xảy ra khi xóa loại dịch vụ!");
                });
        }
    };
    const handleCreatecategory = () => {
        console.log(newCategory);
        const categoryToCreate = {
            ...newCategory,
        };
        axios.post("http://localhost:5000/api/loai-dich-vu/create", categoryToCreate)
            .then(() => {
                toast.success("Thêm loại dịch vụ thành công!");
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/loai-dich-vu/get")
                    .then((response) => setCategorys(response.data))
                    .catch((err) => console.error("Error fetching categorys:", err));
                setNewCategory({
                    TenLoaiDV: "",
                    MoTa: "",
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating category:", err));
    };

    return (
        <>
            <title>Quản Lý Loại Dịch Vụ</title>
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
                                        Thêm loại dịch vụ
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Thêm loại dịch vụ</DialogTitle>
                                    <DialogDescription>
                                        Thêm loại dịch vụ mới vào danh sách.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="TenLoaiDV" className="text-right col-span-2">
                                            Tên loại dịch vụ
                                        </Label>
                                        <Input onChange={handleInputChange} id="TenLoaiDV" type="text" className="col-span-4" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="MoTa" className="text-right col-span-2">
                                            Mô tả
                                        </Label>
                                        <Input onChange={handleInputChange} id="MoTa" type="text" className="col-span-4" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreatecategory}>
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
                            <CardTitle>Danh sách loại dịch vụ</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tên loại dịch vụ</TableHead>
                                        <TableHead>Mô tả</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                {paginatedCategorys.map((categorys: any) => (
                                    <TableBody key={categorys.MaLoaiDV}>
                                        <TableRow >
                                            <TableCell className="font-medium">
                                                {categorys.TenLoaiDV}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {categorys.MoTa}
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(categorys)}>Sửa</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(categorys)}>Xóa</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                ))}
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                itemsPerPage={itemsPerPage}
                                totalItems={categorys.length}
                            />
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác Nhận Xóa Loại Dịch Vụ</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa loại dịch vụ này không? Hành động này không thể hoàn tác.
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
                        <AlertDialogTitle>Chỉnh Sửa Thông Tin Loại Dịch Vụ</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="LoaiDichVu" className="text-right col-span-2">
                                Loại dịch vụ
                            </Label>
                            <Input id="LoaiDichVu" type="text" className="col-span-4" defaultValue={category.TenLoaiDV} />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="MoTa" className="text-right col-span-2">
                                Mô tả
                            </Label>
                            <textarea onChange={handleInputChange} id="MoTa" className="col-span-4" defaultValue={category.MoTa} />
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