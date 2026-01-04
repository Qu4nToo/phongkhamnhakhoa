const db = require('../config/server');

const LichNghiPhongKhamModel = {
  // Lấy tất cả lịch nghỉ của phòng khám
  getAll: async () => {
    const sql = 'SELECT * FROM LichNghiPhongKham ORDER BY NgayBatDau DESC';
    const [rows] = await db.query(sql);
    return rows;
  },

  // Lấy lịch nghỉ theo năm
  getByYear: async (year) => {
    const sql = 'SELECT * FROM LichNghiPhongKham WHERE NamApDung = ? ORDER BY NgayBatDau';
    const [rows] = await db.query(sql, [year]);
    return rows;
  },

  // Lấy lịch nghỉ từ ngày hiện tại trở đi
  getUpcoming: async () => {
    const sql = 'SELECT * FROM LichNghiPhongKham WHERE NgayKetThuc >= CURDATE() ORDER BY NgayBatDau';
    const [rows] = await db.query(sql);
    return rows;
  },

  // Kiểm tra một ngày có phải ngày nghỉ không
  checkNgayNghi: async (ngay) => {
    const sql = 'SELECT * FROM LichNghiPhongKham WHERE ? BETWEEN NgayBatDau AND NgayKetThuc';
    const [rows] = await db.query(sql, [ngay]);
    return rows.length > 0 ? rows[0] : null;
  },

  // Lấy danh sách ngày nghỉ trong khoảng thời gian
  getByDateRange: async (startDate, endDate) => {
    const sql = `
      SELECT * FROM LichNghiPhongKham 
      WHERE (NgayBatDau BETWEEN ? AND ?) 
      OR (NgayKetThuc BETWEEN ? AND ?)
      OR (NgayBatDau <= ? AND NgayKetThuc >= ?)
      ORDER BY NgayBatDau
    `;
    const [rows] = await db.query(sql, [startDate, endDate, startDate, endDate, startDate, endDate]);
    return rows;
  },

  // Thêm lịch nghỉ mới
  create: async ({ TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung }) => {
    const sql = `
      INSERT INTO LichNghiPhongKham (TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung]);
    return result;
  },

  // Cập nhật lịch nghỉ
  update: async (MaLichNghi, { TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung }) => {
    const sql = `
      UPDATE LichNghiPhongKham 
      SET TenNgayLe = ?, NgayBatDau = ?, NgayKetThuc = ?, GhiChu = ?, NamApDung = ?
      WHERE MaLichNghi = ?
    `;
    const [result] = await db.query(sql, [TenNgayLe, NgayBatDau, NgayKetThuc, GhiChu, NamApDung, MaLichNghi]);
    return result;
  },

  // Xóa lịch nghỉ
  delete: async (MaLichNghi) => {
    const sql = 'DELETE FROM LichNghiPhongKham WHERE MaLichNghi = ?';
    const [result] = await db.query(sql, [MaLichNghi]);
    return result;
  },

  // Lấy chi tiết lịch nghỉ
  getById: async (MaLichNghi) => {
    const sql = 'SELECT * FROM LichNghiPhongKham WHERE MaLichNghi = ?';
    const [rows] = await db.query(sql, [MaLichNghi]);
    return rows[0];
  },

  // Kiểm tra trùng lặp khoảng thời gian với lịch nghỉ khác
  checkOverlap: async (NgayBatDau, NgayKetThuc, excludeId = null) => {
    let sql = `
      SELECT * FROM LichNghiPhongKham 
      WHERE (
        (NgayBatDau <= ? AND NgayKetThuc >= ?) OR
        (NgayBatDau <= ? AND NgayKetThuc >= ?) OR
        (NgayBatDau >= ? AND NgayKetThuc <= ?)
      )
    `;
    const params = [NgayKetThuc, NgayBatDau, NgayBatDau, NgayBatDau, NgayBatDau, NgayKetThuc];
    
    if (excludeId) {
      sql += ' AND MaLichNghi != ?';
      params.push(excludeId);
    }
    
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // Kiểm tra trùng với ngày nghỉ cá nhân của bác sĩ
  checkDoctorDayOffOverlap: async (NgayBatDau, NgayKetThuc) => {
    const sql = `
      SELECT nnn.*, bs.HoTen as TenBacSi
      FROM NgayNghiBacSi nnn
      JOIN BacSi bs ON nnn.MaBacSi = bs.MaBacSi
      WHERE nnn.NgayNghi BETWEEN ? AND ?
      ORDER BY nnn.NgayNghi
    `;
    const [rows] = await db.query(sql, [NgayBatDau, NgayKetThuc]);
    return rows;
  },
};

module.exports = LichNghiPhongKhamModel;
