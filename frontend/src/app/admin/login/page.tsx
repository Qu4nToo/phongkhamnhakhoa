'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from '@/components/features/spinner';


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
            // Fetch user data by email from the backend
            const response = await fetch(`http://localhost:5000/api/nguoi-dung/getByEmail/${email}`);

            if (!response.ok) {
                throw new Error('User not found');
            }

            const user = await response.json();

            // Use js-sha3 to hash the entered password with sha3-512


            // const hashedPassword = sha3_512(password);  // Hash the password using sha3-512

            // Compare the hashed password with the stored password (which should also be hashed)
            if (user && password === user.MatKhau) {
                
                if (user.RoleName === "Quản lý") {
                    alert("Đăng nhập thành công!");
                    sessionStorage.setItem("user_info", JSON.stringify(user));
                    router.push('/admin/dashboard');
                }

            } else {
                alert('Invalid password');
                router.push('/admin/login');
            }
        } catch (err: any) {
            console.error(err);
            setError(err?.message || 'Invalid email');
            alert('Invalid email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            {loading && <Spinner />}
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
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="passWord"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                required
                            />
                        </div>
                        <CardFooter className="flex justify-center">
                                <Button type="submit" className="bg-black text-white hover:bg-white hover:text-black border-1" disabled={loading}>
                                    Login
                                </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
