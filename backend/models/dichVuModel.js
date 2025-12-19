const db = require('../config/server');

module.exports = {
  getAlls: async () => {
    try {
      const [rows] = await db.query(`
        SELECT 
          dv.*,
          ldv.MaLoaiDV,
          ldv.TenLoaiDV, 
          ldv.MoTa as MoTaLoai,
          COUNT(ha.MaHinhAnh) as SoLuongHinh,
          (SELECT URL FROM hinhanhdichvu WHERE MaDichVu = dv.MaDichVu AND LaAnhChinh = 1 LIMIT 1) as AnhChinh
        FROM dichvu dv 
        JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV
        LEFT JOIN hinhanhdichvu ha ON dv.MaDichVu = ha.MaDichVu
        GROUP BY dv.MaDichVu
      `);
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
      const [rows] = await db.query(`
        SELECT 
          dv.*, 
          ldv.MaLoaiDV, 
          ldv.TenLoaiDV, 
          ldv.MoTa as MoTaLoai,
          (SELECT URL FROM hinhanhdichvu WHERE MaDichVu = dv.MaDichVu AND LaAnhChinh = 1 LIMIT 1) as AnhChinh
        FROM dichvu dv 
        JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV 
        WHERE dv.MaLoaiDV = ?
      `, [maLoaiDV]);
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getBySlug: async (slug) => {
    try {
      // Lấy thông tin dịch vụ
      const [rows] = await db.query(
        'SELECT dv.*, ldv.MaLoaiDV, ldv.TenLoaiDV, ldv.Slug as SlugLoaiDV, ldv.MoTa as MoTaLoai FROM dichvu dv JOIN loaidichvu ldv ON dv.MaLoaiDV = ldv.MaLoaiDV WHERE dv.Slug = ?',
        [slug]
      );

      if (rows.length === 0) return null;

      const dichVu = rows[0];

      // Lấy tất cả ảnh của dịch vụ
      const [images] = await db.query(
        'SELECT * FROM hinhanhdichvu WHERE MaDichVu = ? ORDER BY ThuTu ASC',
        [dichVu.MaDichVu]
      );

      // Gắn mảng ảnh vào object dịch vụ
      dichVu.HinhAnhs = images;

      return dichVu;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getByName: async (name) => {
    try {
      const [rows] = await db.query('SELECT * FROM dichvu WHERE TenDichVu LIKE ?', [`%${name}%`]);
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getByBacSi: async (dichVuId) => {
    try {
      const sql = `
                SELECT DISTINCT dv.*
                FROM dichvu dv
                INNER JOIN chitietdichvu ctdv ON dv.MaDichVu = ctdv.MaDichVu
                WHERE ctdv.MaBacSi = ?
            `;
      const [rows] = await db.query(sql, [dichVuId]);
      return rows;
    } catch (error) {
      console.error('Query Error:', error.message);
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
