"use client"
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; 
import { Button } from "@/components/ui/button"; 
import { Toaster, toast } from 'sonner';
import { User, Mail, Phone, Stethoscope, Edit, Save, X, Calendar, MapPin, Briefcase, Lock } from 'lucide-react'; // Thêm icon
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
    DiaChi?: string;
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

    useEffect(() => {
        const storedUserInfo = sessionStorage.getItem("user_info");
        
        if (storedUserInfo) {
            try {
                const user = JSON.parse(storedUserInfo);
                // JWT payload có dạng: { id, email, hoTen, role, sdt, kinhNghiem }
                const doctorInfo: DoctorData = {
                    MaBacSi: user.id,
                    HoTen: user.hoTen,
                    Email: user.email,
                    SoDienThoai: user.sdt,
                    KinhNghiem: user.kinhNghiem,
                    NgaySinh: user.ngaySinh,
                    DiaChi: user.diaChi
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setDoctorData(prev => prev ? { ...prev, [id]: value } : null);
    };
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setDoctorData(originalData);
        setIsEditing(false);
        toast.info("Đã hủy bỏ chỉnh sửa.");
    };

    // Xử lý lưu dữ liệu (gọi API)
    const handleSaveClick = async () => {
        if (!doctorData || !originalData) return;

        // 1. Kiểm tra dữ liệu hợp lệ cơ bản
        if (!doctorData.HoTen || !doctorData.Email || !doctorData.SoDienThoai) {
             toast.error("Vui lòng điền đầy đủ Họ tên, Email và Số điện thoại.");
             return;
        }

        try {
            setIsLoading(true);
        
            const payload = {
                HoTen: doctorData.HoTen,
                Email: doctorData.Email,
                SoDienThoai: doctorData.SoDienThoai,
                KinhNghiem: doctorData.KinhNghiem,
                NgaySinh: doctorData.NgaySinh,
                DiaChi: doctorData.DiaChi
            };

            const response = await axios.put(
                `http://localhost:5000/api/bac-si/update/${doctorData.MaBacSi}`,
                payload
            );
            
            const updatedDoctorData = { ...doctorData };
            
            const storedUserInfo = sessionStorage.getItem("user_info");
            if (storedUserInfo) {
                const user = JSON.parse(storedUserInfo);
                const newUserInfo = {
                    ...user,
                    hoTen: updatedDoctorData.HoTen,
                    email: updatedDoctorData.Email,
                    sdt: updatedDoctorData.SoDienThoai,
                    kinhNghiem: updatedDoctorData.KinhNghiem,
                    ngaySinh: updatedDoctorData.NgaySinh,
                    diaChi: updatedDoctorData.DiaChi
                };
                sessionStorage.setItem("user_info", JSON.stringify(newUserInfo));
            }

            setOriginalData(updatedDoctorData);
            setIsEditing(false);
            toast.success(response.data.message || "Cập nhật thông tin thành công!");

        } catch (error: any) {
            console.error("Lỗi khi lưu thông tin:", error);
            const errorMessage = error.response?.data?.message || "Lưu thất bại. Vui lòng thử lại.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
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

    const renderInputField = (id: keyof DoctorData, label: string, icon: React.ReactNode, type: string = "text", isPermanentReadOnly: boolean = false) => (
        <div className="grid w-full gap-2">
            <Label htmlFor={id} className="flex items-center text-sm font-medium text-gray-600">
                {icon}
                <span className="ml-2">{label}</span>
            </Label>
            <Input
                id={id}
                type={type}
                value={(doctorData[id] as string) || ''} 
                onChange={handleInputChange}
                readOnly={isPermanentReadOnly || !isEditing} 
                className={`w-full ${!isEditing || isPermanentReadOnly ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-blue-400 bg-white'}`}
            />
        </div>
    );

    return (
        <div className="p-2">
            <title>Thông tin Bác sĩ</title>
            <Card className="max-w-xl mx-auto shadow-xl">
                <CardHeader className="border-b flex flex-row justify-between items-center">
                    <CardTitle className="flex items-center space-x-2 text-2xl font-semibold text-blue-600">
                        <Stethoscope className="h-6 w-6" />
                        <span>Thông tin Bác sĩ</span>
                    </CardTitle>
                    
                    {/* Nút Chỉnh sửa / Lưu / Hủy */}
                    {isEditing ? (
                        <div className="space-x-2">
                            <Button 
                                onClick={handleSaveClick} 
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                <Save className="h-4 w-4 mr-2" /> {isLoading ? 'Đang lưu...' : 'Lưu'}
                            </Button>
                            <Button 
                                onClick={handleCancelClick} 
                                variant="outline" 
                                disabled={isLoading}
                                className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                                <X className="h-4 w-4 mr-2" /> Hủy
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            onClick={handleEditClick} 
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                        </Button>
                    )}
                </CardHeader>
                
                <CardContent className="pt-6 grid gap-6">
                    
                    {renderInputField('HoTen', 'Họ và Tên', <User />, 'text')}
                    {renderInputField('Email', 'Email', <Mail />, 'email')}
                    {renderInputField('SoDienThoai', 'Số Điện Thoại', <Phone />, 'tel')}
                    {renderInputField('NgaySinh', 'Ngày Sinh', <Calendar />, 'date')}
                    {renderInputField('DiaChi', 'Địa Chỉ', <MapPin />, 'text')}
                    {renderInputField('KinhNghiem', 'Kinh Nghiệm', <Briefcase />, 'text')}

                </CardContent>
            </Card>
        </div>
    );
}