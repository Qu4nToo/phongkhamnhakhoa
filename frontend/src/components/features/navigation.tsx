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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const navigation = [
  { name: "Giới thiệu", href: "/", current: false },
  { name: "Dịch vụ", href: "#", current: false },
  { name: "Bảng giá", href: "/", current: false },
  { name: "Đặt lịch", href: "/DatLich", current: false },
];

const dichVuList = [
  { name: "Khám tổng quát", href: "/DichVu/TongQuat" },
  { name: "Niềng răng", href: "/DichVu/NiengRang" },
  { name: "Tẩy trắng răng", href: "/DichVu/TayTrang" },
  { name: "Cấy ghép Implant", href: "/DichVu/Implant" },
];

export default function Navbar() {
  const { setTitle } = useTitle();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [openDichVu, setOpenDichVu] = useState(false); // dropdown mobile

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("user_info");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo(user);
    }
  }, []);

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
      className="bg-[#4CAF50] sticky top-0 z-10 shadow-md transition-all"
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
                    <Menu as="div" className="relative" key={item.name}>
                      <MenuButton className="inline-flex items-center text-white px-4 py-1.5 rounded-md text-[16px] font-medium hover:bg-[#66bb6a] hover:shadow-md transition-all">
                        Dịch vụ
                        <ChevronDownIcon className="ml-1 h-5 w-5" />
                      </MenuButton>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <MenuItems className="absolute left-0 mt-2 w-48 origin-top-left bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {dichVuList.map((dv) => (
                            <MenuItem key={dv.name}>
                              {({ active }) => (
                                <Link
                                  href={dv.href}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "block px-4 py-2 text-sm"
                                  )}
                                >
                                  {dv.name}
                                </Link>
                              )}
                            </MenuItem>
                          ))}
                        </MenuItems>
                      </Transition>
                    </Menu>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setTitle("ALL")}
                      className={classNames(
                        "text-white px-4 py-1.5 rounded-md text-[16px] font-medium transition-all duration-200",
                        "hover:bg-[#66bb6a] hover:text-white hover:shadow-md"
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

                {/* Burger icon (mobile) */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-[#66bb6a] focus:outline-none">
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
          <Disclosure.Panel className="md:hidden bg-[#4CAF50] px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) =>
              item.name === "Dịch vụ" ? (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenDichVu(!openDichVu)}
                    className="flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#66bb6a]"
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
                          className="block text-white text-sm py-1 hover:bg-[#66bb6a] rounded-md px-2"
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
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#66bb6a]"
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
