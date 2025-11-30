const Admin = require("../models/adminModel");

const AdminController = {
  // Thống kê tổng quan
  async getStats(req, res) {
    try {
      const stats = await Admin.getStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Biểu đồ lịch hẹn theo ngày
  async getAppointmentsChart(req, res) {
    try {
      const data = await Admin.getAppointmentsChart();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy biểu đồ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // 5 lịch hẹn gần nhất
  async getRecentAppointments(req, res) {
    try {
      const data = await Admin.getRecentAppointments();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch hẹn gần nhất:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Thống kê doanh thu theo khoảng thời gian
  async getRevenueStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
      const data = await Admin.getRevenueStats(startDate, endDate);
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê doanh thu:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Thống kê lịch hẹn theo trạng thái
  async getAppointmentsByStatus(req, res) {
    try {
      const data = await Admin.getAppointmentsByStatus();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê lịch hẹn:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Top dịch vụ
  async getTopServices(req, res) {
    try {
      const data = await Admin.getTopServices();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy top dịch vụ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Thống kê bác sĩ
  async getDoctorStats(req, res) {
    try {
      const data = await Admin.getDoctorStats();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy thống kê bác sĩ:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Doanh thu tháng hiện tại
  async getCurrentMonthRevenue(req, res) {
    try {
      const data = await Admin.getCurrentMonthRevenue();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy doanh thu tháng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  // Tỷ lệ hủy lịch
  async getCancellationRate(req, res) {
    try {
      const data = await Admin.getCancellationRate();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy tỷ lệ hủy:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },
};

module.exports = AdminController;
