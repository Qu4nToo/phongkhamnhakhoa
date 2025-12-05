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
import { Toaster } from '@/components/ui/sonner';
import { toast } from "sonner"
import { saveAuthData } from '@/lib/auth';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); 
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

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

            const data = await response.json();

            if (response.ok) {
                // Lưu access token và refresh token
                if (data.accessToken && data.refreshToken) {
                    saveAuthData(data.accessToken, data.refreshToken);
                    toast.success(data.message || "Đăng nhập thành công!");
                    router.push("/");
                } else {
                    toast.error("Không nhận được token từ server!");
                }
            } else {
                toast.error(data.message || "Tài khoản hoặc mật khẩu không hợp lệ!");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setError("Không thể kết nối đến server!");
            toast.error("Không thể kết nối đến server!");
        } finally {
            setLoading(false);
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
                                <Button type="submit" className="bg-black text-white hover:bg-white hover:text-black border" disabled={loading}>
                                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div></>
    );
};

export default LoginPage;