const db = require('../config/server');

module.exports = {
    getAlls: async () => {
        try {
            const sql = 'SELECT lh.*, kh.HoTen AS TenKhachHang, bs.HoTen AS TenBacSi FROM lichhen lh join khachhang kh on lh.MaKhachHang = kh.MaKhachHang join bacsi bs on lh.MaBacSi = bs.MaBacSi';
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },
    getById: async (id) => {
        try {
            const sql = 'SELECT * FROM lichhen WHERE MaLichHen = ?';
            const [row] = await db.query(sql, [id]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    getByBacSiId: async (id) => {
        try {
            const sql = 'SELECT * FROM lichhen WHERE MaBacSi = ?';
            const [row] = await db.query(sql, [id]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    getByKhachHangId: async (id) => {
        try {
            const sql = `
            SELECT lh.*, 
                   kh.HoTen AS TenKhachHang, 
                   bs.HoTen AS TenBacSi, 
                   bs.SoDienThoai as SDT 
            FROM lichhen lh 
            JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang 
            JOIN bacsi bs ON lh.MaBacSi = bs.MaBacSi 
            WHERE lh.MaKhachHang = ?
        `;
            const [rows] = await db.query(sql, [id]);
            return rows; // Trả về tất cả lịch hẹn
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },


    create: async (data) => {
        try {
            const sql = 'INSERT INTO lichhen SET ?';
            const [result] = await db.query(sql, data);
            return result;
        } catch (error) {
            console.error('Insert Error:', error.message);
            throw new Error('Database insert failed');
        }
    },
    update: async (id, data) => {
        try {
            const sql = 'UPDATE lichhen SET ? WHERE MaLichHen = ?';
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error('Update Error:', error.message);
            throw new Error('Database update failed');
        }
    },
    delete: async (id) => {
        try {
            const sql = 'DELETE FROM lichhen WHERE MaLichHen = ?';
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error('Delete Error:', error.message);
            throw new Error(`Failed to delete appointment: ${error.message}`);
        }
    }
};
