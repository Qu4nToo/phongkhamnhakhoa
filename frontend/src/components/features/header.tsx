'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu as MenuIcon, X, Phone } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTitle } from './TitleContext';
import { useRouter } from "next/navigation";
import axios from '@/lib/axios';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setTitle } = useTitle();
    const router = useRouter();
    const [userInfo, setUserInfo] = useState<any>(null);
    const [openDichVu, setOpenDichVu] = useState(false); // dropdown mobile
    const [loaiDichVuList, setLoaiDichVuList] = useState([]);

    useEffect(() => {
        const storedUserInfo = sessionStorage.getItem("user_info");
        if (storedUserInfo) {
            const user = JSON.parse(storedUserInfo);
            setUserInfo(user);
        }
        axios.get("http://localhost:5000/api/loai-dich-vu/get")
            .then(response => setLoaiDichVuList(response.data))
            .catch(err => console.error("Error fetching services:", err));

    }, []);
    const dichVuList = loaiDichVuList
        .filter((dv: any) => dv?.TenLoaiDV)
        .map((dv: any) => ({
            name: dv.TenLoaiDV,
            href: `/DichVu/${dv?.Slug}`,
        }));
    const handleSignOut = () => {
        import('@/lib/auth').then(({ logout }) => {
            logout();
            setUserInfo(null);
        });
    };

    const handleXemLichHen = () => {
        router.push("/ThongTin");
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl"><img src="/logo.png" alt="Logo" /></span>
                        </div>
                        <span className="ml-3 font-bold text-blue-900">Nha Khoa Hoàng Quân</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <a
                            href="/"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Trang Chủ
                        </a>

                        {/* Dịch vụ Dropdown */}
                        <div className="relative group">
                            <button className="inline-flex items-center font-bold text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                                Dịch Vụ
                                <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                                    <div className="py-2">
                                        {dichVuList.map((dv) => (
                                            <Link
                                                key={dv.name}
                                                href={dv.href}
                                                className="block px-5 py-3 text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                                            >
                                                {dv.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <a
                            href="/GioiThieu"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Về Chúng Tôi
                        </a>

                        <a
                            href="/BangGia"
                            className="text-gray-700 font-bold hover:text-blue-600 transition-colors cursor-pointer"
                        >
                            Bảng giá
                        </a>
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        <Menu as="div" className="relative group">
                            <MenuButton className="flex rounded-full focus:outline-none">
                                <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-gray-200">
                                    <img
                                        alt="user"
                                        src={userInfo?.anhDaiDien || "/user.png"}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </MenuButton>
                            <div className="absolute right-0 top-full pt-2 w-52 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <MenuItems className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
                                    <div className="py-2">
                                        {userInfo ? (
                                            <>
                                                <MenuItem>
                                                    <div className="px-5 py-3 border-b border-gray-200">
                                                        <p className="text-xs text-gray-500 mb-1">Xin chào</p>
                                                        <p className="text-[16px] font-bold text-blue-600">
                                                            {userInfo?.hoTen || "Name"}
                                                        </p>
                                                    </div>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={handleXemLichHen}
                                                        className="block w-full text-left px-5 py-3 text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        Thông tin của tôi
                                                    </button>
                                                </MenuItem>
                                                <MenuItem>
                                                    <button
                                                        onClick={handleSignOut}
                                                        className="block w-full text-left px-5 py-3 text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        Đăng xuất
                                                    </button>
                                                </MenuItem>
                                            </>
                                        ) : (
                                            <>
                                                <MenuItem>
                                                    <Link
                                                        href="/DangNhap"
                                                        className="block px-5 py-3 text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        Đăng nhập
                                                    </Link>
                                                </MenuItem>
                                                <MenuItem>
                                                    <Link
                                                        href="/DangKy"
                                                        className="block px-5 py-3 text-[15px] font-bold text-gray-700 hover:text-blue-600 transition-colors"
                                                    >
                                                        Đăng ký
                                                    </Link>
                                                </MenuItem>
                                            </>
                                        )}
                                    </div>
                                </MenuItems>
                            </div>
                        </Menu>
                        <Link
                            href="/DatLich"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Đặt Lịch Khám
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-gray-700" />
                        ) : (
                            <MenuIcon className="w-6 h-6 text-gray-700" />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden fixed inset-0 top-[72px] bg-white z-40 overflow-y-auto pb-4 space-y-4 px-4">
                        <a
                            href="#home"
                            className="block text-gray-700 font-bold hover:text-blue-600 cursor-pointer"
                        >
                            Trang Chủ
                        </a>

                        {/* Mobile Dịch vụ Dropdown */}
                        <div>
                            <button
                                onClick={() => setOpenDichVu(!openDichVu)}
                                className="flex justify-between items-center w-full text-gray-700 font-bold hover:text-blue-600"
                            >
                                Dịch Vụ
                                <svg
                                    className={`h-5 w-5 transition-transform duration-300 ${openDichVu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openDichVu ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="pl-4 space-y-2">
                                    {dichVuList.map((dv) => (
                                        <Link
                                            key={dv.name}
                                            href={dv.href}
                                            className="block text-base text-gray-700 font-bold hover:text-blue-600"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {dv.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <a
                            href="#about"
                            className="block text-gray-700 font-bold hover:text-blue-600 cursor-pointer"
                        >
                            Về Chúng Tôi
                        </a>

                        <a
                            href="#contact"
                            className="block text-gray-700 font-bold hover:text-blue-600 cursor-pointer"
                        >
                            Liên Hệ
                        </a>

                        <div className="pt-4 border-t border-gray-200">
                            {userInfo ? (
                                <>
                                    <div className="mb-4 px-4 py-2 border-b border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Xin chào</p>
                                        <p className="text-[16px] font-bold text-blue-600">
                                            {userInfo?.hoTen || "Name"}
                                        </p>
                                    </div>
                                    <div className="mb-4">
                                        <button
                                            onClick={() => {
                                                handleXemLichHen();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 font-bold hover:text-blue-600 transition-colors"
                                        >
                                            Thông tin của tôi
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsMenuOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 font-bold hover:text-blue-600 transition-colors"
                                        >
                                            Đăng xuất
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-4 space-y-2">
                                    <Link
                                        href="/DangNhap"
                                        className="block px-4 py-2 text-sm text-gray-700 font-bold hover:text-blue-600 transition-colors rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        href="/DangKy"
                                        className="block px-4 py-2 text-sm text-gray-700 font-bold hover:text-blue-600 transition-colors rounded-md"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}

                            <Link
                                href="/DatLich"
                                className="block w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Đặt Lịch Khám
                            </Link>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
