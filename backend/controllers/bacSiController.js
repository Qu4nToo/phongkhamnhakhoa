const BacSi = require("../models/bacSiModel");

const BacSiController = {
    getAllBacSi: async (req, res) => {
        try {
            const data = await BacSi.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getBacSiById: async (req, res) => {
        try {
            const { id } = req.params;
            const bacSi = await BacSi.getById(id);
            if (!bacSi) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            res.status(200).json(bacSi);
        } catch (error) {
            console.error("Lỗi khi lấy bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createBacSi: async (req, res) => {
        try {
            const { HoTen, SoDienThoai, Email, MatKhau, KinhNghiem, NgaySinh, DiaChi } = req.body;
            if (!HoTen || !SoDienThoai || !Email || !MatKhau || !KinhNghiem || !NgaySinh || !DiaChi)
                return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email))
                return res.status(400).json({ message: "Email không hợp lệ!" });

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai))
                return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });

            const result = await BacSi.create({ HoTen, SoDienThoai, Email, MatKhau, KinhNghiem, NgaySinh, DiaChi });
            res.status(201).json({ message: "Thêm bác sĩ thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const { HoTen, SoDienThoai, Email, MatKhau, KinhNghiem, NgaySinh, DiaChi } = req.body;

            if (!HoTen || !SoDienThoai || !Email || !KinhNghiem || !NgaySinh || !DiaChi)
                return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });

            const result = await BacSi.update(id, { HoTen, SoDienThoai, Email, MatKhau, KinhNghiem, NgaySinh, DiaChi });
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Không tìm thấy bác sĩ để cập nhật!" });

            res.status(200).json({ message: "Cập nhật bác sĩ thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await BacSi.delete(id);
            if (!result) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            res.status(200).json({ message: "Xóa bác sĩ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = BacSiController;
