const db = require('../config/server');

module.exports = {
  getAlls: async () => {
    try {
      const [rows] = await db.query('SELECT pk.*, kh.HoTen as TenKhachHang, bs.HoTen as TenBacSi FROM phieukham pk join khachhang kh on pk.MaKhachHang = kh.MaKhachHang join bacsi bs on pk.MaBacSi = bs.MaBacSi');
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getById: async (id) => {
    try {
      const [row] = await db.query('SELECT * FROM phieukham WHERE MaPhieuKham = ?', [id]);
      return row[0];
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  create: async (data) => {
    try {
      const [result] = await db.query('INSERT INTO phieukham SET ?', data);
      return result;
    } catch (err) {
      console.error('Insert Error:', err.message);
      throw new Error('Database insert failed');
    }
  },

  update: async (id, data) => {
    try {
      const [result] = await db.query('UPDATE phieukham SET ? WHERE MaPhieuKham = ?', [data, id]);
      return result;
    } catch (err) {
      console.error('Update Error:', err.message);
      throw new Error('Database update failed');
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM phieukham WHERE MaPhieuKham = ?', [id]);
      return result;
    } catch (err) {
      console.error('Delete Error:', err.message);
      throw new Error('Database delete failed');
    }
  },
};
