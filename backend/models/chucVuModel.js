const db = require('../config/server');

module.exports = {
    getAlls: async () => {
        try {
            const sql = 'SELECT * FROM chucvu';
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },
    getById: async (id) => {
        try {
            const sql = 'SELECT * FROM chucvu WHERE MaChucVu = ?';
            const [row] = await db.query(sql, [id]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },
    create: async (data) => {
        try {
            const sql = 'INSERT INTO chucvu SET ?';
            const [result] = await db.query(sql, data);
            return result;
        } catch (error) {
            console.error('Insert Error:', error.message);
            throw new Error('Database insert failed');
        }
    },
    update: async (id, data) => {
        try {
            const sql = 'UPDATE chucvu SET ? WHERE MaChucVu = ?';
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error('Update Error:', error.message);
            throw new Error('Database update failed');
        }
    },
    delete: async (id) => {
        try {
            const sql = 'DELETE FROM chucvu WHERE MaChucVu = ?';
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error('Delete Error:', error.message);
            throw new Error(`Failed to delete role: ${error.message}`);
        }
    }
};
