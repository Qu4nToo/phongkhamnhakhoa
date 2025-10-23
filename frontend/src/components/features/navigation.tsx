"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTitle } from "./TitleContext";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Giới thiệu", href: "/", current: false },
  { name: "Dịch vụ", href: "/", current: false },
  { name: "Bảng giá", href: "/", current: false },
  { name: "Đặt lịch", href: "/DatLich", current: false },
];

export default function Navbar() {
  const { setTitle } = useTitle();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo(user);
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("user_info");
    localStorage.removeItem("cart");
    alert("Đăng xuất thành công!");
    window.location.reload();
  };

  const handleXemLichHen = () => {
    router.push("/LichHen");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm("");
    }
  };

  return (
    <Disclosure
      as="nav"
      className="bg-[#4CAF50] sticky top-0 z-10 shadow-md transition-all"
    >
      <div className="max-w-full mx-auto px-6">
        <div className="flex items-center justify-between h-[80px]">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <img
                alt="Logo"
                src="/logo.png"
                className="h-14 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Navigation items */}
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setTitle("ALL")}
                className={classNames(
                  "text-white px-4 py-2 rounded-md text-[17px] font-medium transition-all duration-200",
                  "hover:bg-[#66bb6a] hover:text-white hover:shadow-md"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search + user menu */}
          <div className="flex items-center space-x-4">
            {/* Search icon */}
            <div className="relative">
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 border border-white rounded-sm hover:bg-white/20 transition"
              >
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>

              {showSearch && (
                <form
                  onSubmit={handleSearch}
                  className="absolute right-0 mt-2 bg-white rounded-lg shadow-md p-2 flex items-center space-x-2"
                >
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-green-300 text-sm"
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-semibold"
                  >
                    Tìm
                  </button>
                </form>
              )}
            </div>

            {/* User dropdown */}
            <Menu as="div" className="relative">
              <MenuButton className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                <img alt="user" src="/user.png" className="h-8 w-8 rounded-full" />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                {userInfo ? (
                  <>
                    <MenuItem>
                      <span className="block px-4 py-2 text-sm text-gray-700 font-bold">
                        {userInfo.HoTen || "Name"}
                      </span>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleXemLichHen}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Xem lịch hẹn
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng nhập
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link
                        href="/DangKy"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Đăng ký
                      </Link>
                    </MenuItem>
                  </>
                )}
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
