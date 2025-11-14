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
    VaiTro: string;
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); 
    const router = useRouter();


    const [users, setUsers] = useState<UserData | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const response = await fetch(
                `http://localhost:5000/api/nguoi-dung/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ Email: email, MatKhau: password }),
                }
            );

            if (response.ok) {
                const user = await response.json();
                // Xử lý đăng nhập thành công Khách hàng
                sessionStorage.setItem("user_info", JSON.stringify(user));
                toast.success("Đăng nhập thành công!");
                router.push("/");
                return;
            }

            toast.error("Tài khoản hoặc mật khẩu không hợp lệ!");
        } catch (err: any) {
            console.error(err);
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