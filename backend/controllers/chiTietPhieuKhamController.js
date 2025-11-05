const ChiTietPhieuKham = require("../models/chiTietPhieuKhamModel");

const ChiTietPhieuKhamController = {
  // 🔹 Lấy danh sách tất cả chi tiết phiếu khám
  getAllChiTietPhieuKham: async (req, res) => {
    try {
      const data = await ChiTietPhieuKham.getAlls();
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết phiếu khám!" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  getByPhieuKhamId: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await ChiTietPhieuKham.getByPhieuKhamId(id);
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết phiếu khám!" });
      }
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chi tiết phiếu khám theo mã phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  // 🔹 Lấy chi tiết theo ID (MaCTPK)
  getChiTietPhieuKhamById: async (req, res) => {
    try {
      const { id } = req.params;
      const record = await ChiTietPhieuKham.getById(id);

      if (!record) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết phiếu khám!" });
      }

      res.status(200).json(record);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Thêm chi tiết phiếu khám mới
  createChiTietPhieuKham: async (req, res) => {
    try {
      const { ThanhTien, DonGia, SoLuong, MaPhieuKham, MaDichVu } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!ThanhTien || !DonGia || !SoLuong || !MaPhieuKham || !MaDichVu) {
        return res.status(400).json({
          message: "Các trường ThanhTien, DonGia, SoLuong, MaPhieuKham, MaDichVu là bắt buộc!",
        });
      }

      const result = await ChiTietPhieuKham.create({
        ThanhTien,
        DonGia,
        SoLuong,
        MaPhieuKham,
        MaDichVu,
      });

      return res.status(201).json({
        message: "Thêm chi tiết phiếu khám thành công!",
        data: result,
      });
    } catch (error) {
      console.error("Lỗi khi thêm chi tiết phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Cập nhật chi tiết phiếu khám
  updateChiTietPhieuKham: async (req, res) => {
    try {
      const { id } = req.params;
      const { ThanhTien, DonGia, SoLuong, MaPhieuKham, MaDichVu } = req.body;

      if (!ThanhTien || !DonGia || !SoLuong || !MaPhieuKham || !MaDichVu) {
        return res.status(400).json({
          message: "Các trường ThanhTien, DonGia, SoLuong, MaPhieuKham, MaDichVu là bắt buộc!",
        });
      }

      const result = await ChiTietPhieuKham.update(id, {
        ThanhTien,
        DonGia,
        SoLuong,
        MaPhieuKham,
        MaDichVu,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết phiếu khám để cập nhật!" });
      }

      return res.status(200).json({ message: "Cập nhật chi tiết phiếu khám thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật chi tiết phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Xóa chi tiết phiếu khám
  deleteChiTietPhieuKham: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await ChiTietPhieuKham.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy chi tiết phiếu khám để xóa!" });
      }

      return res.status(200).json({ message: "Xóa chi tiết phiếu khám thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa chi tiết phiếu khám:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = ChiTietPhieuKhamController;
