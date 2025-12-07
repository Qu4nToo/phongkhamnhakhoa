const HoaDon = require("../models/hoaDonModel");

const HoaDonController = {
    getAllHoaDon: async (req, res) => {
        try {
            const data = await HoaDon.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách hóa đơn:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getHoaDonById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await HoaDon.getById(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy hóa đơn!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getHoaDonByKhachHangId: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await HoaDon.getByKhachHangId(id);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy hóa đơn!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy hóa đơn theo khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createHoaDon: async (req, res) => {
        try {
            const { MaPhieuKham, TongTien, TrangThai, PhuongThuc, MaKhachHang, MaNguoiDung } = req.body;

            if (!MaPhieuKham) {
                return res.status(400).json({ message: "Thiếu trường MaPhieuKham" });
            }
            if (!TongTien) {
                return res.status(400).json({ message: "Thiếu trường TongTien" });
            }
            if (!TrangThai) {
                return res.status(400).json({ message: "Thiếu trường TrangThai" });
            }
            if (!PhuongThuc) {
                return res.status(400).json({ message: "Thiếu trường PhuongThuc" });
            }
            if (!MaKhachHang) {
                return res.status(400).json({ message: "Thiếu trường MaKhachHang" });
            }
            if (!MaNguoiDung) {
                return res.status(400).json({ message: "Thiếu trường MaNguoiDung" });
            }

            const result = await HoaDon.create({
                TongTien,
                PhuongThuc,
                TrangThai,
                MaKhachHang,
                MaPhieuKham,
                MaNguoiDung,
                NgayTao: new Date().toISOString().slice(0, 19).replace('T', ' ')
            });

            res.status(201).json({ message: "Thêm hóa đơn thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm hóa đơn:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateHoaDon: async (req, res) => {
        try {
            const { id } = req.params;
            const { MaPhieuKham, TongTien, NgayThanhToan, TrangThai, PhuongThuc, MaKhachHang, MaNguoiDung } = req.body;

            if (!MaPhieuKham) {
                return res.status(400).json({ message: "Thiếu trường MaPhieuKham" });
            }
            if (!TongTien) {
                return res.status(400).json({ message: "Thiếu trường TongTien" });
            }
            if (!NgayThanhToan) {
                return res.status(400).json({ message: "Thiếu trường NgayThanhToan" });
            }
            if (!TrangThai) {
                return res.status(400).json({ message: "Thiếu trường TrangThai" });
            }
            if (!PhuongThuc) {
                return res.status(400).json({ message: "Thiếu trường PhuongThuc" });
            }
            if (!MaKhachHang) {
                return res.status(400).json({ message: "Thiếu trường MaKhachHang" });
            }
            if (!MaNguoiDung) {
                return res.status(400).json({ message: "Thiếu trường MaNguoiDung" });
            }

            const result = await HoaDon.update(id, {
                MaPhieuKham,
                TongTien,
                NgayThanhToan,
                TrangThai,
                PhuongThuc,
                MaKhachHang,
                MaNguoiDung
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy hóa đơn để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật hóa đơn thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật hóa đơn:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteHoaDon: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await HoaDon.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy hóa đơn!" });
            }
            res.status(200).json({ message: "Xóa hóa đơn thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa hóa đơn:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = HoaDonController;
