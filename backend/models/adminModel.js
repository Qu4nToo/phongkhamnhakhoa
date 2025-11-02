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
};

module.exports = Admin;
