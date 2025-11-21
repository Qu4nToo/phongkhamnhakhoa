const db = require('../config/server');

module.exports = {
  getAlls: async () => {
    try {
      const [rows] = await db.query('SELECT * FROM chitietphieukham');
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getById: async (id) => {
    try {
      const [row] = await db.query('SELECT * FROM chitietphieukham WHERE MaCTPK = ?', [id]);
      return row[0];
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },
  getByPhieuKhamId: async (id) => {
    try {
      const [rows] = await db.query('SELECT ctpk.*, dv.TenDichVu, dv.Gia as DonGia FROM chitietphieukham ctpk join dichvu dv on ctpk.MaDichVu = dv.MaDichVu WHERE ctpk.MaPhieuKham = ?', [id]);
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  create: async (data) => {
    try {
      const [result] = await db.query('INSERT INTO chitietphieukham SET ?', data);
      return result;
    } catch (err) {
      console.error('Insert Error:', err.message);
      throw new Error('Database insert failed');
    }
  },

  update: async (id, data) => {
    try {
      const [result] = await db.query('UPDATE chitietphieukham SET ? WHERE MaCTPK = ?', [data, id]);
      return result;
    } catch (err) {
      console.error('Update Error:', err.message);
      throw new Error('Database update failed');
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM chitietphieukham WHERE MaCTPK = ?', [id]);
      return result;
    } catch (err) {
      console.error('Delete Error:', err.message);
      throw new Error('Database delete failed');
    }
  },
};
