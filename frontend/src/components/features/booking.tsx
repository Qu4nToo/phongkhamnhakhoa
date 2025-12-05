"use client";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { toast, Toaster } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { cn } from "../ui/utils";

export default function BookingForm() {
  interface BacSi {
    MaBacSi: string;
    HoTen: string;
    SoDienThoai: string;
    Email: string;
    MatKhau: string;
    KinhNghiem: number;
    NgaySinh: string;
    DiaChi: string;
    MaLichLamViec: string;
    ThuTrongTuan: string;
  }
  interface LichLamViec {
    MaLichLamViec: string;
    MaBacSi: string;
    ThuTrongTuan: string;
  }

  interface DichVu {
    MaDichVu: string;
    TenDichVu: string;
    Gia: number;
    MoTa: string;
    ThoiLuong: number;
    DonVi: string;
    MaLoaiDV: string;
  }

  interface TimeSlot {
    value: string;
    label: string;
    available: boolean;
  }

  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bacsi, setBacsi] = useState<BacSi[]>([]);
  const [selectedBacSi, setSelectedBacSi] = useState<BacSi | null>(null);
  const [lichlamviec, setLichLamViec] = useState<LichLamViec[]>([]);
  const [dichVuList, setDichVuList] = useState<DichVu[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [formData, setFormData] = useState({
    MaKhachHang: "",
    MaBacSi: "",
    MaDichVu: "",
    NgayHen: "",
    GioHen: "",
    GhiChu: "",
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user_info");
    if (!storedUser) {
      return;
    }

    const user = JSON.parse(storedUser);
    setUserInfo(user);
    setFormData((prev) => ({ ...prev, MaKhachHang: user.khachHang.MaKhachHang }));

    // Lấy danh sách dịch vụ ngay từ đầu
    axios
      .get("http://localhost:5000/api/dich-vu/get")
      .then((res) => setDichVuList(res.data))
      .catch((error) => console.log(error));
  }, [router]);

  // Lấy danh sách bác sĩ khi chọn dịch vụ
  useEffect(() => {
    if (formData.MaDichVu) {
      // Reset bác sĩ, ngày, giờ khi thay đổi dịch vụ
      setFormData(prev => ({ ...prev, MaBacSi: "", NgayHen: "", GioHen: "" }));
      setSelectedBacSi(null);
      setLichLamViec([]);
      setTimeSlots([]);

      axios
        .get(`http://localhost:5000/api/bac-si/getBacSiByDichVu/${formData.MaDichVu}`)
        .then((res) => {
          setBacsi(res.data);
        })
        .catch((error) => {
          console.log(error);
          setBacsi([]);
          toast.error("Đã có lỗi khi lấy danh sách bác sĩ!");
        });
    } else {
      setBacsi([]);
      setFormData(prev => ({ ...prev, MaBacSi: "", NgayHen: "", GioHen: "" }));
      setSelectedBacSi(null);
      setLichLamViec([]);
      setTimeSlots([]);
    }
  }, [formData.MaDichVu]);

  // Lấy các slot thời gian khả dụng khi thay đổi ngày, bác sĩ hoặc dịch vụ
  useEffect(() => {
    if (formData.NgayHen && formData.MaBacSi && formData.MaDichVu) {
      axios
        .get(`http://localhost:5000/api/lich-hen/available-slots`, {
          params: {
            bacSiId: formData.MaBacSi,
            ngayHen: formData.NgayHen,
            dichVuId: formData.MaDichVu,
          },
        })
        .then((res) => {
          setTimeSlots(res.data);
        })
        .catch((error) => {
          console.log(error);
          setTimeSlots([]);
        });
    } else {
      setTimeSlots([]);
    }
  }, [formData.NgayHen, formData.MaBacSi, formData.MaDichVu]);

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
            className="mt-4 bg-[#004576] text-white px-6 py-2 rounded-md hover:bg-[#003153]"
          >
            Đăng nhập ngay
          </button>
        </div>
      );
    }

    if (!formData.MaBacSi || !formData.NgayHen || !formData.MaDichVu) {
      toast.error("Vui lòng chọn bác sĩ, dịch vụ và ngày hẹn!", {
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
      setFormData({
        MaKhachHang: userInfo.khachHang.MaKhachHang,
        MaBacSi: "",
        MaDichVu: "",
        NgayHen: "",
        GioHen: "",
        GhiChu: "",
      });
      router.push("/LichHen");
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Lỗi không xác định!";

        toast.error(errorMessage, {
          action: {
            label: "Đóng",
            onClick: () => toast.dismiss(),
          },
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: "10px",
            border: "1px solid #fca5a5",
          },
        });
      } else {
        toast.error("Lỗi không xác định!", {
          action: {
            label: "Đóng",
            onClick: () => toast.dismiss(),
          },
          style: {
            background: "#fef2f2",
            color: "#dc2626",
            borderRadius: "10px",
            border: "1px solid #fca5a5",
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
          className="mt-4 bg-[#004576] text-white px-6 py-2 rounded-md hover:bg-[#003153]"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  function handleCalendar(selected: BacSi | null) {
    if (!selected) {
      setLichLamViec([]);
      return;
    }

    axios
      .get(`http://localhost:5000/api/lich-lam-viec/getByBacSi/${selected.MaBacSi}`)
      .then((res) => {
        // res.data là mảng các lịch làm việc
        setLichLamViec(res.data);
      })
      .catch((err) => {
        console.error("Lỗi lấy lịch làm việc:", err);
        setLichLamViec([]);
        toast.error("Không thể lấy lịch làm việc của bác sĩ!");
      });
  }


  return (
    <>
      <Toaster position="bottom-right" />
      <Card className="shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gradient-to-r from-[#004576] to-[#003153] text-white rounded-t-xl p-5">
          <CardDescription className="text-blue-50">
            Vui lòng điền thông tin của bạn để đặt lịch
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-5">
          <input
            name="MaKhachHang"
            value={userInfo.khachHang.MaKhachHang}
            onChange={handleChange}
            hidden
          />

          {/* Họ tên */}
          <div>
            <Label>Họ và tên</Label>
            <input
              type="text"
              value={userInfo.khachHang.HoTen}
              readOnly
              className="w-full bg-gray-50 border border-gray-300 text-black rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <input
              type="email"
              value={userInfo.khachHang.Email}
              readOnly
              className="w-full bg-gray-50 border border-gray-300 text-black rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          {/* Dịch vụ */}
          <div>
            <Label>Chọn dịch vụ</Label>
            <select
              name="MaDichVu"
              value={formData.MaDichVu}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-400 outline-none"
              required
            >
              <option value="">-- Chọn dịch vụ --</option>
              {dichVuList.map((dv) => (
                <option key={dv.MaDichVu} value={dv.MaDichVu}>
                  {dv.TenDichVu} ({dv.ThoiLuong} phút)
                </option>
              ))}
            </select>
          </div>

          {/* Bác sĩ */}
          <div>
            <Label>Chọn bác sĩ</Label>
            <select
              name="MaBacSi"
              value={formData.MaBacSi}
              onChange={(e) => {
                handleChange(e);
                const selected = bacsi.find(
                  (bs) => bs.MaBacSi === e.target.value
                );
                setSelectedBacSi(selected || null);
                handleCalendar(selected || null);
              }}
              className="w-full border border-gray-300 text-black rounded-md p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={!formData.MaDichVu}
            >
              <option value="">
                {!formData.MaDichVu
                  ? "Vui lòng chọn dịch vụ trước"
                  : bacsi.length === 0
                  ? "Không có bác sĩ cho dịch vụ này"
                  : "-- Chọn bác sĩ --"}
              </option>
              {bacsi.map((bs: any) => (
                <option key={bs.MaBacSi} value={bs.MaBacSi}>
                  {bs.HoTen}
                </option>
              ))}
            </select>
          </div>

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
                    maxDate.setDate(today.getDate() + 7);

                    // Chặn Chủ Nhật
                    if (date.getDay() === 0) {
                      toast.error(
                        "Không thể chọn Chủ Nhật. Vui lòng chọn từ Thứ 2 đến Thứ 7!"
                      );
                      return;
                    }

                    // Chặn vượt quá 30 ngày
                    if (date > maxDate) {
                      toast.error(
                        "Bạn chỉ có thể đặt lịch trong vòng 30 ngày tới!"
                      );
                      return;
                    }

                    // ✅ Sửa chỗ này
                    setFormData((prev) => ({
                      ...prev,
                      NgayHen: date.toLocaleDateString("en-CA"), // hoặc format(date, "yyyy-MM-dd")
                    }));
                  }}


                  // Disabled function
                  disabled={(date) => {
                    const thuMap: Record<string, number> = {
                      "Chủ Nhật": 0,
                      "Thứ Hai": 1,
                      "Thứ Ba": 2,
                      "Thứ Tư": 3,
                      "Thứ Năm": 4,
                      "Thứ Sáu": 5,
                      "Thứ Bảy": 6,
                    };


                    const workingDays = lichlamviec.map((lv) => thuMap[lv.ThuTrongTuan.trim()]);
                    const today = new Date();
                    const maxDate = new Date();
                    maxDate.setDate(today.getDate() + 7);

                    // Nếu ngày không thuộc workingDays hoặc quá sớm/quá muộn → disabled
                    return (
                      !workingDays.includes(date.getDay()) ||
                      date < today ||
                      date > maxDate
                    );
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Giờ hẹn */}
          <div>
            <Label>Chọn giờ hẹn</Label>
            <select
              name="GioHen"
              value={formData.GioHen}
              onChange={handleChange}
              className="w-full border border-gray-300 text-black rounded-md p-2 mt-1 bg-white focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={!formData.NgayHen || !formData.MaBacSi || !formData.MaDichVu}
            >
              <option value="">
                {!formData.NgayHen || !formData.MaBacSi || !formData.MaDichVu
                  ? "Vui lòng chọn bác sĩ, dịch vụ và ngày hẹn trước"
                  : timeSlots.length === 0
                  ? "Không có thời gian khả dụng"
                  : "-- Chọn giờ --"}
              </option>
              {timeSlots.map((slot) => (
                <option 
                  key={slot.value} 
                  value={slot.value} 
                  disabled={!slot.available}
                  className={!slot.available ? "text-gray-400 bg-gray-100" : "text-black"}
                >
                  {slot.label} {!slot.available ? "❌ (Đã đặt)" : "✅"}
                </option>
              ))}
            </select>
            {timeSlots.length > 0 && timeSlots.filter(s => s.available).length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                ⚠️ Tất cả các khung giờ đã được đặt. Vui lòng chọn ngày khác.
              </p>
            )}
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
            className="w-full bg-[#004576] hover:bg-[#003153] text-white font-medium py-2 rounded-md transition duration-200"
          >
            Đặt lịch hẹn
          </button>
        </CardContent>
      </Card>
    </>
  );
}
