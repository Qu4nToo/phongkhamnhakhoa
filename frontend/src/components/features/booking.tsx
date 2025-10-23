"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookingForm() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [bacsi, setBacsi] = useState([]);

  // ✅ Form chứa dữ liệu để gửi
  const [formData, setFormData] = useState({
    MaKhachHang: "",
    MaBacSi: "",
    NgayHen: "",
    GhiChu: "",
    TinhTrang: "0"
  });

  useEffect(() => {
    // ✅ Kiểm tra đăng nhập
    const storedUser = sessionStorage.getItem("user_info");
    if (!storedUser) {
      alert("Vui lòng đăng nhập để đặt lịch!");
      router.push("/DangNhap");
      return;
    }

    const user = JSON.parse(storedUser);
    setUserInfo(user);

    // ✅ Cập nhật Mã khách hàng vào form
    setFormData((prev) => ({
      ...prev,
      MaKhachHang: user.MaKhachHang,
    }));

    // ✅ Lấy danh sách bác sĩ
    axios
      .get("http://localhost:5000/api/bac-si/get")
      .then((res) => setBacsi(res.data))
      .catch((error) => console.log(error));
  }, [router]);

  // ✅ Hàm xử lý thay đổi
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("Form data updated:", { ...formData, [name]: value });
  };

  // ✅ Gửi dữ liệu tạo lịch hẹn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo) {
      alert("Bạn cần đăng nhập để đặt lịch!");
      router.push("/DangNhap");
      return;
    }

    // Kiểm tra bắt buộc
    if (!formData.MaBacSi || !formData.NgayHen) {
      alert("Vui lòng chọn bác sĩ và ngày hẹn!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/lich-hen/create", formData);
      alert("Đặt lịch thành công!");
      console.log("Dữ liệu gửi:", formData);
      router.push("/LichHen");
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      alert("Đặt lịch thất bại!");
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
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white mb-3 mt-3">
      {/* Form bên trái */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-green-600 font-semibold text-xl">Thông tin đặt lịch</h2>

        <input
          type="text"
          name="MaKhachHang"
          value={userInfo.MaKhachHang}
          onChange={handleChange}
          readOnly
        />


        {/* Họ tên */}
        <input
          type="text"
          placeholder="Họ tên"
          value={userInfo.HoTen}
          className="w-full text-black border border-black rounded-md p-2"
          readOnly
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={userInfo.Email}
          className="w-full text-black border border-black rounded-md p-2"
          readOnly
        />

        {/* Chọn bác sĩ */}
        <div>
          <label className="font-semibold text-black">Chọn bác sĩ:</label>
          <select
            name="MaBacSi"
            value={formData.MaBacSi}
            onChange={handleChange}
            className="w-full text-black border border-black rounded-md p-2 mt-2"
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

        {/* Ngày hẹn */}
        <div>
          <label className="font-semibold text-black">Ngày hẹn:</label>
          <input
            type="date"
            name="NgayHen"
            value={formData.NgayHen}
            onChange={handleChange}
            className="w-full text-black border border-black rounded-md p-2 mt-2"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Ghi chú */}
        <textarea
          name="GhiChu"
          placeholder="Ghi chú (tùy chọn)"
          value={formData.GhiChu}
          onChange={handleChange}
          className="w-full text-black border border-black rounded-md p-2 h-28"
        />

        <button
          type="submit"
          className="bg-gray-500 hover:bg-green-600 text-white font-medium px-5 py-2 rounded-md"
        >
          Đặt lịch
        </button>
      </form>

      {/* Thông tin phòng khám */}
      <div className="text-black space-y-3">
        <h3 className="text-green-600 font-semibold text-xl mb-3">Thông tin phòng khám</h3>
        <p><strong>Địa chỉ:</strong> 346 Võ Văn Tần, P. Bàn Cờ, TP. HCM</p>
        <p><strong>Tổng đài:</strong> 1900 4775</p>
        <p><strong>Mobile:</strong> 0937007712</p>
        <p><strong>Email:</strong> info@nhakhoaocare.com</p>
        <p>
          <strong>Thời gian làm việc:</strong><br />
          Sáng 8h00–12h00 & Chiều 13h00–19h00<br />
          <span className="text-orange-600 italic">*Chủ nhật, lễ tết nghỉ</span>
        </p>
      </div>
    </div>
  );
}
