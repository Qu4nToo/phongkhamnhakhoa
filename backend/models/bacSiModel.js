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
    },

    // Lấy danh sách bác sĩ có thể làm dịch vụ cụ thể
    getByDichVu: async (dichVuId) => {
        try {
            const sql = `
                SELECT DISTINCT bs.*
                FROM bacsi bs
                INNER JOIN chitietdichvu ctdv ON bs.MaBacSi = ctdv.MaBacSi
                WHERE ctdv.MaDichVu = ?
            `;
            const [rows] = await db.query(sql, [dichVuId]);
            return rows;
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    // Thống kê cho bác sĩ
    getDoctorStats: async (doctorId) => {
        try {
            const sql = `
                SELECT 
                    (SELECT COUNT(*) FROM lichhen WHERE MaBacSi = ? AND DATE(NgayHen) = CURDATE() AND TinhTrang != 'Đã hủy') AS lichHenHomNay,
                    (SELECT COUNT(*) FROM lichhen WHERE MaBacSi = ? AND YEARWEEK(NgayHen, 1) = YEARWEEK(CURDATE(), 1) AND TinhTrang != 'Đã hủy') AS lichHenTuanNay,
                    (SELECT COUNT(*) FROM phieukham WHERE MaBacSi = ? AND MONTH(NgayKham) = MONTH(CURDATE()) AND YEAR(NgayKham) = YEAR(CURDATE())) AS soLuotKhamThang,
                    (SELECT COUNT(*) FROM phieukham WHERE MaBacSi = ?) AS tongSoLuotKham
            `;
            const [rows] = await db.query(sql, [doctorId, doctorId, doctorId, doctorId]);
            return rows[0];
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    // Lịch hẹn hôm nay của bác sĩ
    getTodayAppointments: async (doctorId) => {
        try {
            const sql = `
                SELECT 
                    lh.MaLichHen,
                    kh.HoTen AS TenKhachHang,
                    kh.SoDienThoai,
                    dv.TenDichVu,
                    lh.NgayHen,
                    lh.GioHen,
                    lh.TinhTrang
                FROM lichhen lh
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaBacSi = ? AND DATE(lh.NgayHen) = CURDATE()
                ORDER BY lh.GioHen ASC
            `;
            const [rows] = await db.query(sql, [doctorId]);
            return rows;
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    // Lịch hẹn sắp tới (7 ngày)
    getUpcomingAppointments: async (doctorId) => {
        try {
            const sql = `
                SELECT 
                    lh.MaLichHen,
                    kh.HoTen AS TenKhachHang,
                    kh.SoDienThoai,
                    dv.TenDichVu,
                    lh.NgayHen,
                    lh.GioHen,
                    lh.TinhTrang
                FROM lichhen lh
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaBacSi = ? 
                    AND lh.NgayHen BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
                    AND lh.TinhTrang != 'Đã hủy'
                ORDER BY lh.NgayHen ASC, lh.GioHen ASC
                LIMIT 10
            `;
            const [rows] = await db.query(sql, [doctorId]);
            return rows;
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    // Thống kê lịch hẹn theo trạng thái
    getAppointmentsByStatus: async (doctorId) => {
        try {
            const sql = `
                SELECT 
                    TinhTrang,
                    COUNT(*) AS soLuong
                FROM lichhen
                WHERE MaBacSi = ?
                GROUP BY TinhTrang
            `;
            const [rows] = await db.query(sql, [doctorId]);
            return rows;
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    },

    // Biểu đồ lịch hẹn 7 ngày gần nhất
    getAppointmentsChart: async (doctorId) => {
        try {
            const sql = `
                SELECT 
                    DATE(NgayHen) AS ngay,
                    COUNT(*) AS soLuong
                FROM lichhen
                WHERE MaBacSi = ? AND NgayHen >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
                GROUP BY DATE(NgayHen)
                ORDER BY ngay ASC
            `;
            const [rows] = await db.query(sql, [doctorId]);
            return rows;
        } catch (error) {
            console.error('Query Error:', error.message);
            throw new Error('Database query failed');
        }
    }
};