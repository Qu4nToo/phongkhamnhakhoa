
const BacSiNgayNghi = require("../models/bacSiNgayNghiModel");

const BacSiNgayNghiController = {
  // Lấy tất cả ngày nghỉ của 1 bác sĩ
  getByBacSi: async (req, res) => {
    try {
      const { maBacSi } = req.params;
      const data = await BacSiNgayNghi.getByBacSi(maBacSi);
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy ngày nghỉ bác sĩ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy chi tiết ngày nghỉ theo mã
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await BacSiNgayNghi.getById(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy ngày nghỉ" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Thêm ngày nghỉ mới
  create: async (req, res) => {
    try {
      const { MaBacSi, NgayNghi } = req.body;
      if (!MaBacSi || !NgayNghi) {
        return res.status(400).json({ message: "Thiếu thông tin!" });
      }
      const result = await BacSiNgayNghi.create({ MaBacSi, NgayNghi });
      res.status(201).json({ message: "Thêm ngày nghỉ thành công!", data: result });
    } catch (error) {
      console.error("Lỗi khi thêm ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Xóa ngày nghỉ
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await BacSiNgayNghi.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy ngày nghỉ để xóa!" });
      }
      res.status(200).json({ message: "Xóa ngày nghỉ thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = BacSiNgayNghiController;
