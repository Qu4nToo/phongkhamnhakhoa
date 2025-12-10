const db = require('../config/server');

module.exports = {
    // Thêm nhiều ảnh cho dịch vụ
    createMultiple: async (maDichVu, imageUrls) => {
        try {
            // Lấy ThuTu lớn nhất hiện tại của dịch vụ
            const [maxResult] = await db.query(
                'SELECT COALESCE(MAX(ThuTu), 0) as maxThuTu FROM hinhanhdichvu WHERE MaDichVu = ?',
                [maDichVu]
            );
            const startIndex = maxResult[0].maxThuTu + 1;

            // Tạo values với ThuTu tiếp tục từ max hiện tại
            const values = imageUrls.map((url, index) => [
                maDichVu,
                url,
                startIndex + index
            ]);
            const [result] = await db.query(
                'INSERT INTO hinhanhdichvu (MaDichVu, URL, ThuTu) VALUES ?',
                [values]
            );
            return result;
        } catch (err) {
            console.error('Insert Error:', err.message);
            throw new Error('Database insert failed');
        }
    },

    // Lấy tất cả ảnh của dịch vụ
    getByDichVuId: async (maDichVu) => {
        try {
            const [rows] = await db.query(
                'SELECT * FROM hinhanhdichvu WHERE MaDichVu = ? ORDER BY ThuTu ASC',
                [maDichVu]
            );
            return rows;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },

    // Lấy ảnh chính của dịch vụ
    getMainImage: async (maDichVu) => {
        try {
            const [rows] = await db.query(
                'SELECT * FROM hinhanhdichvu WHERE MaDichVu = ? AND LaAnhChinh = 1 LIMIT 1',
                [maDichVu]
            );
            return rows[0] || null;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },

    // Lấy thông tin một ảnh theo ID
    getById: async (maHinhAnh) => {
        try {
            const [rows] = await db.query(
                'SELECT * FROM hinhanhdichvu WHERE MaHinhAnh = ? LIMIT 1',
                [maHinhAnh]
            );
            return rows[0] || null;
        } catch (err) {
            console.error('Query Error:', err.message);
            throw new Error('Database query failed');
        }
    },

    // Đặt ảnh làm ảnh chính
    setMainImage: async (maHinhAnh, maDichVu) => {
        try {
            // Bỏ flag LaAnhChinh của tất cả ảnh khác
            await db.query(
                'UPDATE hinhanhdichvu SET LaAnhChinh = 0 WHERE MaDichVu = ?',
                [maDichVu]
            );
            // Set ảnh hiện tại làm ảnh chính
            const [result] = await db.query(
                'UPDATE hinhanhdichvu SET LaAnhChinh = 1 WHERE MaHinhAnh = ?',
                [maHinhAnh]
            );
            return result;
        } catch (err) {
            console.error('Update Error:', err.message);
            throw new Error('Database update failed');
        }
    },

    // Xóa một ảnh
    delete: async (maHinhAnh) => {
        try {
            const [result] = await db.query(
                'DELETE FROM hinhanhdichvu WHERE MaHinhAnh = ?',
                [maHinhAnh]
            );
            return result;
        } catch (err) {
            console.error('Delete Error:', err.message);
            throw new Error('Database delete failed');
        }
    },

    // Xóa tất cả ảnh của dịch vụ
    deleteByDichVuId: async (maDichVu) => {
        try {
            const [result] = await db.query(
                'DELETE FROM hinhanhdichvu WHERE MaDichVu = ?',
                [maDichVu]
            );
            return result;
        } catch (err) {
            console.error('Delete Error:', err.message);
            throw new Error('Database delete failed');
        }
    },

    // Cập nhật thứ tự ảnh - sắp xếp lại toàn bộ để tránh trùng lặp
    updateOrder: async (maHinhAnh, thuTuMoi) => {
        try {
            // Lấy thông tin ảnh hiện tại
            const [currentImage] = await db.query(
                'SELECT MaDichVu, ThuTu FROM hinhanhdichvu WHERE MaHinhAnh = ?',
                [maHinhAnh]
            );
            
            if (!currentImage[0]) {
                throw new Error('Không tìm thấy ảnh');
            }

            const { MaDichVu, ThuTu: thuTuCu } = currentImage[0];

            // Nếu thứ tự không đổi thì không cần làm gì
            if (thuTuCu === thuTuMoi) {
                return { affectedRows: 0 };
            }

            // Lấy tất cả ảnh của dịch vụ này
            const [allImages] = await db.query(
                'SELECT MaHinhAnh, ThuTu FROM hinhanhdichvu WHERE MaDichVu = ? ORDER BY ThuTu ASC',
                [MaDichVu]
            );

            // Sắp xếp lại thứ tự
            if (thuTuMoi < thuTuCu) {
                // Di chuyển lên trên: tăng ThuTu của các ảnh ở giữa
                await db.query(
                    'UPDATE hinhanhdichvu SET ThuTu = ThuTu + 1 WHERE MaDichVu = ? AND ThuTu >= ? AND ThuTu < ?',
                    [MaDichVu, thuTuMoi, thuTuCu]
                );
            } else {
                // Di chuyển xuống dưới: giảm ThuTu của các ảnh ở giữa
                await db.query(
                    'UPDATE hinhanhdichvu SET ThuTu = ThuTu - 1 WHERE MaDichVu = ? AND ThuTu > ? AND ThuTu <= ?',
                    [MaDichVu, thuTuCu, thuTuMoi]
                );
            }

            // Cập nhật thứ tự của ảnh hiện tại
            const [result] = await db.query(
                'UPDATE hinhanhdichvu SET ThuTu = ? WHERE MaHinhAnh = ?',
                [thuTuMoi, maHinhAnh]
            );

            return result;
        } catch (err) {
            console.error('Update Error:', err.message);
            throw new Error('Database update failed');
        }
    },

};
