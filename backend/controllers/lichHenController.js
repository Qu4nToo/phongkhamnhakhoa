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
      const { GhiChu, NgayHen, GioHen, MaKhachHang, MaBacSi, MaDichVu } = req.body;

      if (!NgayHen || !GioHen || !MaKhachHang || !MaDichVu) {
        return res.status(400).json({
          message: "Các trường NgayHen, GioHen, MaKhachHang, MaDichVu là bắt buộc!",
        });
      }

      const ngayHenDate = new Date(NgayHen);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (ngayHenDate < today) {
        return res.status(400).json({ message: "Ngày hẹn không được nhỏ hơn ngày hiện tại!" });
      }



      const formattedDate = ngayHenDate.toISOString().split("T")[0];

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
        GioHen,
        MaKhachHang,
        MaBacSi: MaBacSi || null,
        MaDichVu,
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
      const { GhiChu, NgayHen, GioHen, TinhTrang } = req.body;

      if (!NgayHen || !GioHen || !TinhTrang) {
        return res.status(400).json({
          message: "Các trường NgayHen, GioHen, TinhTrang là bắt buộc!",
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
        GioHen,
        TinhTrang,
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

  // 🔹 Cập nhật trạng thái lịch hẹn
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { TinhTrang } = req.body;

      if (!TinhTrang) {
        return res.status(400).json({ message: "Vui lòng cung cấp trạng thái!" });
      }

      const result = await LichHen.updateStatus(id, TinhTrang);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch hẹn để cập nhật!" });
      }

      return res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
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

  // 🔹 Lấy các slot thời gian khả dụng cho bác sĩ trong ngày
  getAvailableTimeSlots: async (req, res) => {
    try {
      const { bacSiId, ngayHen, dichVuId } = req.query;

      if (!bacSiId || !ngayHen || !dichVuId) {
        return res.status(400).json({ 
          message: "Cần có bacSiId, ngayHen và dichVuId" 
        });
      }

      const availableSlots = await LichHen.getAvailableSlots(bacSiId, ngayHen, dichVuId);
      res.status(200).json(availableSlots);
    } catch (error) {
      console.error("Lỗi khi lấy slot khả dụng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = LichHenController;
