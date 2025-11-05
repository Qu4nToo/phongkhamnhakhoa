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

  // 🔹 Lấy lịch hẹn theo bác sĩ
  getLichHenByBacSiId: async (req, res) => {
    try {
      const { id } = req.params;
      const lichHen = await LichHen.getByBacSiId(id);

      if (!lichHen) {
        return res.status(404).json({ message: "Không tìm thấy lịch hẹn" });
      }

      res.status(200).json(lichHen);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 🔹 Lấy lịch hẹn theo khách hàng
  getLichHenByKhachHangId: async (req, res) => {
    try {
      const { id } = req.params;
      const lichHen = await LichHen.getByKhachHangId(id);

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
      console.log("📥 Body nhận được từ client:", req.body);
      const { GhiChu, NgayHen, MaKhachHang, MaBacSi } = req.body;

      if (!NgayHen || !MaKhachHang || !MaBacSi) {
        return res.status(400).json({
          message: "Các trường NgayHen, MaKhachHang, MaBacSi là bắt buộc!",
        });
      }

      const ngayHenDate = new Date(NgayHen);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (ngayHenDate < today) {
        return res.status(400).json({ message: "Ngày hẹn không được nhỏ hơn ngày hiện tại!" });
      }



      const formattedDate = ngayHenDate.toISOString().split("T")[0];
      const count = await LichHen.countByBacSiAndDate(MaBacSi, formattedDate);

      if (count >= 6) {
        const formatted = `${String(ngayHenDate.getDate()).padStart(2, "0")}/${String(
          ngayHenDate.getMonth() + 1
        ).padStart(2, "0")}/${ngayHenDate.getFullYear()}`;
        return res.status(400).json({
          message: `Bác sĩ này đã đủ lịch hẹn trong ngày ${formatted}, không thể đặt thêm!`,
        });
      }

      const existed = await LichHen.countByKhachHangAndDate(MaKhachHang, formattedDate);

      if (existed) {
        const formatted = `${String(ngayHenDate.getDate()).padStart(2, "0")}/${String(
          ngayHenDate.getMonth() + 1
        ).padStart(2, "0")}/${ngayHenDate.getFullYear()}`;
        return res.status(400).json({
          message: `Bạn đã có lịch hẹn trong ngày ${formatted}, không thể đặt thêm!`,
        });
      }
      console.log("📥 existed:", existed);

      // ✅ Tạo lịch hẹn mới
      const result = await LichHen.create({
        GhiChu,
        NgayHen,
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
      const { GhiChu, NgayHen, MaKhachHang, MaBacSi } = req.body;

      if (!NgayHen || !MaKhachHang || !MaBacSi) {
        return res.status(400).json({
          message: "Các trường NgayHen MaKhachHang, MaBacSi là bắt buộc!",
        });
      }

      // Kiểm tra giá trị hợp lệ
      const ngayHenDate = new Date(NgayHen);
      if (Number.isNaN(ngayHenDate.getTime())) {
        return res.status(400).json({ message: "Ngày hẹn không hợp lệ!" });
      }

      const result = await LichHen.update(id, {
        GhiChu,
        NgayHen,
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
