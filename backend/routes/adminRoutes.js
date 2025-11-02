const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

// API thống kê
router.get("/stats", AdminController.getStats);

// API biểu đồ lịch hẹn theo ngày
router.get("/appointments/chart", AdminController.getAppointmentsChart);

// API lấy 5 lịch hẹn gần nhất
router.get("/appointments/recent", AdminController.getRecentAppointments);

module.exports = router;
