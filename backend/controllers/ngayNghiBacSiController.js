
const NgayNghiBacSi = require("../models/ngayNghiBacSiModel");

const NgayNghiBacSiController = {  // Lấy tất cả ngày nghỉ của tất cả bác sĩ
  getAll: async (req, res) => {
    try {
      const data = await NgayNghiBacSi.getAll();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
  // Lấy tất cả ngày nghỉ của 1 bác sĩ
  getByBacSi: async (req, res) => {
    try {
      const { maBacSi } = req.params;
      const data = await NgayNghiBacSi.getByBacSi(maBacSi);
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
      const data = await NgayNghiBacSi.getById(id);
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

      // Kiểm tra trùng với ngày nghỉ khác của cùng bác sĩ
      const isDuplicate = await NgayNghiBacSi.checkDuplicate(MaBacSi, NgayNghi);
      if (isDuplicate) {
        return res.status(400).json({ message: "Bác sĩ đã có ngày nghỉ vào ngày này!" });
      }

      // Kiểm tra trùng với lịch nghỉ phòng khám (cảnh báo nhẹ)
      const clinicHolidays = await NgayNghiBacSi.checkClinicHolidayOverlap(NgayNghi);
      let warning = null;
      if (clinicHolidays.length > 0) {
        warning = {
          message: `Ngày này trùng với lịch nghỉ phòng khám: ${clinicHolidays[0].TenNgayLe}`,
          details: clinicHolidays[0]
        };
      }

      const result = await NgayNghiBacSi.create({ MaBacSi, NgayNghi });
      res.status(201).json({ 
        message: "Thêm ngày nghỉ thành công!", 
        data: result,
        warning: warning
      });
    } catch (error) {
      console.error("Lỗi khi thêm ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Xóa ngày nghỉ
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await NgayNghiBacSi.delete(id);
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

module.exports = NgayNghiBacSiController;
