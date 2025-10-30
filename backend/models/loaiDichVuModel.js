const db = require("../config/server");

module.exports = {
    // ✅ Lấy tất cả loại dịch vụ
    getAlls: async () => {
        try {
            const sql = 'SELECT * FROM loaidichvu';
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },

    // ✅ Lấy loại dịch vụ theo ID
    getById: async (id) => {
        try {
            const sql = 'SELECT * FROM loaidichvu WHERE MaLoaiDV = ?';
            const [rows] = await db.query(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error('Query Error:', error);
            throw new Error('Database query failed');
        }
    },

    // ✅ Tạo mới loại dịch vụ
    create: async (data) => {
        try {
            const sql = 'INSERT INTO loaidichvu SET ?';
            const [result] = await db.query(sql, data);
            return result;
        } catch (error) {
            console.error('Insert Error:', error);
            throw new Error('Database insert failed');
        }
    },

    // ✅ Cập nhật loại dịch vụ
    update: async (id, data) => {
        try {
            const sql = 'UPDATE loaidichvu SET ? WHERE MaLoaiDV = ?';
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error('Update Error:', error);
            throw new Error('Database update failed');
        }
    },

    // ✅ Xóa loại dịch vụ
    delete: async (id) => {
        try {
            const sql = 'DELETE FROM loaidichvu WHERE MaLoaiDV = ?';
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error('Delete Error:', error);
            throw new Error(`Failed to delete service type: ${error.message}`);
        }
    }
};
