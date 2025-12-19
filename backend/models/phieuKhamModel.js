const db = require('../config/server');

module.exports = {
  getAlls: async () => {
    try {
      const [rows] = await db.query('SELECT pk.*, kh.HoTen as TenKhachHang, bs.HoTen as TenBacSi, lh.GioHen FROM phieukham pk join khachhang kh on pk.MaKhachHang = kh.MaKhachHang join bacsi bs on pk.MaBacSi = bs.MaBacSi left join lichhen lh on pk.MaLichHen = lh.MaLichHen order by pk.NgayKham asc, lh.GioHen asc');
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getById: async (id) => {
    try {
      const [row] = await db.query('SELECT pk.*, kh.HoTen as TenKhachHang, bs.HoTen as TenBacSi, lh.GioHen FROM phieukham pk join khachhang kh on pk.MaKhachHang = kh.MaKhachHang join bacsi bs on pk.MaBacSi = bs.MaBacSi left join lichhen lh on pk.MaLichHen = lh.MaLichHen WHERE pk.MaPhieuKham = ?', [id]);
      return row[0];
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getByBacSiId: async (id) => {
    try {
      const [row] = await db.query('SELECT pk.*, kh.HoTen as TenKhachHang, bs.HoTen as TenBacSi, lh.GioHen FROM phieukham pk join khachhang kh on pk.MaKhachHang = kh.MaKhachHang join bacsi bs on pk.MaBacSi = bs.MaBacSi left join lichhen lh on pk.MaLichHen = lh.MaLichHen WHERE pk.MaBacSi = ? order by pk.NgayKham asc, lh.GioHen asc', [id]);
      return row;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  getByKhachHangId: async (id) => {
    try {
      const [rows] = await db.query('SELECT pk.*, kh.HoTen as TenKhachHang, bs.HoTen as TenBacSi, lh.GioHen FROM phieukham pk join khachhang kh on pk.MaKhachHang = kh.MaKhachHang join bacsi bs on pk.MaBacSi = bs.MaBacSi left join lichhen lh on pk.MaLichHen = lh.MaLichHen WHERE pk.MaKhachHang = ? order by pk.NgayKham desc, lh.GioHen desc', [id]);
      return rows;
    } catch (err) {
      console.error('Query Error:', err.message);
      throw new Error('Database query failed');
    }
  },

  findByFields: async ({ MaKhachHang, MaBacSi, NgayKham }) => {
    try {
      const sql = `
            SELECT * FROM phieukham 
            WHERE MaKhachHang = ? AND MaBacSi = ? AND NgayKham = ?
        `;
      // Giả sử db.query trả về một mảng kết quả
      const [rows] = await db.query(sql, [MaKhachHang, MaBacSi, NgayKham]);
      return rows;
    } catch (error) {
      console.error("Query Error:", error.message);
      throw new Error("Database query failed");
    }
  },

    findByLichHenID: async ({ MaLichHen }) => {
    try {
      const sql = `
            SELECT * FROM phieukham 
            WHERE MaLichHen = ?
        `;
      // Giả sử db.query trả về một mảng kết quả
      const [rows] = await db.query(sql, [MaLichHen]);
      return rows;
    } catch (error) {
      console.error("Query Error:", error.message);
      throw new Error("Database query failed");
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
