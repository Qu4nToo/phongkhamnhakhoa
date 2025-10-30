const LichLamViec = require("../models/lichLamViecModel");

const LichLamViecController = {
    getAllLichLamViec: async (req, res) => {
        try {
            const data = await LichLamViec.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lịch làm việc:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getLichLamViecById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await LichLamViec.getById(id);
            if (!data) return res.status(404).json({ message: "Không tìm thấy lịch làm việc!" });
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getLichLamViecByBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await LichLamViec.getByBacSi(id);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createLichLamViec: async (req, res) => {
        try {
            const { MaBacSi, ThuTrongTuan } = req.body;

            if (!MaBacSi || !ThuTrongTuan) {
                return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc!" });
            }

            const result = await LichLamViec.create({ MaBacSi, ThuTrongTuan });
            res.status(201).json({ message: "Thêm lịch làm việc thành công!", data: result });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "Bác sĩ này đã có lịch làm việc cho thứ này!" });
            }
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateLichLamViec: async (req, res) => {
        try {
            const { id } = req.params;
            const { MaBacSi, ThuTrongTuan } = req.body;

            const result = await LichLamViec.update(id, { MaBacSi, ThuTrongTuan });
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy lịch làm việc để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật lịch làm việc thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteLichLamViec: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await LichLamViec.delete(id);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy lịch làm việc để xóa!" });
            }
            res.status(200).json({ message: "Xóa lịch làm việc thành công!" });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = LichLamViecController;
