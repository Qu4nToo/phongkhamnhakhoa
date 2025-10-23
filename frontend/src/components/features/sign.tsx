"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { sha3_512 } from "js-sha3";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
// Login Component
export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Fetch user data by email from the backend
            const response = await fetch(
                `http://localhost:5000/api/khach-hang/getByEmail/${email}`
            );

            if (!response.ok) {
                throw new Error("User not found");
            }

            const user = await response.json();

            // Use js-sha3 to hash the entered password with sha3-512

            //const hashedPassword = sha3_512(password); // Hash the password using sha3-512

            // Compare the hashed password with the stored password (which should also be hashed)
            // if (user && hashedPassword === user.MatKhau) {
            if (user && password === user.MatKhau) {
                alert("Đăng nhập thành công!");
                // if (user.role.roleName === "Admin") {
                //     sessionStorage.setItem("user_info", JSON.stringify(user));
                //     router.push('/admin');
                // } else {
                //     sessionStorage.setItem("user_info", JSON.stringify(user));
                //     router.push('/');
                // }
                sessionStorage.setItem("user_info", JSON.stringify(user));
                router.push("/");
            } else {
                alert("Invalid password");
            }
        } catch (error: any) {
            alert("Invalid email");
        }
    };

    return (
        <div>
            <h1 className="text-3xl text-center">ĐĂNG NHẬP</h1>
            <form onSubmit={handleLogin}>
                <Label htmlFor="email">Email của bạn</Label>
                <Input
                    className="mt-2 mb-4 bg-transparent rounded-full"
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                    <Input
                        className="mt-2 mb-2 bg-transparent rounded-full"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </button>
                </div>
                <center>
                    <Button
                        className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Đăng nhập
                    </Button>
                </center>
            </form>
            <center className="mt-3">
                <p>
                    Chưa có tài khoản ?{" "}
                    <Link className="text-blue-500 hover:underline" href="/DangKy">
                        Đăng ký
                    </Link>
                </p>
            </center>
        </div>
    );
}

export function Sign() {
    const [newUser, setNewUser] = useState({
        HoTen: "",
        Email: "",
        SoDienThoai: "",
        MatKhau: "",
        NgaySinh: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const togglePasswordVisibility1 = () => setShowPassword1(!showPassword1);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
        console.log(newUser);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newUser.MatKhau !== confirmPassword) {
            setError("Mật khẩu không khớp");
            return;
        }

        try {
            // Chỉ lấy phần ngày (bỏ giờ)
            const formattedUser = {
                ...newUser,
                NgaySinh: newUser.NgaySinh ? newUser.NgaySinh.split("T")[0] : "",
            };

            await axios.post("http://localhost:5000/api/khach-hang/create", formattedUser);

            alert("Đăng ký thành công!");
            setNewUser({ HoTen: "", Email: "", SoDienThoai: "", MatKhau: "", NgaySinh: "" });
            setConfirmPassword("");
            router.push("/DangNhap");
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(err.response?.data?.message || err.message || "Có lỗi xảy ra");
        }
    };


    return (
        <div className="flex justify-center items-center max-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl text-center mb-4 font-semibold">ĐĂNG KÝ</h1>

                <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Tên hiển thị */}
                    <div>
                        <Label htmlFor="HoTen">Tên hiển thị</Label>
                        <Input
                            type="text"
                            id="HoTen"
                            name="HoTen"
                            placeholder="Tên hiển thị"
                            value={newUser.HoTen}
                            onChange={handleInputChange}
                            className="mt-1 bg-transparent rounded-full"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="Email">Email</Label>
                        <Input
                            type="email"
                            id="Email"
                            name="Email"
                            placeholder="Email"
                            value={newUser.Email}
                            onChange={handleInputChange}
                            className="mt-1 bg-transparent rounded-full"
                        />
                    </div>

                    {/* Số điện thoại */}
                    <div>
                        <Label htmlFor="SoDienThoai">Số điện thoại</Label>
                        <Input
                            type="text"
                            id="SoDienThoai"
                            name="SoDienThoai"
                            placeholder="Số điện thoại"
                            value={newUser.SoDienThoai}
                            onChange={handleInputChange}
                            className="mt-1 bg-transparent rounded-full"
                        />
                    </div>

                    {/* Ngày sinh */}
                    <div>
                        <Label htmlFor="NgaySinh">Ngày sinh</Label>
                        <Input
                            type="date"
                            id="NgaySinh"
                            name="NgaySinh"
                            value={newUser.NgaySinh}
                            onChange={handleInputChange}
                            className="mt-1 bg-transparent rounded-full"
                        />
                    </div>

                    {/* Mật khẩu */}
                    <div className="relative col-span-1 sm:col-span-2">
                        <Label htmlFor="MatKhau">Mật khẩu</Label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            id="MatKhau"
                            name="MatKhau"
                            placeholder="Mật khẩu"
                            value={newUser.MatKhau}
                            onChange={handleInputChange}
                            className="mt-1 bg-transparent rounded-full pr-10"
                        />
                        <div className="absolute inset-y-12 right-0 flex items-center pr-3">
                            <button type="button" onClick={togglePasswordVisibility} className="text-gray-500 hover:text-gray-700">
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>


                    <div className="relative col-span-1 sm:col-span-2">
                        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                        <Input
                            type={showPassword1 ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 bg-transparent rounded-full pr-10"
                        />
                        <div className="absolute inset-y-12 right-0 flex items-center pr-3">
                            <button type="button" onClick={togglePasswordVisibility1} className="text-gray-500 hover:text-gray-700">
                                {showPassword1 ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                    </div>


                    {/* Nút đăng ký */}
                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 rounded mt-2 col-span-1 sm:col-span-2"
                    >
                        Đăng ký
                    </Button>

                    {/* Thông báo lỗi */}
                    {error && <p className="text-red-500 text-center mt-1 col-span-1 sm:col-span-2">{error}</p>}
                </form>

                <p className="text-center mt-3 text-sm col-span-1 sm:col-span-2">
                    Bạn đã có tài khoản?{" "}
                    <Link className="text-blue-500 hover:underline" href="/DangNhap">
                        Đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    );
}


export function RSign() {
    return (
        <Image
            className="object-fit-cover"
            fill={true}
            src="/Olymstore 001361 (2).jpg"
            alt="bg-image"
        />
    );
}
