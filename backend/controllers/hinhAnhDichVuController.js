const HinhAnhDichVu = require('../models/hinhAnhDichVuModel');
const DichVu = require('../models/dichVuModel');
const uploadService = require('../services/uploadService');

const HinhAnhDichVuController = {
    // Upload nhiều ảnh cho dịch vụ
    uploadImages: async (req, res) => {
        try {
            const { maDichVu } = req.params;
            
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ message: "Vui lòng chọn ít nhất 1 ảnh!" });
            }

            // Lấy thông tin dịch vụ để lấy tên
            const dichVu = await DichVu.getById(maDichVu);
            if (!dichVu) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }

            // Tạo tên file từ tên dịch vụ (loại bỏ ký tự đặc biệt, thay space bằng dấu gạch ngang)
            const tenDichVuSlug = dichVu.TenDichVu
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu tiếng Việt
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ chữ, số, space và dấu gạch
                .replace(/\s+/g, '-') // Thay space bằng dấu gạch ngang
                .replace(/-+/g, '-'); // Loại bỏ dấu gạch ngang trùng lặp

            // Lấy số thứ tự hiện tại (số lượng ảnh đã có + 1)
            const existingImages = await HinhAnhDichVu.getByDichVuId(maDichVu);
            let currentIndex = existingImages.length;

            // Upload tất cả ảnh lên Firebase với tên file có ý nghĩa
            const uploadPromises = req.files.map((file, index) => {
                const fileExtension = file.originalname.split('.').pop();
                const customFileName = `${tenDichVuSlug}-${currentIndex + index + 1}.${fileExtension}`;
                return uploadService.uploadFile(file, `dichvu/${tenDichVuSlug}`, customFileName);
            });
            const imageUrls = await Promise.all(uploadPromises);

            // Lưu URLs vào database
            await HinhAnhDichVu.createMultiple(maDichVu, imageUrls);

            res.status(201).json({
                message: "Upload ảnh thành công!",
                images: imageUrls
            });
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Lấy tất cả ảnh của dịch vụ
    getImagesByDichVuId: async (req, res) => {
        try {
            const { maDichVu } = req.params;
            const images = await HinhAnhDichVu.getByDichVuId(maDichVu);
            res.status(200).json(images);
        } catch (error) {
            console.error("Lỗi khi lấy ảnh:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Đặt ảnh làm ảnh chính
    setMainImage: async (req, res) => {
        try {
            const { maHinhAnh } = req.params;

            // Lấy thông tin ảnh để lấy maDichVu
            const image = await HinhAnhDichVu.getById(maHinhAnh);
            if (!image) {
                return res.status(404).json({ message: "Không tìm thấy ảnh!" });
            }

            await HinhAnhDichVu.setMainImage(maHinhAnh, image.MaDichVu);
            res.status(200).json({ message: "Đặt ảnh chính thành công!" });
        } catch (error) {
            console.error("Lỗi khi đặt ảnh chính:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Xóa một ảnh
    deleteImage: async (req, res) => {
        try {
            const { maHinhAnh } = req.params;
            
            // Lấy thông tin ảnh để lấy URL
            const image = await HinhAnhDichVu.getById(maHinhAnh);
            if (!image) {
                return res.status(404).json({ message: "Không tìm thấy ảnh!" });
            }

            // Xóa file trên Firebase Storage
            try {
                await uploadService.deleteFile(image.URL);
            } catch (storageError) {
                res.status(500).json({ "error": "⚠️ Lỗi khi xóa file trên Storage (tiếp tục xóa database):", message: storageError.message });
                // Không throw error, vẫn tiếp tục xóa database
            }

            // Xóa record trong database
            await HinhAnhDichVu.delete(maHinhAnh);
            
            res.status(200).json({ message: "Xóa ảnh thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa ảnh:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Cập nhật thứ tự ảnh
    updateOrder: async (req, res) => {
        try {
            const { maHinhAnh } = req.params;
            const { thuTu } = req.body;

            if (thuTu === undefined) {
                return res.status(400).json({ message: "Thiếu thứ tự!" });
            }

            await HinhAnhDichVu.updateOrder(maHinhAnh, thuTu);
            res.status(200).json({ message: "Cập nhật thứ tự thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật thứ tự:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

};

module.exports = HinhAnhDichVuController;
