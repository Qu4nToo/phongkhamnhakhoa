const { bucket } = require('../config/firebase');
const path = require('path');
const crypto = require('crypto');

/**
 * Upload file lên Firebase Storage
 * @param {Object} file - File object từ multer
 * @param {String} folder - Thư mục lưu trữ (vd: 'avatars', 'documents')
 * @returns {Promise<String>} URL của file đã upload
 */
const uploadFile = async (file, folder = 'uploads') => {
    try {
        if (!file) {
            throw new Error('Không có file để upload');
        }

        const fileName = `${folder}/${timestamp}_${file.originalname}`;

        // Tạo file reference trong bucket
        const fileUpload = bucket.file(fileName);

        // Upload file
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
            },
            public: true, // Cho phép truy cập public
        });

        // Lấy public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        
        return publicUrl;
    } catch (error) {
        console.error('Lỗi upload file:', error);
        throw error;
    }
};

/**
 * Xóa file từ Firebase Storage
 * @param {String} fileUrl - URL của file cần xóa
 */
const deleteFile = async (fileUrl) => {
    try {
        if (!fileUrl) {
            console.log('⚠️ Không có URL để xóa');
            return;
        }

        // Trim khoảng trắng
        const cleanUrl = fileUrl.trim();
        console.log('🗑️ Đang xóa file:', cleanUrl);

        // Lấy file path từ URL
        const baseUrl = `https://storage.googleapis.com/${bucket.name}/`;
        const filePath = cleanUrl.replace(baseUrl, '');
        
        console.log('📁 File path:', filePath);
        console.log('🪣 Bucket name:', bucket.name);

        // Xóa file
        await bucket.file(filePath).delete();
        
        console.log('✅ Đã xóa file thành công:', filePath);
    } catch (error) {
        console.error('❌ Lỗi xóa file:', error.message);
        console.error('Full error:', error);
        throw error;
    }
};

/**
 * Upload nhiều file cùng lúc
 * @param {Array} files - Array các file object từ multer
 * @param {String} folder - Thư mục lưu trữ
 * @returns {Promise<Array<String>>} Array các URL đã upload
 */
const uploadMultipleFiles = async (files, folder = 'uploads') => {
    try {
        if (!files || files.length === 0) {
            throw new Error('Không có file để upload');
        }

        const uploadPromises = files.map(file => uploadFile(file, folder));
        const urls = await Promise.all(uploadPromises);
        
        return urls;
    } catch (error) {
        console.error('Lỗi upload nhiều file:', error);
        throw error;
    }
};

/**
 * Tạo tên file theo userId
 * @param {String|Number} userId - ID của user (đã mã hóa sẵn)
 * @param {String} fileExtension - Phần mở rộng của file (vd: 'jpg', 'png')
 * @param {String} prefix - Tiền tố (vd: 'avatar', 'doc')
 * @returns {String} Tên file
 */
const generateFileNameByUserId = (userId, fileExtension, prefix = 'file') => {
    return `${prefix}_${userId}.${fileExtension}`;
};

/**
 * Upload file với tên được mã hóa theo userId
 * Tự động replace nếu đã có file cũ theo pattern prefix_userId_*
 * @param {Object} file - File object từ multer
 * @param {String|Number} userId - ID của user
 * @param {String} folder - Thư mục lưu trữ
 * @param {String} prefix - Tiền tố cho tên file (vd: 'avatar', 'document')
 * @param {String} oldFileUrl - URL file cũ (optional, nếu có sẽ xóa trước)
 * @returns {Promise<String>} URL của file đã upload
 */
const uploadFileByUserId = async (file, userId, folder = 'uploads', prefix = 'file', oldFileUrl = null) => {
    try {
        if (!file) {
            throw new Error('Không có file để upload');
        }

        if (!userId) {
            throw new Error('Thiếu userId');
        }

        // Nếu có oldFileUrl, xóa file cũ trước
        if (oldFileUrl) {
            try {
                await deleteFile(oldFileUrl);
                console.log('Đã xóa file cũ:', oldFileUrl);
            } catch (error) {
                console.warn('Không thể xóa file cũ:', error.message);
            }
        }

        // Lấy extension của file
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        
        // Tạo tên file mã hóa
        const fileName = generateFileNameByUserId(userId, fileExtension, prefix);
        const filePath = `${folder}/${fileName}`;

        // Upload file
        const fileUpload = bucket.file(filePath);
        await fileUpload.save(file.buffer, {
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    userId: userId.toString(),
                    originalName: file.originalname,
                    uploadDate: new Date().toISOString()
                }
            },
            public: true,
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
        console.log('Đã upload file cho user', userId, ':', fileName);
        
        return publicUrl;
    } catch (error) {
        console.error('Lỗi upload file by userId:', error);
        throw error;
    }
};

module.exports = {
    uploadFile,
    deleteFile,
    uploadMultipleFiles,
    uploadFileByUserId
};
