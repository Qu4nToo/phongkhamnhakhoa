const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

// API thống kê tổng quan
router.get("/stats", AdminController.getStats);

// API biểu đồ lịch hẹn theo ngày
router.get("/appointments/chart", AdminController.getAppointmentsChart);

// API lấy 5 lịch hẹn gần nhất
router.get("/appointments/recent", AdminController.getRecentAppointments);

// API thống kê doanh thu theo khoảng thời gian
router.get("/revenue", AdminController.getRevenueStats);

// API thống kê lịch hẹn theo trạng thái
router.get("/appointments/status", AdminController.getAppointmentsByStatus);

// API top dịch vụ
router.get("/services/top", AdminController.getTopServices);

// API thống kê bác sĩ
router.get("/doctors/stats", AdminController.getDoctorStats);

// API doanh thu tháng hiện tại
router.get("/revenue/current-month", AdminController.getCurrentMonthRevenue);

// API tỷ lệ hủy lịch
router.get("/appointments/cancellation-rate", AdminController.getCancellationRate);

module.exports = router;
