const LichHen = require("../models/lichHenModel");

const LichHenController = {
  // 🔹 Lấy danh sách tất cả lịch hẹn
  getAllLichHen: async (req, res) => {
    try {
      const data = await LichHen.getAlls();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Lấy chi tiết lịch hẹn theo ID
  getLichHenById: async (req, res) => {
    try {
      const { id } = req.params;
      const lichHen = await LichHen.getById(id);

      if (!lichHen) {
        return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
      }

      res.status(200).json(lichHen);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Tạo mới lịch hẹn
  createLichHen: async (req, res) => {
    try {
      const { GhiChu, NgayHen, TinhTrang, MaKhachHang, MaBacSi } = req.body;

      // Kiểm tra trường bắt buộc
      if (!NgayHen || !TinhTrang || !MaKhachHang || !MaBacSi) {
        return res.status(400).json({
          message: "Các trường NgayHen, TinhTrang, MaKhachHang, MaBacSi là bắt buộc!",
        });
      }

      // Kiểm tra ngày hợp lệ (ngày hẹn không được trong quá khứ)
      const ngayHenDate = new Date(NgayHen);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (ngayHenDate < today) {
        return res.status(400).json({ message: "Ngày hẹn không được nhỏ hơn ngày hiện tại!" });
      }

      // Tình trạng phải là số nguyên (0: Chờ xác nhận, 1: Đã xác nhận, 2: Hoàn thành, 3: Hủy)
      if (![0, 1, 2, 3].includes(Number(TinhTrang))) {
        return res.status(400).json({ message: "Tình trạng không hợp lệ!" });
      }

      const result = await LichHen.create({
        GhiChu,
        NgayHen,
        TinhTrang,
        MaKhachHang,
        MaBacSi,
      });

      return res.status(201).json({
        message: "Thêm lịch hẹn thành công!",
        data: result,
      });
    } catch (error) {
      console.error("Lỗi khi thêm lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Cập nhật lịch hẹn
  updateLichHen: async (req, res) => {
    try {
      const { id } = req.params;
      const { GhiChu, NgayHen, TinhTrang, MaKhachHang, MaBacSi } = req.body;

      if (!NgayHen || !TinhTrang || !MaKhachHang || !MaBacSi) {
        return res.status(400).json({
          message: "Các trường NgayHen, TinhTrang, MaKhachHang, MaBacSi là bắt buộc!",
        });
      }

      // Kiểm tra giá trị hợp lệ
      const ngayHenDate = new Date(NgayHen);
      if (isNaN(ngayHenDate)) {
        return res.status(400).json({ message: "Ngày hẹn không hợp lệ!" });
      }

      if (![0, 1, 2, 3].includes(Number(TinhTrang))) {
        return res.status(400).json({ message: "Tình trạng không hợp lệ!" });
      }

      const result = await LichHen.update(id, {
        GhiChu,
        NgayHen,
        TinhTrang,
        MaKhachHang,
        MaBacSi,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch hẹn để cập nhật!" });
      }

      return res.status(200).json({ message: "Cập nhật lịch hẹn thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Xóa lịch hẹn
  deleteLichHen: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await LichHen.delete(id);

      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy lịch hẹn để xóa!" });
      }

      return res.status(200).json({ message: "Xóa lịch hẹn thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = LichHenController;
