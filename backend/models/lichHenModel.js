const db = require("../config/server");

module.exports = {
    getAlls: async () => {
        try {
            const sql =
                "SELECT lh.*, kh.HoTen AS TenKhachHang, bs.HoTen AS TenBacSi FROM lichhen lh join khachhang kh on lh.MaKhachHang = kh.MaKhachHang join bacsi bs on lh.MaBacSi = bs.MaBacSi";
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error("Query Error:", err.message);
            throw new Error("Database query failed");
        }
    },
    getById: async (id) => {
        try {
            const sql = "SELECT * FROM lichhen WHERE MaLichHen = ?";
            const [row] = await db.query(sql, [id]);
            return row;
        } catch (error) {
            console.error("Query Error:", error.message);
            throw new Error("Database query failed");
        }
    },

    getByBacSiId: async (id) => {
        try {
            const sql = "SELECT * FROM lichhen WHERE MaBacSi = ?";
            const [row] = await db.query(sql, [id]);
            return row;
        } catch (error) {
            console.error("Query Error:", error.message);
            throw new Error("Database query failed");
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
            console.error("Query Error:", error.message);
            throw new Error("Database query failed");
        }
    },

    create: async (data) => {
        try {
            const { MaBacSi, MaKhachHang, NgayHen, GhiChu } = data;

            // Kiểm tra số lượng lịch đã có trong ngày
            const sqlCheck = `
            SELECT COUNT(*) AS count 
            FROM lichhen 
            WHERE MaBacSi = ? AND DATE(NgayHen) = DATE(?)
        `;
            const [rows] = await db.query(sqlCheck, [MaBacSi, NgayHen]);

            if (rows[0].count >= 6) {
                // Trả lỗi về cho controller xử lý
                const err = new Error(
                    "Bác sĩ này đã có đủ 6 lịch trong ngày, vui lòng chọn ngày khác!"
                );
                err.code = 400;
                throw err;
            }

            // Nếu chưa đủ 6 thì thêm mới
            const sqlInsert = `
            INSERT INTO lichhen (MaLichHen, MaKhachHang, MaBacSi, NgayHen, GhiChu)
            VALUES (UUID(), ?, ?, ?, ?)
        `;
            const [result] = await db.query(sqlInsert, [
                MaKhachHang,
                MaBacSi,
                NgayHen,
                GhiChu,
            ]);

            return result;
        } catch (error) {
            console.error("❌ Lỗi khi thêm lịch hẹn trong Model:", error.message);
            throw error;
        }
    },

    update: async (id, data) => {
        try {
            const sql = "UPDATE lichhen SET ? WHERE MaLichHen = ?";
            const [result] = await db.query(sql, [data, id]);
            return result;
        } catch (error) {
            console.error("Update Error:", error.message);
            throw new Error("Database update failed");
        }
    },
    delete: async (id) => {
        try {
            const sql = "DELETE FROM lichhen WHERE MaLichHen = ?";
            const [result] = await db.query(sql, [id]);
            return result;
        } catch (error) {
            console.error("Delete Error:", error.message);
            throw new Error(`Failed to delete appointment: ${error.message}`);
        }
    },
    countByBacSiAndDate: async (MaBacSi, NgayHen) => {
        try {
            const sql = `
                SELECT COUNT(*) AS count
                FROM lichhen
                WHERE MaBacSi = ? AND DATE(NgayHen) = DATE(?)
            `;
            const [rows] = await db.query(sql, [MaBacSi, NgayHen]);
            return rows[0].count; // trả về số lượng lịch hẹn
        } catch (error) {
            console.error("Count Error:", error.message);
            throw new Error("Database count failed");
        }
    },
    countByKhachHangAndDate: async (MaKhachHang, NgayHen) => {
        try {
            const sql = `
                SELECT COUNT(*) AS count
                FROM lichhen
                WHERE MaKhachHang = ? AND DATE(NgayHen) = DATE(?)
            `;
            const [rows] = await db.query(sql, [MaKhachHang, NgayHen]);

            if (rows && rows.length > 0) {
                return rows[0].count; // ✅ Trả về số lượng lịch trùng
            } else {
                return 0; // ✅ Không có lịch nào trùng
            }
        } catch (error) {
            console.error("Count Error:", error.message);
            throw new Error("Database count failed");
        }
    },
};
