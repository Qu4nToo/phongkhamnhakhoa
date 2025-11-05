'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Card, CardContent, CardDescription, CardFooter,
    CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sha3_512 } from 'js-sha3';
import { Toaster } from '@/components/ui/sonner';
import { toast } from "sonner"
import axios from 'axios';
// Xóa: import User from '../(page)/BacSi/page'; // KHÔNG CẦN THIẾT

// Định nghĩa Interface User (Kiểu dữ liệu cho người dùng)
interface UserData {
    MaNguoiDung: string;
    HoTen: string;
    SDT: string;
    Email: string;
    NgaySinh: string;
    MatKhau: string;
    DiaChi: string;
    MaChucVu: string;
    TenChucVu: string; // Tên chức vụ trong JSON là "Quản Lý"
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Thêm loading lại!
    const router = useRouter();

    // Dữ liệu này có thể được sử dụng để hiển thị thông tin, nhưng không nên dùng cho logic kiểm tra ngay lập tức
    // Đã sửa lại là UserData | null vì API trả về 1 đối tượng duy nhất
    const [users, setUsers] = useState<UserData | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        setError("");

        try {
            // ----------------------------------------------------
            // 1. Dùng await axios.get để CHỜ dữ liệu trả về
            // ----------------------------------------------------
            const response = await axios.get<UserData>(`http://localhost:5000/api/nguoi-dung/getByEmail/${email}`);

            // API của bạn có thể trả về một MẢNG chứa 1 phần tử (user)
            // hoặc trả về TRỰC TIẾP đối tượng User. Tôi sẽ xử lý trường hợp API trả về đối tượng User duy nhất.
            const user: UserData = response.data;

            // ----------------------------------------------------
            // 2. Kiểm tra Dữ liệu & Mật khẩu
            // ----------------------------------------------------
            if (!user || !user.MatKhau) {
                toast.error("Invalid email address.");
                setLoading(false);
                return;
            }

            const hashedPassword = sha3_512(password);

            if (hashedPassword === user.MatKhau) {
                // Sửa lỗi Case-sensitive: "Quản Lý" vs "Quản lý"
                if (user.TenChucVu === "Quản Lý") {

                    toast.success("Login successful!");

                    // LƯU ĐỐI TƯỢNG USER, KHÔNG PHẢI MẢNG
                    sessionStorage.setItem("user_info", JSON.stringify(user));
                    setUsers(user); // Cập nhật state (tuỳ chọn)

                    // Dùng setTimeout để đảm bảo toast hiển thị
                    setTimeout(() => {
                        router.push('/Dashboard');
                    }, 500);

                } else {
                    toast.error("You do not have administrative privileges.");
                }
            } else {
                toast.error("Invalid password.");
            }

        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                toast.error("Invalid email address.");
            } else {
                toast.error('Failed to connect or server error.');
            }
            setError(err?.message || 'Connection failed');
        } finally {
            setLoading(false); // Đảm bảo loading được tắt
        }
    };

    return (
        // Bắt đầu phần JSX của bạn
        <><Toaster />
            <div className="flex items-center justify-center min-h-screen">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your email below to login to your account.
                            {error && <p className="text-red-500">{error}</p>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="m@example.com"
                                    required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="passWord"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="password"
                                    required />
                            </div>
                            <CardFooter className="flex justify-center">
                                <Button type="submit" className="bg-black text-white hover:bg-white hover:text-black border-1" disabled={loading}>
                                    {loading ? 'Logging In...' : 'Login'}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div></>
    );
};

export default LoginPage;