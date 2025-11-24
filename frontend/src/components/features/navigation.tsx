"use client";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useTitle } from "./TitleContext";
import axios from "axios";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Giới thiệu", href: "/", current: false },
  { name: "Dịch vụ", href: "#", current: false },
  { name: "Bảng giá", href: "/", current: false },
  { name: "Đặt lịch", href: "/DatLich", current: false },
];



export default function Navbar() {
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
      href: `/DichVu/${dv.TenLoaiDV.replace(/\s+/g, "")}`,
    }));
  const handleSignOut = () => {
    sessionStorage.removeItem("user_info");
    globalThis.location.reload();
  };

  const handleXemLichHen = () => {
    router.push("/LichHen");
  };

  return (
    <Disclosure
      as="nav"
      className="bg-white sticky top-0 z-10 shadow-md transition-all"
    >
      {({ open }) => (
        <>
          <div className="max-w-full mx-auto px-6">
            <div className="flex items-center justify-between h-[64px]">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/">
                  <img
                    alt="Logo"
                    src="/logo.png"
                    className="h-10 w-auto cursor-pointer"
                  />
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex space-x-4 lg:space-x-8">
                {navigation.map((item) =>
                  item.name === "Dịch vụ" ? (
                    <div 
                      key={item.name} 
                      className="relative group"
                    >
                      <div className="inline-flex items-center text-blue-950 px-4 py-1.5 text-[16px] font-medium hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white transition-all cursor-pointer">
                        Dịch vụ
                        <ChevronDownIcon className="ml-1 h-5 w-5" />
                      </div>

                      {/* Dropdown menu on hover */}
                      <div className="absolute left-0 mt-2 w-64 origin-top-left bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-2">
                          {dichVuList.map((dv) => (
                            <Link
                              key={dv.name}
                              href={dv.href}
                              className="block px-5 py-3 text-[15px] font-bold text-blue-600 hover:bg-[#013f6b] hover:text-white transition-colors"
                            >
                              {dv.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setTitle("ALL")}
                      className={classNames(
                        "text-blue-950 px-4 py-1.5 text-[16px] font-medium transition-all duration-200",
                        "hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>

              {/* User menu + Burger icon */}
              <div className="flex items-center space-x-4">
                {/* User dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white">
                    <img
                      alt="user"
                      src="/user.png"
                      className="h-7 w-7 rounded-full"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-52 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                    {userInfo ? (
                      <>
                        <MenuItem>
                          <span className="block px-4 py-2 text-sm text-gray-700 font-bold">
                            {userInfo?.khachHang.HoTen || "Name"}
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

                {/* Burger icon (mobile) */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-blue-950 hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white focus:outline-none">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="md:hidden bg-white px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) =>
              item.name === "Dịch vụ" ? (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenDichVu(!openDichVu)}
                    className="flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium text-blue-950 hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white"
                  >
                    Dịch vụ
                    {openDichVu ? (
                      <ChevronDownIcon className="h-5 w-5" />
                    ) : (
                      <ChevronRightIcon className="h-5 w-5" />
                    )}
                  </button>

                  {openDichVu && (
                    <div className="pl-6 space-y-1">
                      {dichVuList.map((dv) => (
                        <Link
                          key={dv.name}
                          href={dv.href}
                          className="block text-blue-950 text-sm py-1 hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white rounded-md px-2"
                        >
                          {dv.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-blue-950 hover:text-sky-600 hover:border-sky-600 border-b-2 border-b-white"
                >
                  {item.name}
                </Link>
              )
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
