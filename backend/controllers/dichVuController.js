const DichVu = require("../models/dichVuModel");

const DichVuController = {
    getAllDichVu: async (req, res) => {
        try {
            const data = await DichVu.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getDichVuById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await DichVu.getById(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    createDichVu: async (req, res) => {
        try {
            const { TenDichVu, Gia, MoTa, DonVi, MaLoaiDV } = req.body;

            if (!TenDichVu || !Gia || !MoTa || !DonVi || !MaLoaiDV) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            const result = await DichVu.create({ TenDichVu, Gia, MoTa, DonVi, MaLoaiDV });
            res.status(201).json({ message: "Thêm dịch vụ thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const { TenDichVu, Gia, MoTa, DonVi, MaLoaiDV } = req.body;

            if (!TenDichVu || !Gia || !MoTa || !DonVi || !MaLoaiDV) {
                return res.status(400).json({ message: "Các trường TenDichVu, Gia, MoTa, DonVi, MaLoaiDV là bắt buộc!" });
            }

            const result = await DichVu.update(id, { TenDichVu, Gia, MoTa, DonVi, MaLoaiDV });

            if (!TenDichVu || !Gia || !MoTa || !DonVi || !MaLoaiDV) {
                return res.status(400).json({ message: "Các trường TenDichVu, Gia, MoTa, DonVi, MaLoaiDV là bắt buộc!" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await DichVu.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }
            res.status(200).json({ message: "Xóa dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = DichVuController;
