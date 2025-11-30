const db = require("../config/server");

const Admin = {
  // Thống kê tổng số bác sĩ, khách hàng, dịch vụ, lịch hẹn
  async getStats() {
    const [rows] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM BACSI) AS doctors,
        (SELECT COUNT(*) FROM KHACHHANG) AS customers,
        (SELECT COUNT(*) FROM DICHVU) AS services,
        (SELECT COUNT(*) FROM LICHHEN) AS appointments
    `);
    return rows[0];
  },

  // Dữ liệu biểu đồ: số lịch hẹn theo ngày (7 ngày gần nhất)
  async getAppointmentsChart() {
    const [rows] = await db.query(`
      SELECT DATE(NgayHen) AS ngay, COUNT(*) AS soLuong
      FROM LICHHEN
      WHERE NgayHen >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(NgayHen)
      ORDER BY ngay ASC
    `);
    return rows;
  },

  // Lịch hẹn gần nhất (5 bản ghi)
  async getRecentAppointments() {
    const [rows] = await db.query(`
      SELECT 
        lh.MaLichHen,
        kh.HoTen AS TenKhachHang,
        bs.HoTen AS TenBacSi,
        lh.NgayHen,
        lh.TinhTrang
      FROM lichhen lh
      JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang
      JOIN bacsi bs ON lh.MaBacSi = bs.MaBacSi
      ORDER BY lh.NgayHen DESC
      LIMIT 5
    `);
    return rows;
  },

  // Thống kê doanh thu theo khoảng thời gian
  async getRevenueStats(startDate, endDate) {
    const [rows] = await db.query(`
      SELECT 
        DATE(NgayThanhToan) AS ngay,
        SUM(TongTien) AS doanhThu,
        COUNT(*) AS soHoaDon
      FROM hoadon
      WHERE NgayThanhToan BETWEEN ? AND ?
        AND TrangThai = 'Đã thanh toán'
      GROUP BY DATE(NgayThanhToan)
      ORDER BY ngay ASC
    `, [startDate, endDate]);
    return rows;
  },

  // Thống kê lịch hẹn theo trạng thái
  async getAppointmentsByStatus() {
    const [rows] = await db.query(`
      SELECT 
        TinhTrang,
        COUNT(*) AS soLuong
      FROM lichhen
      GROUP BY TinhTrang
    `);
    return rows;
  },

  // Top 5 dịch vụ được sử dụng nhiều nhất
  async getTopServices() {
    const [rows] = await db.query(`
      SELECT 
        dv.TenDichVu,
        COUNT(ctpk.MaDichVu) AS soLanSuDung
      FROM chitietphieukham ctpk
      JOIN dichvu dv ON ctpk.MaDichVu = dv.MaDichVu
      GROUP BY ctpk.MaDichVu, dv.TenDichVu
      ORDER BY soLanSuDung DESC
      LIMIT 5
    `);
    return rows;
  },

  // Thống kê bác sĩ (số lượt khám, doanh thu)
  async getDoctorStats() {
    const [rows] = await db.query(`
      SELECT 
        bs.HoTen AS tenBacSi,
        COUNT(DISTINCT pk.MaPhieuKham) AS soLuotKham,
        COALESCE(SUM(hd.TongTien), 0) AS doanhThu
      FROM bacsi bs
      LEFT JOIN phieukham pk ON bs.MaBacSi = pk.MaBacSi
      LEFT JOIN hoadon hd ON pk.MaPhieuKham = hd.MaPhieuKham 
        AND hd.TrangThai = 'Đã thanh toán'
      GROUP BY bs.MaBacSi, bs.HoTen
      ORDER BY soLuotKham DESC
    `);
    return rows;
  },

  // Tổng doanh thu theo tháng hiện tại
  async getCurrentMonthRevenue() {
    const [rows] = await db.query(`
      SELECT 
        COALESCE(SUM(TongTien), 0) AS tongDoanhThu,
        COUNT(*) AS soHoaDon
      FROM hoadon
      WHERE MONTH(NgayThanhToan) = MONTH(CURDATE())
        AND YEAR(NgayThanhToan) = YEAR(CURDATE())
        AND TrangThai = 'Đã thanh toán'
    `);
    return rows[0];
  },

  // Tỷ lệ hủy lịch hẹn
  async getCancellationRate() {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) AS tongLichHen,
        SUM(CASE WHEN TinhTrang = 'Đã hủy' THEN 1 ELSE 0 END) AS soLichHuy,
        ROUND(
          (SUM(CASE WHEN TinhTrang = 'Đã hủy' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 
          2
        ) AS tyLeHuy
      FROM lichhen
      WHERE NgayHen >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);
    return rows[0];
  },
};

module.exports = Admin;
