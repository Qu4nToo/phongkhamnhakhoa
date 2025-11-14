const db = require('../config/server');

module.exports = {
    getAlls: async () => {
        try {
            const sql = `SELECT * FROM bacsi bs`;
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },
    getById: async (id) => {
        try {
            const sql = `SELECT * FROM bacsi bs 
                        JOIN lichlamviec llv ON llv.MaBacSi=bs.MaBacSi
                        WHERE bs.MaBacSi = ?`;
            const [row] = await db.query(sql, [id]);
            return row;
        } catch (error) {
            console.error('Query Error:', error);
            throw new Error('Database query failed');
        }
    },
    getByEmail: async (email) => {
        try {
            const sql = `SELECT * FROM bacsi WHERE Email = ?`;
            const [row] = await db.query(sql, [email]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error);
            throw new Error('Database query failed');
        }
    },
    create: async (data) => {
        try {
            const sql = `INSERT INTO bacsi set ?`;
            const [result] = await db.query(sql, data);
            return result;
        } catch (error) {
            console.error('Insert Error:', error);
            throw new Error('Database insert failed');
        }
    },
    update: async (id, data) => {
        try {
            const sql = `UPDATE bacsi SET ? WHERE MaBacSi = ?`;
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error('Update Error:', error);
            throw new Error('Database update failed');
        }
    },
    delete: async (id) => {
        try {
            const sql = `DELETE FROM bacsi WHERE MaBacSi = ?`;
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error('Delete Error:', error);
            throw new Error(`Failed to delete doctor: ${error.message}`);
        }
    }
};