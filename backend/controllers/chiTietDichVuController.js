const ChiTietDichVu = require("../models/chiTietDichVuModel");

const ChiTietDichVuController = {
  // 🔹 Lấy danh sách tất cả chi tiết dịch vụ
  getAllChiTietDichVu: async (req, res) => {
    try {
      const data = await ChiTietDichVu.getAlls();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Lấy chi tiết theo ID (MaBSDV)
  getChiTietDichVuById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await ChiTietDichVu.getById(id);

      if (!record) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết dịch vụ!" });
      }

      res.status(200).json(record);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Thêm chi tiết dịch vụ mới
  createChiTietDichVu: async (req, res) => {
    try {
      const { GhiChu, MaBacSi, MaDichVu } = req.body;

      // Kiểm tra bắt buộc
      if (!MaBacSi || !MaDichVu || !GhiChu) {
        return res.status(400).json({
          message: "Các trường MaBacSi, MaDichVu và GhiChu là bắt buộc!",
        });
      }

      const result = await ChiTietDichVu.create({
        GhiChu,
        MaBacSi,
        MaDichVu,
      });

      return res.status(201).json({
        message: "Thêm chi tiết dịch vụ thành công!",
        data: result,
      });
    } catch (error) {
      console.error("Lỗi khi thêm chi tiết dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Cập nhật chi tiết dịch vụ
  updateChiTietDichVu: async (req, res) => {
    try {
      const { id } = req.params;
      const { GhiChu, MaBacSi, MaDichVu } = req.body;

      if (!MaBacSi || !MaDichVu || !GhiChu) {
        return res.status(400).json({
          message: "Các trường MaBacSi, MaDichVu và GhiChu là bắt buộc!",
        });
      }

      const result = await ChiTietDichVu.update(id, {
        GhiChu,
        MaBacSi,
        MaDichVu,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết dịch vụ để cập nhật!" });
      }

      return res.status(200).json({ message: "Cập nhật chi tiết dịch vụ thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật chi tiết dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Xóa chi tiết dịch vụ
  deleteChiTietDichVu: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ChiTietDichVu.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết dịch vụ để xóa!" });
      }

      return res.status(200).json({ message: "Xóa chi tiết dịch vụ thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = ChiTietDichVuController;
