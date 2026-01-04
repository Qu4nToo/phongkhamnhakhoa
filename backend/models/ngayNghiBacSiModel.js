const db = require('../config/server');

const NgayNghiBacSiModel = {
  // Lấy tất cả ngày nghỉ của tất cả bác sĩ
  getAll: async () => {
    const sql = `
      SELECT nnn.*, bs.HoTen as TenBacSi
      FROM NgayNghiBacSi nnn
      JOIN BacSi bs ON nnn.MaBacSi = bs.MaBacSi
      ORDER BY nnn.NgayNghi DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  },

  // Lấy tất cả ngày nghỉ của 1 bác sĩ
  getByBacSi: async (MaBacSi) => {
    const sql = 'SELECT * FROM NgayNghiBacSi WHERE MaBacSi = ? ORDER BY NgayNghi DESC';
    const [rows] = await db.query(sql, [MaBacSi]);
    return rows;
  },

  // Thêm ngày nghỉ mới
  create: async ({ MaBacSi, NgayNghi }) => {
    const sql = 'INSERT INTO NgayNghiBacSi (MaBacSi, NgayNghi) VALUES (?, ?)';
    const [result] = await db.query(sql, [MaBacSi, NgayNghi]);
    return result;
  },

  // Xóa ngày nghỉ theo mã ngày nghỉ
  delete: async (MaNgayNghiBS) => {
    const sql = 'DELETE FROM NgayNghiBacSi WHERE MaNgayNghiBS = ?';
    const [result] = await db.query(sql, [MaNgayNghiBS]);
    return result;
  },

  // Xem chi tiết 1 ngày nghỉ
  getById: async (MaNgayNghiBS) => {
    const sql = 'SELECT * FROM NgayNghiBacSi WHERE MaNgayNghiBS = ?';
    const [rows] = await db.query(sql, [MaNgayNghiBS]);
    return rows[0];
  },

  // Kiểm tra trùng ngày nghỉ của cùng bác sĩ
  checkDuplicate: async (MaBacSi, NgayNghi) => {
    const sql = 'SELECT * FROM NgayNghiBacSi WHERE MaBacSi = ? AND NgayNghi = ?';
    const [rows] = await db.query(sql, [MaBacSi, NgayNghi]);
    return rows.length > 0;
  },

  // Kiểm tra trùng với lịch nghỉ phòng khám
  checkClinicHolidayOverlap: async (NgayNghi) => {
    const sql = `
      SELECT * FROM LichNghiPhongKham 
      WHERE ? BETWEEN NgayBatDau AND NgayKetThuc
    `;
    const [rows] = await db.query(sql, [NgayNghi]);
    return rows;
  },
};

module.exports = NgayNghiBacSiModel;
