const db = require('../config/server');

module.exports = {
  getAlls: async () => {
    try {
      const [rows] = await db.query('SELECT dv.*,ldv.MaLoaiDV,ldv.TenLoaiDV, ldv.MoTa as MoTaLoai FROM dichvu dv JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV');
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getById: async (id) => {
    try {
      const [row] = await db.query('SELECT * FROM dichvu WHERE MaDichVu = ?', [id]);
      return row[0];
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getByLoaiDichVu: async (maLoaiDV) => {
    try {
      const [rows] = await db.query(
        'SELECT dv.*, ldv.MaLoaiDV, ldv.TenLoaiDV, ldv.MoTa as MoTaLoai FROM dichvu dv JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV WHERE dv.MaLoaiDV = ?',
        [maLoaiDV]
      );
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getBySlug: async (slug) => {
    try {
      const [rows] = await db.query(
        'SELECT dv.*, ldv.MaLoaiDV, ldv.TenLoaiDV, ldv.Slug as SlugLoaiDV, ldv.MoTa as MoTaLoai FROM dichvu dv JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV WHERE dv.Slug = ?',
        [slug]
      );
      return rows[0];
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  create: async (data) => {
    try {
      const [result] = await db.query('INSERT INTO dichvu SET ?', data);
      return result;
    } catch (err) {
      console.error('Insert Error:', err.message);
      throw new Error('Database insert failed');
    }
  },

  update: async (id, data) => {
    try {
      const [result] = await db.query('UPDATE dichvu SET ? WHERE MaDichVu = ?', [data, id]);
      return result;
    } catch (err) {
      console.error('Update Error:', err.message);
      throw new Error('Database update failed');
    }
  },

  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM dichvu WHERE MaDichVu = ?', [id]);
      return result;
    } catch (err) {
      console.error('Delete Error:', err.message);
      throw new Error('Database delete failed');
    }
  },
};
