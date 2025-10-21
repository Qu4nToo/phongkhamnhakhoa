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

    createHoaDon: async (req, res) => {
        try {
            const { MaPhieuKham, TongTien, NgayLap, TrangThai } = req.body;

            if (!MaPhieuKham || !TongTien || !NgayLap || !TrangThai) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            const result = await HoaDon.create({
                MaPhieuKham,
                TongTien,
                NgayLap,
                TrangThai
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
            const { MaPhieuKham, TongTien, NgayLap, TrangThai } = req.body;

              if (!MaPhieuKham || !TongTien || !NgayLap || !TrangThai) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            const result = await HoaDon.update(id, {
                MaPhieuKham,
                TongTien,
                NgayLap,
                TrangThai
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
