const LoaiDichVu = require("../models/loaiDichVuModel");

const LoaiDichVuController = {
    // ✅ Lấy tất cả loại dịch vụ
    getAllLoaiDichVu: async (req, res) => {
        try {
            const data = await LoaiDichVu.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Lấy loại dịch vụ theo ID
    getLoaiDichVuById: async (req, res) => {
        try {
            const { id } = req.params;
            const loaiDichVu = await LoaiDichVu.getById(id);
            if (!loaiDichVu) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ!" });
            }
            res.status(200).json(loaiDichVu);
        } catch (error) {
            console.error("Lỗi khi lấy loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Thêm loại dịch vụ mới
    createLoaiDichVu: async (req, res) => {
        try {
            const { TenLoaiDichVu, MoTa } = req.body;

            if (!TenLoaiDichVu || TenLoaiDichVu.trim() === "") {
                return res.status(400).json({ message: "Tên loại dịch vụ là bắt buộc!" });
            }

            const result = await LoaiDichVu.create({
                TenLoaiDichVu,
                MoTa: MoTa || null
            });

            res.status(201).json({
                message: "Thêm loại dịch vụ thành công!",
                data: result
            });
        } catch (error) {
            console.error("Lỗi khi thêm loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Cập nhật loại dịch vụ
    updateLoaiDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const { TenLoaiDichVu, MoTa } = req.body;

            if (!TenLoaiDichVu || TenLoaiDichVu.trim() === "") {
                return res.status(400).json({ message: "Tên loại dịch vụ là bắt buộc!" });
            }

            const result = await LoaiDichVu.update(id, {
                TenLoaiDichVu,
                MoTa: MoTa || null
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật loại dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Xóa loại dịch vụ
    deleteLoaiDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await LoaiDichVu.delete(id);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ để xóa!" });
            }

            res.status(200).json({ message: "Xóa loại dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = LoaiDichVuController;
