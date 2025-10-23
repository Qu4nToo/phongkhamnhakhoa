const ChucVu = require("../models/chucVuModel");

const ChucVuController = {
  // 🔹 Lấy danh sách tất cả chức vụ
  getAllChucVu: async (req, res) => {
    try {
      const data = await ChucVu.getAlls();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chức vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Lấy chi tiết chức vụ theo ID
  getChucVuById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await ChucVu.getById(id);

      if (!record) {
        return res.status(404).json({ message: "Không tìm thấy chức vụ!" });
      }

      res.status(200).json(record);
    } catch (error) {
      console.error("Lỗi khi lấy chức vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Thêm chức vụ mới
  createChucVu: async (req, res) => {
    try {
      const { TenChucVu } = req.body;

      if (!TenChucVu) {
        return res.status(400).json({ message: "Tên chức vụ là bắt buộc!" });
      }

      const result = await ChucVu.create({ TenChucVu });

      return res.status(201).json({
        message: "Thêm chức vụ thành công!",
        data: result,
      });
    } catch (error) {
      console.error("Lỗi khi thêm chức vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Cập nhật chức vụ
  updateChucVu: async (req, res) => {
    try {
      const { id } = req.params;
      const { TenChucVu } = req.body;

      if (!TenChucVu) {
        return res.status(400).json({ message: "Tên chức vụ là bắt buộc!" });
      }

      const result = await ChucVu.update(id, { TenChucVu });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chức vụ để cập nhật!" });
      }

      return res.status(200).json({ message: "Cập nhật chức vụ thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật chức vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Xóa chức vụ
  deleteChucVu: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ChucVu.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy chức vụ để xóa!" });
      }

      return res.status(200).json({ message: "Xóa chức vụ thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa chức vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = ChucVuController;
