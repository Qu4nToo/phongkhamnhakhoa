"use client";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "../ui/card";
import { Label } from "../ui/label";
import { toast, Toaster } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { cn } from "../ui/utils";

export default function BookingForm() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bacsi, setBacsi] = useState([]);

  const [formData, setFormData] = useState({
    MaKhachHang: "",
    MaBacSi: "",
    NgayHen: "",
    GhiChu: "",
    TinhTrang: "0",
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_info");
    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);
    setUserInfo(user);
    setFormData((prev) => ({ ...prev, MaKhachHang: user.MaKhachHang }));

    axios
      .get("http://localhost:5000/api/bac-si/get")
      .then((res) => setBacsi(res.data))
      .catch((error) => console.log(error));
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      return (
        <div className="text-center py-10 text-black">
          <p>Bạn cần đăng nhập để đặt lịch hẹn.</p>
          <button
            onClick={() => router.push("/DangNhap")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
          >
            Đăng nhập ngay
          </button>
        </div>
      );
    }

    if (!formData.MaBacSi || !formData.NgayHen) {
      toast.error("Vui lòng chọn bác sĩ và ngày hẹn!", {
        action: {
          label: "Đóng",
          onClick: () => toast.dismiss(),
        },
        style: {
          background: "#fef2f2",
          color: "#991b1b",
          borderRadius: "10px",
          border: "1px solid #ef4444",
        },
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/lich-hen/create", formData);
      toast.success("Đặt lịch thành công!", {
        action: {
          label: "Đóng",
          onClick: () => toast.dismiss(),
        },
        style: {
          background: "#ecfdf5",
          color: "#065f46",
          borderRadius: "10px",
          border: "1px solid #10b981",
        },
      });
      router.push("/LichHen");
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Lỗi không xác định!", {
          action: {
            label: "Đóng",
            onClick: () => toast.dismiss(),
          },
          style: {
            background: "#ecfdf5",
            color: "#065f46",
            borderRadius: "10px",
            border: "1px solid #10b981",
          },
        });
      } else {
        toast.error("Lỗi không xác định!", {
          action: {
            label: "Đóng",
            onClick: () => toast.dismiss(),
          },
          style: {
            background: "#ecfdf5",
            color: "#065f46",
            borderRadius: "10px",
            border: "1px solid #10b981",
          },
        });
      }
    }
  };

  if (!userInfo) {
    return (
      <div className="text-center py-10 text-black">
        <p>Bạn cần đăng nhập để đặt lịch hẹn.</p>
        <button
          onClick={() => router.push("/DangNhap")}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-xl p-5">
          <CardDescription className="text-blue-50">
            Vui lòng điền thông tin của bạn để đặt lịch
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <input
            type="hidden"
            name="MaKhachHang"
            value={userInfo.MaKhachHang}
          />

          {/* Họ tên */}
          <div>
            <Label>Họ và tên</Label>
            <input
              type="text"
              value={userInfo.HoTen}
              readOnly
              className="w-full bg-gray-50 border border-gray-300 text-black rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <input
              type="email"
              value={userInfo.Email}
              readOnly
              className="w-full bg-gray-50 border border-gray-300 text-black rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Bác sĩ */}
          <div>
            <Label>Chọn bác sĩ </Label>
            <select
              name="MaBacSi"
              value={formData.MaBacSi}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">-- Chọn bác sĩ --</option>
              {bacsi.map((bs: any) => (
                <option key={bs.MaBacSi} value={bs.MaBacSi}>
                  {bs.HoTen}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày hẹn 0 */}
          {/* <div>
            <Label>Ngày hẹn *</Label>
            <input
              type="date"
              name="NgayHen"
              value={formData.NgayHen}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div> */}
          {/* Ngày hẹn 1 */}
          {/* <div className="flex flex-col">
            <Label className="mb-1">Ngày hẹn</Label>
            <div className="relative">
              <DatePicker
                selected={formData.NgayHen ? new Date(formData.NgayHen) : null}
                onChange={(date: Date | null) => {
                  if (!date) return;

                  const today = new Date();
                  const maxDate = new Date();
                  maxDate.setDate(today.getDate() + 30);

                  // Nếu chọn Chủ Nhật
                  if (date.getDay() === 0) {
                    toast.error(
                      "Không thể chọn Chủ Nhật. Vui lòng chọn từ Thứ 2 đến Thứ 7!",
                      {
                        action: {
                          label: "Đóng",
                          onClick: () => toast.dismiss(),
                        },
                        style: {
                          background: "#fef2f2",
                          color: "#991b1b",
                          borderRadius: "10px",
                          border: "1px solid #ef4444",
                        },
                      }
                    );
                    return;
                  }

                  // Nếu vượt quá 30 ngày
                  if (date > maxDate) {
                    toast.error(
                      "Bạn chỉ có thể đặt lịch trong vòng 30 ngày tới!",
                      {
                        action: {
                          label: "Đóng",
                          onClick: () => toast.dismiss(),
                        },
                        style: {
                          background: "#fef2f2",
                          color: "#991b1b",
                          borderRadius: "10px",
                          border: "1px solid #ef4444",
                        },
                      }
                    );
                    return;
                  }

                  setFormData((prev) => ({
                    ...prev,
                    NgayHen: date.toISOString().split("T")[0],
                  }));
                }}
                minDate={new Date()}
                maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                filterDate={(date) => date.getDay() !== 0}
                dateFormat="dd/MM/yyyy"
                placeholderText="Chọn ngày hẹn"
                className="w-full border border-gray-300 text-black rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div> */}
          {/* Ngày hẹn 2 */}
          <div className="flex flex-col">
            <Label className="mb-1">Ngày hẹn</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border border-gray-300 bg-gray-50 hover:bg-gray-100",
                    !formData.NgayHen && "text-gray-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.NgayHen ? (
                    format(new Date(formData.NgayHen), "dd/MM/yyyy", {
                      locale: vi,
                    })
                  ) : (
                    <span>Chọn ngày hẹn</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto p-0 bg-white border border-gray-200 shadow-lg rounded-lg"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={
                    formData.NgayHen ? new Date(formData.NgayHen) : undefined
                  }
                  onSelect={(date) => {
                    if (!date) return;

                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setDate(today.getDate() + 30);

                    // Chặn Chủ Nhật
                    if (date.getDay() === 0) {
                      toast.error("Không thể chọn Chủ Nhật. Vui lòng chọn từ Thứ 2 đến Thứ 7!");
                      return;
                    }

                    // Chặn vượt quá 30 ngày
                    if (date > maxDate) {
                      toast.error("Bạn chỉ có thể đặt lịch trong vòng 30 ngày tới!");
                      return;
                    }

                    // ✅ Sửa chỗ này
                    setFormData((prev) => ({
                      ...prev,
                      NgayHen: date.toLocaleDateString("en-CA"), // hoặc format(date, "yyyy-MM-dd")
                    }));
                  }}
                  disabled={(date) =>
                    date.getDay() === 0 ||
                    date < new Date() ||
                    date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Ghi chú */}
          <div>
            <Label>Ghi chú (tùy chọn)</Label>
            <textarea
              name="GhiChu"
              value={formData.GhiChu}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md p-2 h-24 bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Thêm ghi chú nếu cần..."
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            Đặt lịch hẹn
          </button>
        </CardContent>
      </Card>
    </>
  );
}
