const db = require('../config/server');

const BacSiNgayNghiModel = {
  // Lấy tất cả ngày nghỉ của 1 bác sĩ
  getByBacSi: async (MaBacSi) => {
    const sql = 'SELECT * FROM BacSiNgayNghi WHERE MaBacSi = ? ORDER BY NgayNghi DESC';
    const [rows] = await db.query(sql, [MaBacSi]);
    return rows;
  },

  // Thêm ngày nghỉ mới
  create: async ({ MaBacSi, NgayNghi }) => {
    const sql = 'INSERT INTO BacSiNgayNghi (MaBacSi, NgayNghi) VALUES (?, ?)';
    const [result] = await db.query(sql, [MaBacSi, NgayNghi]);
    return result;
  },

  // Xóa ngày nghỉ theo mã ngày nghỉ
  delete: async (MaNgayNghiBS) => {
    const sql = 'DELETE FROM BacSiNgayNghi WHERE MaNgayNghiBS = ?';
    const [result] = await db.query(sql, [MaNgayNghiBS]);
    return result;
  },

  // Xem chi tiết 1 ngày nghỉ
  getById: async (MaNgayNghiBS) => {
    const sql = 'SELECT * FROM BacSiNgayNghi WHERE MaNgayNghiBS = ?';
    const [rows] = await db.query(sql, [MaNgayNghiBS]);
    return rows[0];
  },
};

module.exports = BacSiNgayNghiModel;
