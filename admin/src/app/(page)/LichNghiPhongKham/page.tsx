"use client"
import { useEffect, useState } from "react"
import React from "react"
import {
  MoreHorizontal,
  PlusCircle,
  Trash2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LichNghiPhongKham() {
  const [holidays, setHolidays] = useState<any[]>([])
  const [filteredHolidays, setFilteredHolidays] = useState<any[]>([])
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null)
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const [newHoliday, setNewHoliday] = useState({
    TenNgayLe: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    GhiChu: "",
    NamApDung: new Date().getFullYear(),
  })

  const [editHoliday, setEditHoliday] = useState({
    TenNgayLe: "",
    NgayBatDau: "",
    NgayKetThuc: "",
    GhiChu: "",
    NamApDung: new Date().getFullYear(),
  })

  // Fetch danh sách lịch nghỉ
  useEffect(() => {
    fetchHolidays()
  }, [])

  const fetchHolidays = () => {
    axios.get("http://localhost:5000/api/lich-nghi-phong-kham/getAll")
      .then(res => {
        setHolidays(res.data)
        setFilteredHolidays(res.data)
      })
      .catch(err => {
        console.error(err)
        toast.error("Không thể tải danh sách lịch nghỉ!")
      })
  }

  // Filter theo năm và tìm kiếm
  useEffect(() => {
    let filtered = holidays

    if (selectedYear !== "all") {
      filtered = filtered.filter(h => h.NamApDung.toString() === selectedYear)
    }

    if (searchTerm) {
      filtered = filtered.filter(h =>
        h.TenNgayLe.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredHolidays(filtered)
  }, [selectedYear, searchTerm, holidays])

  // Lấy danh sách các năm có trong dữ liệu
  const availableYears = [...new Set(holidays.map(h => h.NamApDung))].sort((a, b) => b - a)

  const handleCreateHoliday = () => {
    if (!newHoliday.TenNgayLe || !newHoliday.NgayBatDau || !newHoliday.NgayKetThuc) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    if (new Date(newHoliday.NgayKetThuc) < new Date(newHoliday.NgayBatDau)) {
      toast.error("Ngày kết thúc phải >= ngày bắt đầu!")
      return
    }

    axios.post("http://localhost:5000/api/lich-nghi-phong-kham/create", newHoliday)
      .then((response) => {
        toast.success("Thêm lịch nghỉ thành công!")
        
        // Hiển thị cảnh báo nếu có từ backend
        if (response.data.warning) {
          toast.warning(response.data.warning.message, {
            duration: 5000,
          })
        }
        
        setCreateDialogOpen(false)
        setNewHoliday({
          TenNgayLe: "",
          NgayBatDau: "",
          NgayKetThuc: "",
          GhiChu: "",
          NamApDung: new Date().getFullYear(),
        })
        fetchHolidays()
      })
      .catch(err => {
        console.error(err)
        const errorMsg = err.response?.data?.message || "Không thể thêm lịch nghỉ!"
        toast.error(errorMsg)
      })
  }

  const handleEditClick = (holiday: any) => {
    setSelectedHoliday(holiday)
    setEditHoliday({
      TenNgayLe: holiday.TenNgayLe,
      NgayBatDau: holiday.NgayBatDau,
      NgayKetThuc: holiday.NgayKetThuc,
      GhiChu: holiday.GhiChu || "",
      NamApDung: holiday.NamApDung,
    })
    setEditDialogOpen(true)
  }

  const handleUpdateHoliday = () => {
    if (!editHoliday.TenNgayLe || !editHoliday.NgayBatDau || !editHoliday.NgayKetThuc) {
      toast.error("Vui lòng điền đầy đủ thông tin!")
      return
    }

    if (new Date(editHoliday.NgayKetThuc) < new Date(editHoliday.NgayBatDau)) {
      toast.error("Ngày kết thúc phải >= ngày bắt đầu!")
      return
    }

    axios.put(`http://localhost:5000/api/lich-nghi-phong-kham/update/${selectedHoliday.MaLichNghi}`, editHoliday)
      .then((response) => {
        toast.success("Cập nhật lịch nghỉ thành công!")
        
        // Hiển thị cảnh báo nếu có từ backend
        if (response.data.warning) {
          toast.warning(response.data.warning.message, {
            duration: 5000,
          })
        }
        
        setEditDialogOpen(false)
        fetchHolidays()
      })
      .catch(err => {
        console.error(err)
        const errorMsg = err.response?.data?.message || "Không thể cập nhật lịch nghỉ!"
        toast.error(errorMsg)
      })
  }

  const handleDeleteClick = (holiday: any) => {
    setSelectedHoliday(holiday)
    setDeleteDialogOpen(true)
  }

  const handleDeleteHoliday = () => {
    axios.delete(`http://localhost:5000/api/lich-nghi-phong-kham/delete/${selectedHoliday.MaLichNghi}`)
      .then(() => {
        toast.success("Xóa lịch nghỉ thành công!")
        setDeleteDialogOpen(false)
        fetchHolidays()
      })
      .catch(err => {
        console.error(err)
        toast.error("Không thể xóa lịch nghỉ!")
      })
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi })
  }

  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="upcoming">Sắp tới</TabsTrigger>
                <TabsTrigger value="past">Đã qua</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="all">Tất cả năm</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <Input
                  placeholder="Tìm kiếm ngày lễ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="h-9 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Thêm lịch nghỉ
                  </span>
                </Button>
              </div>
            </div>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch nghỉ phòng khám</CardTitle>
                  <CardDescription>
                    Quản lý các ngày nghỉ lễ, Tết của phòng khám
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên ngày lễ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số ngày</TableHead>
                        <TableHead>Năm</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const totalPages = Math.ceil(filteredHolidays.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedHolidays = filteredHolidays.slice(startIndex, endIndex);
                        
                        return paginatedHolidays.length > 0 ? (
                          paginatedHolidays.map((holiday) => (
                          <TableRow key={holiday.MaLichNghi}>
                            <TableCell className="font-medium">{holiday.TenNgayLe}</TableCell>
                            <TableCell>{formatDate(holiday.NgayBatDau)}</TableCell>
                            <TableCell>{formatDate(holiday.NgayKetThuc)}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                {calculateDays(holiday.NgayBatDau, holiday.NgayKetThuc)} ngày
                              </span>
                            </TableCell>
                            <TableCell>{holiday.NamApDung}</TableCell>
                            <TableCell className="max-w-xs truncate">{holiday.GhiChu || "—"}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditClick(holiday)}>
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteClick(holiday)}>
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-gray-500">
                            Không có dữ liệu
                          </TableCell>
                        </TableRow>
                      );
                      })()}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredHolidays.length / itemsPerPage)}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredHolidays.length}
                  />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch nghỉ sắp tới</CardTitle>
                  <CardDescription>
                    Các ngày nghỉ lễ từ hôm nay trở đi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên ngày lễ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số ngày</TableHead>
                        <TableHead>Năm</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const upcomingHolidays = filteredHolidays.filter(h => new Date(h.NgayKetThuc) >= new Date());
                        const totalPages = Math.ceil(upcomingHolidays.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedHolidays = upcomingHolidays.slice(startIndex, endIndex);
                        
                        return paginatedHolidays.map((holiday) => (
                          <TableRow key={holiday.MaLichNghi}>
                            <TableCell className="font-medium">{holiday.TenNgayLe}</TableCell>
                            <TableCell>{formatDate(holiday.NgayBatDau)}</TableCell>
                            <TableCell>{formatDate(holiday.NgayKetThuc)}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                {calculateDays(holiday.NgayBatDau, holiday.NgayKetThuc)} ngày
                              </span>
                            </TableCell>
                            <TableCell>{holiday.NamApDung}</TableCell>
                            <TableCell className="max-w-xs truncate">{holiday.GhiChu || "—"}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleEditClick(holiday)}>
                                    Chỉnh sửa
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDeleteClick(holiday)}>
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredHolidays.filter(h => new Date(h.NgayKetThuc) >= new Date()).length / itemsPerPage)}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredHolidays.filter(h => new Date(h.NgayKetThuc) >= new Date()).length}
                  />
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="past">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch nghỉ đã qua</CardTitle>
                  <CardDescription>
                    Các ngày nghỉ lễ đã kết thúc
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên ngày lễ</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Ngày kết thúc</TableHead>
                        <TableHead>Số ngày</TableHead>
                        <TableHead>Năm</TableHead>
                        <TableHead>Ghi chú</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const pastHolidays = filteredHolidays.filter(h => new Date(h.NgayKetThuc) < new Date());
                        const totalPages = Math.ceil(pastHolidays.length / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedHolidays = pastHolidays.slice(startIndex, endIndex);
                        
                        return paginatedHolidays.map((holiday) => (
                          <TableRow key={holiday.MaLichNghi} className="opacity-60">
                            <TableCell className="font-medium">{holiday.TenNgayLe}</TableCell>
                            <TableCell>{formatDate(holiday.NgayBatDau)}</TableCell>
                            <TableCell>{formatDate(holiday.NgayKetThuc)}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-700">
                                {calculateDays(holiday.NgayBatDau, holiday.NgayKetThuc)} ngày
                              </span>
                            </TableCell>
                            <TableCell>{holiday.NamApDung}</TableCell>
                            <TableCell className="max-w-xs truncate">{holiday.GhiChu || "—"}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => handleDeleteClick(holiday)}>
                                    Xóa
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ));
                      })()}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredHolidays.filter(h => new Date(h.NgayKetThuc) < new Date()).length / itemsPerPage)}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredHolidays.filter(h => new Date(h.NgayKetThuc) < new Date()).length}
                  />
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Dialog thêm lịch nghỉ */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm lịch nghỉ mới</DialogTitle>
            <DialogDescription>
              Thêm ngày nghỉ lễ, Tết cho phòng khám
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="TenNgayLe">Tên ngày lễ *</Label>
              <Input
                id="TenNgayLe"
                placeholder="VD: Tết Nguyên Đán 2026"
                value={newHoliday.TenNgayLe}
                onChange={(e) => setNewHoliday({ ...newHoliday, TenNgayLe: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ngày bắt đầu *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !newHoliday.NgayBatDau && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newHoliday.NgayBatDau ? (
                        format(new Date(newHoliday.NgayBatDau), "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={newHoliday.NgayBatDau ? new Date(newHoliday.NgayBatDau) : undefined}
                      onSelect={(date: Date | undefined) => {
                        if (!date) return
                        setNewHoliday({ ...newHoliday, NgayBatDau: date.toLocaleDateString("en-CA") })
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Ngày kết thúc *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !newHoliday.NgayKetThuc && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newHoliday.NgayKetThuc ? (
                        format(new Date(newHoliday.NgayKetThuc), "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={newHoliday.NgayKetThuc ? new Date(newHoliday.NgayKetThuc) : undefined}
                      onSelect={(date: Date | undefined) => {
                        if (!date) return
                        setNewHoliday({ ...newHoliday, NgayKetThuc: date.toLocaleDateString("en-CA") })
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="NamApDung">Năm áp dụng *</Label>
              <Input
                id="NamApDung"
                type="number"
                value={newHoliday.NamApDung}
                onChange={(e) => setNewHoliday({ ...newHoliday, NamApDung: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="GhiChu">Ghi chú</Label>
              <Input
                id="GhiChu"
                placeholder="VD: Nghỉ Tết Âm lịch 9 ngày"
                value={newHoliday.GhiChu}
                onChange={(e) => setNewHoliday({ ...newHoliday, GhiChu: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateHoliday}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa lịch nghỉ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lịch nghỉ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin ngày nghỉ lễ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_TenNgayLe">Tên ngày lễ *</Label>
              <Input
                id="edit_TenNgayLe"
                value={editHoliday.TenNgayLe}
                onChange={(e) => setEditHoliday({ ...editHoliday, TenNgayLe: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Ngày bắt đầu *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editHoliday.NgayBatDau && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editHoliday.NgayBatDau ? (
                        format(new Date(editHoliday.NgayBatDau), "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={editHoliday.NgayBatDau ? new Date(editHoliday.NgayBatDau) : undefined}
                      onSelect={(date: Date | undefined) => {
                        if (!date) return
                        setEditHoliday({ ...editHoliday, NgayBatDau: date.toLocaleDateString("en-CA") })
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Ngày kết thúc *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !editHoliday.NgayKetThuc && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editHoliday.NgayKetThuc ? (
                        format(new Date(editHoliday.NgayKetThuc), "dd/MM/yyyy", { locale: vi })
                      ) : (
                        <span>Chọn ngày</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={editHoliday.NgayKetThuc ? new Date(editHoliday.NgayKetThuc) : undefined}
                      onSelect={(date: Date | undefined) => {
                        if (!date) return
                        setEditHoliday({ ...editHoliday, NgayKetThuc: date.toLocaleDateString("en-CA") })
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_NamApDung">Năm áp dụng *</Label>
              <Input
                id="edit_NamApDung"
                type="number"
                value={editHoliday.NamApDung}
                onChange={(e) => setEditHoliday({ ...editHoliday, NamApDung: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_GhiChu">Ghi chú</Label>
              <Input
                id="edit_GhiChu"
                value={editHoliday.GhiChu}
                onChange={(e) => setEditHoliday({ ...editHoliday, GhiChu: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdateHoliday}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xóa lịch nghỉ */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa lịch nghỉ <strong>{selectedHoliday?.TenNgayLe}</strong>?
              <br />Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteHoliday} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
