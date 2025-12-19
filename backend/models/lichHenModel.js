const db = require("../config/server");

module.exports = {
    getAlls: async () => {
        try {
            const sql = `
                SELECT lh.*, 
                       kh.HoTen AS TenKhachHang, 
                       bs.HoTen AS TenBacSi,
                       dv.TenDichVu,
                       dv.Gia,
                       dv.ThoiLuong,
                       dv.DonVi
                FROM lichhen lh 
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang 
                LEFT JOIN bacsi bs ON lh.MaBacSi = bs.MaBacSi
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                ORDER BY lh.NgayHen ASC, lh.GioHen ASC
            `;
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            console.error("Query Error:", err.message);
            throw new Error("Database query failed");
        }
    },
    getById: async (id) => {
        try {
            const sql = `
                SELECT lh.*, 
                       kh.HoTen AS TenKhachHang, 
                       bs.HoTen AS TenBacSi,
                       dv.TenDichVu,
                       dv.Gia,
                       dv.ThoiLuong,
                       dv.DonVi
                FROM lichhen lh 
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang 
                LEFT JOIN bacsi bs ON lh.MaBacSi = bs.MaBacSi
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaLichHen = ?
            `;
            const [rows] = await db.query(sql, [id]);
            return rows[0];
        } catch (error) {
            console.error("Query Error:", error.message);
            throw new Error("Database query failed");
        }
    },

    getByBacSiId: async (id) => {
        try {
            const sql = `
                SELECT lh.*, 
                       kh.HoTen AS TenKhachHang,
                       kh.SoDienThoai,
                       dv.TenDichVu,
                       dv.Gia,
                       dv.ThoiLuong,
                       dv.DonVi
                FROM lichhen lh 
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang 
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaBacSi = ?
                ORDER BY lh.NgayHen ASC, lh.GioHen ASC
            `;
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
                       bs.SoDienThoai AS SDT,
                       dv.TenDichVu,
                       dv.Gia,
                       dv.ThoiLuong,
                       dv.DonVi
                FROM lichhen lh 
                JOIN khachhang kh ON lh.MaKhachHang = kh.MaKhachHang 
                LEFT JOIN bacsi bs ON lh.MaBacSi = bs.MaBacSi
                LEFT JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaKhachHang = ?
                ORDER BY lh.NgayHen ASC, lh.GioHen ASC
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
            const { MaBacSi, MaKhachHang, NgayHen, GioHen, GhiChu, MaDichVu } = data;

            // Kiểm tra trùng lặp theo bác sĩ, ngày và KHOẢNG THỜI GIAN (nếu có bác sĩ)
            if (MaBacSi && MaDichVu) {
                // Lấy thời lượng của dịch vụ
                const [dichvu] = await db.query('SELECT ThoiLuong FROM dichvu WHERE MaDichVu = ?', [MaDichVu]);
                if (!dichvu || dichvu.length === 0) {
                    const err = new Error("Không tìm thấy dịch vụ!");
                    err.code = 400;
                    throw err;
                }
                const thoiLuong = dichvu[0].ThoiLuong; // phút

                // Tính giờ bắt đầu và kết thúc của lịch hẹn mới
                const [gioStr] = GioHen.split(' - '); // Lấy giờ bắt đầu từ "08:00 - 10:00"
                const [gio, phut] = gioStr.split(':').map(Number);
                const gioBatDau = gio * 60 + phut; // Chuyển sang phút
                const gioKetThuc = gioBatDau + thoiLuong;

                // Kiểm tra các lịch hẹn đã có của bác sĩ trong ngày
                const sqlCheck = `
                    SELECT lh.GioHen, dv.ThoiLuong
                    FROM lichhen lh
                    JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                    WHERE lh.MaBacSi = ? AND DATE(lh.NgayHen) = DATE(?)
                `;
                const [existingBookings] = await db.query(sqlCheck, [MaBacSi, NgayHen]);

                // Kiểm tra xem có chồng lấn thời gian không
                for (const booking of existingBookings) {
                    const [existGioStr] = booking.GioHen.split(' - ');
                    const [existGio, existPhut] = existGioStr.split(':').map(Number);
                    const existBatDau = existGio * 60 + existPhut;
                    const existKetThuc = existBatDau + booking.ThoiLuong;

                    // Kiểm tra chồng lấn: (Start1 < End2) AND (Start2 < End1)
                    if (gioBatDau < existKetThuc && existBatDau < gioKetThuc) {
                        const err = new Error(
                            `Bác sĩ đã có lịch hẹn từ ${booking.GioHen} (${booking.ThoiLuong} phút). Vui lòng chọn giờ khác!`
                        );
                        err.code = 400;
                        throw err;
                    }
                }
            }

            // Thêm mới lịch hẹn
            const sqlInsert = `
                INSERT INTO lichhen (MaLichHen, MaKhachHang, MaBacSi, NgayHen, GioHen, GhiChu, MaDichVu)
                VALUES (UUID(), ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await db.query(sqlInsert, [
                MaKhachHang,
                MaBacSi,
                NgayHen,
                GioHen,
                GhiChu,
                MaDichVu,
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
    updateStatus: async (id, TinhTrang) => {
        try {
            const sql = "UPDATE lichhen SET TinhTrang = ? WHERE MaLichHen = ?";
            const [result] = await db.query(sql, [TinhTrang, id]);
            return result;
        } catch (error) {
            console.error("Update Status Error:", error.message);
            throw new Error("Database update status failed");
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

    // Lấy các slot thời gian khả dụng
    getAvailableSlots: async (bacSiId, ngayHen, dichVuId) => {
        try {

            const [dichvu] = await db.query('SELECT ThoiLuong FROM dichvu WHERE MaDichVu = ?', [dichVuId]);
            if (!dichvu || dichvu.length === 0) {
                throw new Error("Không tìm thấy dịch vụ!");
            }
            const thoiLuong = dichvu[0].ThoiLuong;

            const [existingBookings] = await db.query(`
                SELECT lh.GioHen, dv.ThoiLuong
                FROM lichhen lh
                JOIN dichvu dv ON lh.MaDichVu = dv.MaDichVu
                WHERE lh.MaBacSi = ? AND DATE(lh.NgayHen) = DATE(?)
            `, [bacSiId, ngayHen]);

            const allSlots = [];
            for (let h = 8; h < 17; h++) {
                for (let m = 0; m < 60; m += 30) {
                    const startMinutes = h * 60 + m;
                    const endMinutes = startMinutes + thoiLuong;

                    const lunchStart = 11 * 60 + 30;
                    const lunchEnd = 13 * 60;

                    if ((startMinutes >= lunchStart && startMinutes < lunchEnd) ||
                        (endMinutes > lunchStart && endMinutes <= lunchEnd) ||
                        (startMinutes < lunchStart && endMinutes > lunchEnd)) {
                        continue;
                    }

                    if (endMinutes > 17 * 60) continue;

                    const startH = Math.floor(startMinutes / 60);
                    const startM = startMinutes % 60;
                    const endH = Math.floor(endMinutes / 60);
                    const endM = endMinutes % 60;

                    const timeSlot = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')} - ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

                    let isAvailable = true;
                    for (const booking of existingBookings) {
                        const [existGioStr] = booking.GioHen.split(' - ');
                        const [existGio, existPhut] = existGioStr.split(':').map(Number);
                        const existBatDau = existGio * 60 + existPhut;
                        const existKetThuc = existBatDau + booking.ThoiLuong;

                        if (startMinutes < existKetThuc && existBatDau < endMinutes) {
                            isAvailable = false;
                            break;
                        }
                    }

                    allSlots.push({
                        value: timeSlot,
                        label: timeSlot,
                        available: isAvailable
                    });
                }
            }

            return allSlots;
        } catch (error) {
            console.error("Error getting available slots:", error.message);
            throw error;
        }
    },
};
