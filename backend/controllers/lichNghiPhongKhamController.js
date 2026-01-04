const LichNghiPhongKham = require("../models/lichNghiPhongKhamModel");

const LichNghiPhongKhamController = {
  // Lấy tất cả lịch nghỉ
  getAll: async (req, res) => {
    try {
      const data = await LichNghiPhongKham.getAll();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lịch nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy lịch nghỉ theo năm
  getByYear: async (req, res) => {
    try {
      const { year } = req.params;
      const data = await LichNghiPhongKham.getByYear(year);
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch nghỉ theo năm:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy lịch nghỉ sắp tới
  getUpcoming: async (req, res) => {
    try {
      const data = await LichNghiPhongKham.getUpcoming();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch nghỉ sắp tới:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Kiểm tra ngày có phải ngày nghỉ không
  checkNgayNghi: async (req, res) => {
    try {
      const { ngay } = req.params; // Format: YYYY-MM-DD
      const data = await LichNghiPhongKham.checkNgayNghi(ngay);
      if (data) {
        res.status(200).json({ isHoliday: true, holiday: data });
      } else {
        res.status(200).json({ isHoliday: false });
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra ngày nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy lịch nghỉ trong khoảng thời gian (cho calendar)
  getByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query; // Format: YYYY-MM-DD
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Thiếu startDate hoặc endDate" });
      }
      const data = await LichNghiPhongKham.getByDateRange(startDate, endDate);
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch nghỉ theo khoảng thời gian:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Thêm lịch nghỉ mới (Admin only)
  create: async (req, res) => {
    try {
      const { TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung } = req.body;
      
      // Validate
      if (!TenNgayLe || !NgayBatDau || !NgayKetThuc || !NamApDung) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
      }

      // Check ngày kết thúc phải >= ngày bắt đầu
      if (new Date(NgayKetThuc) < new Date(NgayBatDau)) {
        return res.status(400).json({ message: "Ngày kết thúc phải >= ngày bắt đầu!" });
      }

      // Kiểm tra trùng lặp với lịch nghỉ phòng khám khác
      const overlappingHolidays = await LichNghiPhongKham.checkOverlap(NgayBatDau, NgayKetThuc);
      if (overlappingHolidays.length > 0) {
        const conflictNames = overlappingHolidays.map(h => h.TenNgayLe).join(', ');
        return res.status(400).json({ 
          message: `Trùng lịch với: ${conflictNames}`,
          conflicts: overlappingHolidays 
        });
      }

      // Kiểm tra trùng với ngày nghỉ bác sĩ (chỉ cảnh báo)
      const overlappingDoctorDays = await LichNghiPhongKham.checkDoctorDayOffOverlap(NgayBatDau, NgayKetThuc);
      let warning = null;
      if (overlappingDoctorDays.length > 0) {
        warning = {
          message: `Có ${overlappingDoctorDays.length} ngày nghỉ cá nhân của bác sĩ trùng với khoảng thời gian này`,
          details: overlappingDoctorDays
        };
      }

      const result = await LichNghiPhongKham.create({
        TenNgayLe,
        NgayBatDau,
        NgayKetThuc,
        GhiChu,
        NamApDung,
      });

      res.status(201).json({ 
        message: "Thêm lịch nghỉ thành công!", 
        data: result,
        warning: warning
      });
    } catch (error) {
      console.error("Lỗi khi thêm lịch nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Cập nhật lịch nghỉ (Admin only)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung } = req.body;

      // Validate
      if (!TenNgayLe || !NgayBatDau || !NgayKetThuc || !NamApDung) {
        return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
      }

      // Check ngày kết thúc phải >= ngày bắt đầu
      if (new Date(NgayKetThuc) < new Date(NgayBatDau)) {
        return res.status(400).json({ message: "Ngày kết thúc phải >= ngày bắt đầu!" });
      }

      // Kiểm tra trùng lặp với lịch nghỉ phòng khám khác (trừ chính nó)
      const overlappingHolidays = await LichNghiPhongKham.checkOverlap(NgayBatDau, NgayKetThuc, id);
      if (overlappingHolidays.length > 0) {
        const conflictNames = overlappingHolidays.map(h => h.TenNgayLe).join(', ');
        return res.status(400).json({ 
          message: `Trùng lịch với: ${conflictNames}`,
          conflicts: overlappingHolidays 
        });
      }

      // Kiểm tra trùng với ngày nghỉ bác sĩ (chỉ cảnh báo)
      const overlappingDoctorDays = await LichNghiPhongKham.checkDoctorDayOffOverlap(NgayBatDau, NgayKetThuc);
      let warning = null;
      if (overlappingDoctorDays.length > 0) {
        warning = {
          message: `Có ${overlappingDoctorDays.length} ngày nghỉ cá nhân của bác sĩ trùng với khoảng thời gian này`,
          details: overlappingDoctorDays
        };
      }

      const result = await LichNghiPhongKham.update(id, {
        TenNgayLe,
        NgayBatDau,
        NgayKetThuc,
        GhiChu,
        NamApDung,
      });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch nghỉ!" });
      }

      res.status(200).json({ 
        message: "Cập nhật lịch nghỉ thành công!",
        warning: warning
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật lịch nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Xóa lịch nghỉ (Admin only)
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await LichNghiPhongKham.delete(id);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy lịch nghỉ để xóa!" });
      }

      res.status(200).json({ message: "Xóa lịch nghỉ thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa lịch nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Lấy chi tiết lịch nghỉ
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await LichNghiPhongKham.getById(id);
      
      if (!data) {
        return res.status(404).json({ message: "Không tìm thấy lịch nghỉ!" });
      }

      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết lịch nghỉ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = LichNghiPhongKhamController;
