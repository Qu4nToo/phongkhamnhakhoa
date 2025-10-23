const KhachHang = require("../models/khachHangModel");
const KhachHangController = {
    getAllKhachHang: async (req, res) => {
        try {
            const data = await KhachHang.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    getKhachHangById: async (req, res) => {
        try {
            const { id } = req.params;
            const khachHang = await KhachHang.getById(id);
            if (!khachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng" });
            }
            res.status(200).json(khachHang);
        } catch (error) {
            console.error("Lỗi khi lấy khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    createKhachHang: async (req, res) => {
        try {
            const { HoTen, NgaySinh, SoDienThoai, GioiTinh, Email, DiaChi, MatKhau } = req.body;

            if (!HoTen || !NgaySinh || !SoDienThoai || !GioiTinh || !Email || !DiaChi || !MatKhau) {
                return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: "Email không hợp lệ!" });
            }

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
            }

            if (MatKhau.length < 6) {
                return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
            }

            const result = await KhachHang.create({
                HoTen,
                NgaySinh,
                SoDienThoai,
                GioiTinh,
                Email,
                DiaChi,
                MatKhau
            });

            return res.status(201).json({ message: "Thêm khách hàng thành công!", data: result });

        } catch (error) {
            console.error("Lỗi khi thêm khách hàng:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    updateKhachHang: async (req, res) => {
        try {
            const { id } = req.params;
            const { HoTen, NgaySinh, SoDienThoai, GioiTinh, Email, DiaChi, MatKhau } = req.body;

            if (!HoTen || !NgaySinh || !SoDienThoai || !GioiTinh || !Email || !DiaChi) {
                return res.status(400).json({ message: "Các trường HoTen, NgaySinh, SoDienThoai, GioiTinh, Email, DiaChi là bắt buộc!" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: "Email không hợp lệ!" });
            }

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
            }

            if (MatKhau && MatKhau.length < 6) {
                return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
            }

            const result = await KhachHang.update(id, {
                HoTen,
                NgaySinh,
                SoDienThoai,
                GioiTinh,
                Email,
                DiaChi,
                MatKhau
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng để cập nhật!" });
            }

            return res.status(200).json({ message: "Cập nhật khách hàng thành công!" });

        } catch (error) {
            console.error("Lỗi khi cập nhật khách hàng:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    deleteKhachHang: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedKhachHang = await KhachHang.delete(id);
            if (!deletedKhachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng" });
            }
            return res.status(200).json({ message: "Xóa khách hàng thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = KhachHangController;