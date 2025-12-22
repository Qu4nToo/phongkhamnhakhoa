"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { User, Mail, Phone, Stethoscope, Edit, Save, X, Calendar, MapPin, Briefcase, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu cho thông tin Bác sĩ
interface DoctorData {
    MaBacSi: string;
    HoTen: string;
    Email: string;
    SoDienThoai: string;
    KinhNghiem?: string;
    NgaySinh?: string;
    DiaChi: string;
    ChuyenKhoa: string;
    BangCap: string;
    ChuyenMon: string;
    AnhDaiDien?: string;
}

interface DoctorInfo {
    bacSi: DoctorData;
    token: string;
}

export default function DoctorProfile() {
    const router = useRouter();
    const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
    const [originalData, setOriginalData] = useState<DoctorData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // States for dialogs
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
    const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

    // States for password
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // States for avatar
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    useEffect(() => {
        const storedUserInfo = sessionStorage.getItem("user_info");

        if (storedUserInfo) {
            try {
                const user = JSON.parse(storedUserInfo);
                // JWT payload có dạng: { MaBacSi, email, hoTen, role, sdt, kinhNghiem, diaChi, ngaySinh, chuyenKhoa, bangCap, chuyenMon }
                const doctorInfo: DoctorData = {
                    MaBacSi: user.MaBacSi,
                    HoTen: user.hoTen,
                    Email: user.email,
                    SoDienThoai: user.sdt,
                    KinhNghiem: user.kinhNghiem,
                    NgaySinh: user.ngaySinh,
                    DiaChi: user.diaChi || '',
                    ChuyenKhoa: user.chuyenKhoa || '',
                    BangCap: user.bangCap || '',
                    ChuyenMon: user.chuyenMon || '',
                    AnhDaiDien: user.anhDaiDien || ''
                };
                setDoctorData(doctorInfo);
                setOriginalData(doctorInfo);
            } catch (error) {
                console.error("Lỗi phân tích JSON:", error);
                router.push('/DangNhap');
            }
        } else {
            toast.warning("Vui lòng đăng nhập.");
            router.push('/DangNhap');
        }

        setIsLoading(false);
    }, []);

    // Handle Edit Submit
    const handleEditSubmit = async () => {
        if (!doctorData) return;

        if (!doctorData.HoTen || !doctorData.Email || !doctorData.SoDienThoai) {
            toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem("accessToken");

            const response = await axios.put(
                `http://localhost:5000/api/bac-si/update/${doctorData.MaBacSi}`,
                {
                    HoTen: doctorData.HoTen,
                    Email: doctorData.Email,
                    SoDienThoai: doctorData.SoDienThoai,
                    KinhNghiem: doctorData.KinhNghiem,
                    NgaySinh: doctorData.NgaySinh,
                    DiaChi: doctorData.DiaChi,
                    ChuyenKhoa: doctorData.ChuyenKhoa,
                    BangCap: doctorData.BangCap,
                    ChuyenMon: doctorData.ChuyenMon
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Update session storage
            const storedUserInfo = sessionStorage.getItem("user_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const newUserInfo = {
                    ...user,
                    hoTen: doctorData.HoTen,
                    email: doctorData.Email,
                    sdt: doctorData.SoDienThoai,
                    kinhNghiem: doctorData.KinhNghiem,
                    ngaySinh: doctorData.NgaySinh,
                    diaChi: doctorData.DiaChi,
                    chuyenKhoa: doctorData.ChuyenKhoa,
                    bangCap: doctorData.BangCap,
                    chuyenMon: doctorData.ChuyenMon
                };
                sessionStorage.setItem("user_info", JSON.stringify(newUserInfo));
            }

            setOriginalData(doctorData);
            setEditDialogOpen(false);
            toast.success("Cập nhật thông tin thành công!");
        } catch (error: any) {
            console.error("Lỗi:", error);
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin!");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Password Submit
    const handlePasswordSubmit = async () => {
        if (!passwordForm.oldPassword) {
            toast.error('Vui lòng nhập mật khẩu cũ!');
            return;
        }

        if (!passwordForm.newPassword) {
            toast.error('Vui lòng nhập mật khẩu mới!');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu mới không khớp!');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('Mật khẩu phải có ít nhất 6 ký tự!');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem("accessToken");

            await axios.put(
                `http://localhost:5000/api/bac-si/change-password/${doctorData?.MaBacSi}`,
                {
                    oldPassword: passwordForm.oldPassword,
                    newPassword: passwordForm.newPassword
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordDialogOpen(false);
            toast.success('Đổi mật khẩu thành công!');
        } catch (error: any) {
            console.error('Lỗi:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu!');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Avatar Change
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle Avatar Submit
    const handleAvatarSubmit = async () => {
        if (!avatarFile || !doctorData) return;

        try {
            setIsLoading(true);
            const token = localStorage.getItem("accessToken");
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await axios.put(
                `http://localhost:5000/api/bac-si/update-avatar/${doctorData.MaBacSi}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const newAvatarUrl = response.data.avatarUrl;

            // Update local state
            setDoctorData(prev => prev ? { ...prev, AnhDaiDien: newAvatarUrl } : null);
            setOriginalData(prev => prev ? { ...prev, AnhDaiDien: newAvatarUrl } : null);

            // Update session storage
            const storedUserInfo = sessionStorage.getItem("user_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const newUserInfo = { ...user, anhDaiDien: newAvatarUrl };
                sessionStorage.setItem("user_info", JSON.stringify(newUserInfo));
            }

            setAvatarFile(null);
            setAvatarPreview('');
            setAvatarDialogOpen(false);
            toast.success('Cập nhật ảnh đại diện thành công!');
        } catch (error: any) {
            console.error('Lỗi:', error);
            toast.error(error.response?.data?.message || 'Lỗi khi tải ảnh lên!');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !doctorData) {
        return (
            <div className="flex justify-center items-center h-48">
                <p>Đang tải...</p>
            </div>
        );
    }

    if (!doctorData) {
        return (
            <div className="p-6"><p className="text-red-500">Không thể hiển thị hồ sơ.</p></div>
        );
    }

    return (
        <><h1 className="ms-10 text-3xl font-bold">Quản ký thông tin cá nhân</h1><div className="max-w-4xl mx-auto p-4 sm:p-6">
            <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Header with Avatar */}
                <div className="p-4 sm:p-6 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
                        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
                            <div className="relative flex-shrink-0">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
                                    {doctorData.AnhDaiDien ? (
                                        <img
                                            src={doctorData.AnhDaiDien}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                            } } />
                                    ) : null}
                                    <Stethoscope className={`w-8 h-8 sm:w-10 sm:h-10 text-blue-600 ${doctorData.AnhDaiDien ? 'hidden' : ''}`} />
                                </div>
                                <button
                                    onClick={() => setAvatarDialogOpen(true)}
                                    className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-md transition-colors"
                                >
                                    <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">{doctorData.HoTen}</h2>
                                <p className="text-sm text-slate-500">{doctorData.ChuyenKhoa || 'Bác sĩ'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={() => {
                                    setDoctorData({ ...originalData! });
                                    setEditDialogOpen(true);
                                } }
                                variant="outline"
                                className="gap-1 sm:gap-2 flex-1 sm:flex-initial border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">Sửa thông tin</span>
                                <span className="sm:hidden">Sửa</span>
                            </Button>
                            <Button
                                onClick={() => setPasswordDialogOpen(true)}
                                variant="outline"
                                className="gap-1 sm:gap-2 flex-1 sm:flex-initial border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                                <Lock className="w-4 h-4" />
                                <span className="hidden sm:inline">Đổi mật khẩu</span>
                                <span className="sm:hidden">Mật khẩu</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Thông tin cơ bản */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin cơ bản</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Họ và tên</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.HoTen}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Ngày sinh</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {doctorData.NgaySinh ? new Date(doctorData.NgaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Kinh nghiệm</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.KinhNghiem || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="space-y-3 sm:space-y-4">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide">Thông tin liên hệ</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-sm font-medium text-slate-900 break-all">{doctorData.Email}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Số điện thoại</p>
                                    <p className="text-sm font-medium text-slate-900">{doctorData.SoDienThoai}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Địa chỉ</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.DiaChi || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chuyên môn */}
                    <div className="space-y-3 sm:space-y-4 md:col-span-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-slate-900 uppercase tracking-wide">Chuyên môn</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex items-start space-x-3">
                                <Stethoscope className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Chuyên khoa</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.ChuyenKhoa || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Briefcase className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Bằng cấp</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.BangCap || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Stethoscope className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-slate-500">Chuyên môn</p>
                                    <p className="text-sm font-medium text-slate-900 break-words">{doctorData.ChuyenMon || 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px] mx-4 max-w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Chỉnh sửa thông tin</DialogTitle>
                        <DialogDescription className="text-sm">Cập nhật thông tin cá nhân của bạn</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="HoTen">Họ và tên *</Label>
                                <Input
                                    id="HoTen"
                                    value={doctorData.HoTen}
                                    onChange={(e) => setDoctorData({ ...doctorData, HoTen: e.target.value })}
                                    readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="NgaySinh">Ngày sinh</Label>
                                <Input
                                    id="NgaySinh"
                                    type="date"
                                    value={doctorData.NgaySinh || ''}
                                    onChange={(e) => setDoctorData({ ...doctorData, NgaySinh: e.target.value })}
                                    readOnly />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="Email">Email *</Label>
                                <Input
                                    id="Email"
                                    type="email"
                                    value={doctorData.Email}
                                    onChange={(e) => setDoctorData({ ...doctorData, Email: e.target.value })}
                                    readOnly />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="SoDienThoai">Số điện thoại *</Label>
                                <Input
                                    id="SoDienThoai"
                                    value={doctorData.SoDienThoai}
                                    onChange={(e) => setDoctorData({ ...doctorData, SoDienThoai: e.target.value })}
                                    readOnly />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="DiaChi">Địa chỉ</Label>
                            <Input
                                id="DiaChi"
                                value={doctorData.DiaChi || ''}
                                onChange={(e) => setDoctorData({ ...doctorData, DiaChi: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="KinhNghiem">Kinh nghiệm</Label>
                            <Input
                                id="KinhNghiem"
                                value={doctorData.KinhNghiem || ''}
                                onChange={(e) => setDoctorData({ ...doctorData, KinhNghiem: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="ChuyenKhoa">Chuyên khoa</Label>
                                <Input
                                    id="ChuyenKhoa"
                                    value={doctorData.ChuyenKhoa || ''}
                                    onChange={(e) => setDoctorData({ ...doctorData, ChuyenKhoa: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="BangCap">Bằng cấp</Label>
                                <Input
                                    id="BangCap"
                                    value={doctorData.BangCap || ''}
                                    onChange={(e) => setDoctorData({ ...doctorData, BangCap: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ChuyenMon">Chuyên môn</Label>
                                <Input
                                    id="ChuyenMon"
                                    value={doctorData.ChuyenMon || ''}
                                    onChange={(e) => setDoctorData({ ...doctorData, ChuyenMon: e.target.value })} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="w-full sm:w-auto">
                            Hủy
                        </Button>
                        <Button onClick={handleEditSubmit} disabled={isLoading} className="w-full sm:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Password Dialog */}
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent className="sm:max-w-[400px] mx-4 max-w-[calc(100%-2rem)]">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Đổi mật khẩu</DialogTitle>
                        <DialogDescription className="text-sm">Nhập mật khẩu cũ và mật khẩu mới</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
                            <div className="relative">
                                <Input
                                    id="oldPassword"
                                    type={showOldPassword ? "text" : "password"}
                                    value={passwordForm.oldPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    className="pr-10" />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="pr-10" />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="pr-10" />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)} className="w-full sm:w-auto">
                            Hủy
                        </Button>
                        <Button onClick={handlePasswordSubmit} disabled={isLoading} className="w-full sm:w-auto">
                            <Lock className="w-4 h-4 mr-2" />
                            {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Avatar Dialog */}
            <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
                <DialogContent className="sm:max-w-[400px] mx-4 max-w-[calc(100%-2rem)]">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Cập nhật ảnh đại diện</DialogTitle>
                        <DialogDescription className="text-sm">Chọn ảnh mới cho tài khoản của bạn</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 sm:space-y-4 py-4">
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : doctorData.AnhDaiDien ? (
                                    <img src={doctorData.AnhDaiDien} alt="Current Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <Stethoscope className="w-16 h-16 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="avatar">Chọn ảnh</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange} />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-2">
                        <Button variant="outline" onClick={() => setAvatarDialogOpen(false)} className="w-full sm:w-auto">
                            Hủy
                        </Button>
                        <Button onClick={handleAvatarSubmit} disabled={isLoading || !avatarFile} className="w-full sm:w-auto">
                            <Camera className="w-4 h-4 mr-2" />
                            {isLoading ? 'Đang tải...' : 'Cập nhật'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div></>
    );
}