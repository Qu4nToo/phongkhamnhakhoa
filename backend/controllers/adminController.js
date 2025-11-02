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
};

module.exports = AdminController;
