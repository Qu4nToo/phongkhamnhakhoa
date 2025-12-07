const PhieuKham = require("../models/phieuKhamModel");

const PhieuKhamController = {
    getAllPhieuKham: async (req, res) => {
        try {
            const data = await PhieuKham.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getById(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamByIdBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getByBacSiId(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } 
        catch (error) {
            console.error("Lỗi khi lấy phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamByKhachHangId: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getByKhachHangId(id);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } 
        catch (error) {
            console.error("Lỗi khi lấy phiếu khám theo khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createPhieuKham: async (req, res) => {
        try {
            const { MaKhachHang, MaBacSi, NgayKham, MaLichHen } = req.body;

            if (!MaKhachHang || !MaBacSi || !NgayKham || !MaLichHen) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            // 1. THÊM BƯỚC KIỂM TRA TỒN TẠI
            const existingPhieuKham = await PhieuKham.findByFields({
                MaKhachHang,
                MaBacSi,
                NgayKham,
                MaLichHen
            });

            if (existingPhieuKham && existingPhieuKham.length > 0) {
                return res.status(409).json({
                    message: "Phiếu khám của lịch hẹn này đã tồn tại!"
                });
            }
            // -----------------------------------

            // 2. Nếu chưa tồn tại, tiến hành tạo mới
            const result = await PhieuKham.create({
                MaKhachHang,
                MaBacSi,
                NgayKham,
                MaLichHen
            });

            res.status(201).json({ message: "Thêm phiếu khám thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updatePhieuKham: async (req, res) => {
        try {
            const { id } = req.params;
            const { MaKhachHang, MaBacSi, NgayKham, ChuanDoan, GhiChu, TrangThai } = req.body;

            if (!MaKhachHang || !MaBacSi || !NgayKham || !ChuanDoan) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            const result = await PhieuKham.update(id, {
                MaKhachHang,
                MaBacSi,
                NgayKham,
                ChuanDoan,
                GhiChu,
                TrangThai
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật phiếu khám thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deletePhieuKham: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json({ message: "Xóa phiếu khám thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = PhieuKhamController;
