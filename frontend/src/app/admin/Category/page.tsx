"use client"
import { useEffect, useState } from "react"
import React from "react"
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
import Admin from "../page"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"


export default function Category() {
    const [categorys, setcategorys] = useState([]);
    const [category, setcategory] = useState<any>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    const [selectedcategorys, setSelectedcategorys] = useState<any>([]);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const { toast } = useToast();
    let a;
    const [newCategory, setnewCategory] = useState({
        image: '',
        categoryName: '',
    });
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, files } = e.target; // Lấy id và files từ target (input)
        if (files && files[0]) {
            const fileName = "/" + files[0].name; // Lấy tên file từ đối tượng file
            console.log(fileName); // In ra tên tệp
            // Nếu bạn muốn xử lý thêm, ví dụ như lưu vào state:
            setnewCategory((prev) => ({
                ...prev,
                [id]: fileName, // Lưu tên file vào state
            }));
        }
        // Nếu không phải file, xử lý giá trị text bình thường
        if (id !== "image") {
            const { value } = e.target;
            setnewCategory((prev) => ({
                ...prev,
                [id]: value,
            }));
        }
        console.log(newCategory);
    };
    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/category/get")
            .then(categorys => setcategorys(categorys.data))
            .catch(err => console.log(err))
    }, []);
    const handleDeleteClick = (categorys: React.SetStateAction<null>) => {
        setSelectedcategorys(categorys);
        setShowAlert(true);
    }
    const handleEditClick = (category: any) => {
        setcategory(category);
        setnewCategory(category);
        setShowAlertEdit(true);
    }
    const handleAlertEditClose = () => {
        setShowAlertEdit(false);
        setSelectedcategorys(null);
    }
    const handleAlertClose = () => {
        setShowAlert(false);
        setSelectedcategorys(null);
    }
    const handleConfirmEdit = () => {
        axios.put(`http://localhost:5000/api/admin/category/update/${category.id}`, newCategory)
            .then(() => {
                toast({
                    title: "categorys Edit",
                    description: `categorys has been edit.`,
                });
                // Reload the categorys or update state after deletion
                axios.get("http://localhost:5000/api/admin/category/get")
                    .then((response) => setcategorys(response.data))
                    .catch((err) => console.error("Error fetching categorys:", err));

                setShowAlert(false);  // Close the alert dialog
            })
            .catch((err) => {
                console.error("Error deleting categorys:", err);
                toast({
                    title: "Edit Failed",
                    description: `There was an error edit the categorys.`,
                    variant: "destructive",
                });
            });
    }
    const handleConfirmDelete = () => {
        // Make sure categorys.id is passed dynamically in the URL
        if (selectedcategorys) {
            axios.delete(`http://localhost:5000/api/admin/category/delete/${selectedcategorys.id}`)
                .then(() => {
                    toast({
                        title: "categorys Deleted",
                        description: `categorys has been deleted.`,
                    });
                    // Reload the categorys or update state after deletion
                    axios.get("http://localhost:5000/api/admin/category/get")
                        .then((response) => setcategorys(response.data))
                        .catch((err) => console.error("Error fetching categorys:", err));

                    setShowAlert(false);  // Close the alert dialog
                })
                .catch((err) => {
                    console.error("Error deleting categorys:", err);
                    toast({
                        title: "Delete Failed",
                        description: `There was an error deleting the categorys.`,
                        variant: "destructive",
                    });
                });
        }
    };
    const handleCreatecategorys = () => {
        console.log(newCategory);
        axios.post("http://localhost:5000/api/admin/category/create", newCategory)
            .then(() => {
                toast({
                    title: "categorys Created",
                    description: "New categorys has been added successfully.",
                });
                // Load lại danh sách sản phẩm
                axios.get("http://localhost:5000/api/admin/category/get")
                    .then((response) => setcategorys(response.data))
                    .catch((err) => console.error("Error fetching categorys:", err));
                setnewCategory({
                    image: "",
                    categoryName: "",
                });
                setDialogOpen(false);
            })
            .catch((err) => console.error("Error creating categorys:", err));
    };
    return (
        <Admin>
            <title>Category</title>
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
                                        Add categorys
                                    </span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add New categorys</DialogTitle>
                                    <DialogDescription>
                                        Add new categorys to store catalog.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="image" className="text-right col-span-2">
                                            Image
                                        </Label>
                                        <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                                    </div>
                                    <div className="grid grid-cols-6 items-center gap-4">
                                        <Label htmlFor="image" className="text-right col-span-2">
                                            Category Name
                                        </Label>
                                        <Input onChange={handleInputChange} id="categoryName" type="text" className="col-span-4" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="button" onClick={handleCreatecategorys}>
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
                            <CardTitle>Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Category Name</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Actions</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categorys.map((category: any) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="font-medium">
                                                <Image
                                                    alt="Category image"
                                                    className="aspect-square rounded-md object-cover"
                                                    height="32"
                                                    src={category.image}
                                                    width="32"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {category.categoryName}
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(category)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(category)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>

                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="text-xs text-muted-foreground">
                                Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                categorys
                            </div>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this categorys?
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
                        <AlertDialogTitle>Edit categorys</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                        <Image className="mx-auto" src={category.image} alt={""} width={96} height={96} />
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="image" className="text-right col-span-2">
                                Image
                            </Label>
                            <Input onChange={handleInputChange} id="image" type="file" className="col-span-4" accept="Image/*" />
                        </div>
                        <div className="grid grid-cols-6 items-center gap-4">
                            <Label htmlFor="image" className="text-right col-span-2">
                                Category Name
                            </Label>
                            <Input onChange={handleInputChange} id="categoryName" type="text" className="col-span-4" defaultValue={category.categoryName}/>
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
        </Admin >
    )
}
