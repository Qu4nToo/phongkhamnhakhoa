const db = require('../config/server');
const { getByEmail } = require('./khachHangModel');

module.exports = {
    getAlls: async () => {
        try {
            const sql = `
            SELECT 
            nd.*
            FROM nguoidung nd
        `;
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },
    getById: async (id) => {
        try {
            const sql = `
            SELECT 
            nd.*
            FROM nguoidung nd
            WHERE nd.MaNguoiDung = ?
        `;

            const [row] = await db.query(sql, [id]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },
    getByEmail: async (email) => {
        try {
            const sql = `
            SELECT 
            nd.*
            FROM nguoidung nd
            WHERE nd.Email = ?
        `;
            const [row] = await db.query(sql, [email]);
            return row[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },
    create: async (data) => {
        try {
            const sql = 'INSERT INTO nguoidung SET ?';
            const [result] = await db.query(sql, data);
            return result;
        } catch (error) {
            console.error('Insert Error:', error.message);
            throw new Error('Database insert failed');
        }
    },
    update: async (id, data) => {
        try {
            const sql = 'UPDATE nguoidung SET ? WHERE MaNguoiDung = ?';
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error('Update Error:', error.message);
            throw new Error('Database update failed');
        }
    },
    updatePassword: async (id, password) => {
        try {
            const sql = 'UPDATE nguoidung SET MatKhau = ? WHERE MaNguoiDung = ?';
            const [result] = await db.query(sql, [password, id]);
            return result;
        } catch (error) {
            console.error('Update Password Error:', error.message);
            throw new Error('Database update failed');
        }
    },
    delete: async (id) => {
        try {
            const sql = 'DELETE FROM nguoidung WHERE MaNguoiDung = ?';
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error('Delete Error:', error.message);
            throw new Error(`Failed to delete user: ${error.message}`);
        }
    }
};
