const db = require('../config/server');

const LichLamViecModel = {
  // Lấy tất cả lịch làm việc, kèm thông tin bác sĩ
  getAlls: async () => {
    try {
      const sql = `
        SELECT llv.*, bs.HoTen AS TenBacSi
        FROM lichlamviec llv
        JOIN bacsi bs ON llv.MaBacSi = bs.MaBacSi
        ORDER BY bs.HoTen, llv.ThuTrongTuan
      `;
      const [rows] = await db.query(sql);
      return rows;
    } catch (error) {
      console.error('Query Error:', error.message);
      throw new Error('Database query failed');
    }
  },

  // Lấy lịch làm việc theo ID lịch
  getById: async (id) => {
    try {
      const sql = `SELECT * FROM lichlamviec WHERE MaLichLamViec = ?`;
      const [rows] = await db.query(sql, [id]);
      return rows[0]; // chỉ trả về 1 record
    } catch (error) {
      console.error('Query Error:', error.message);
      throw new Error('Database query failed');
    }
  },

  // Lấy lịch làm việc theo bác sĩ
  getByBacSi: async (maBacSi) => {
    try {
      const sql = `SELECT * FROM lichlamviec WHERE MaBacSi = ?`;
      const [rows] = await db.query(sql, [maBacSi]);
      return rows;
    } catch (error) {
      console.error('Query Error:', error.message);
      throw new Error('Database query failed');
    }
  },

  // Thêm lịch làm việc mới
  create: async (data) => {
    try {
      const sql = `INSERT INTO lichlamviec SET ?`;
      const [result] = await db.query(sql, data);
      return result;
    } catch (error) {
      console.error('Insert Error:', error.message);
      throw new Error('Database insert failed');
    }
  },

  // Cập nhật lịch làm việc
  update: async (id, data) => {
    try {
      const sql = `UPDATE lichlamviec SET ? WHERE MaLichLamViec = ?`;
      const [result] = await db.query(sql, [data, id]);
      return result;
    } catch (error) {
      console.error('Update Error:', error.message);
      throw new Error('Database update failed');
    }
  },

  // Xóa lịch làm việc
  delete: async (id) => {
    try {
      const sql = `DELETE FROM lichlamviec WHERE MaLichLamViec = ?`;
      const [result] = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('Delete Error:', error.message);
      throw new Error(`Failed to delete work schedule: ${error.message}`);
    }
  }
};

module.exports = LichLamViecModel;
