const { uploadFile, deleteFile, uploadMultipleFiles, uploadFileByUserId } = require('../services/uploadService');

/**
 * Upload 1 file
 */
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng chọn file để upload' 
            });
        }

        const folder = req.query.folder || 'uploads';

        const fileUrl = await uploadFile(req.file, folder);

        res.status(200).json({
            success: true,
            message: 'Upload file thành công',
            url: fileUrl
        });
    } catch (error) {
        console.error('Lỗi upload:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: error.message
        });
    }
};

/**
 * Upload nhiều file
 */
const uploadMultiple = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng chọn file để upload' 
            });
        }

        const folder = req.query.folder || 'uploads';

            const urls = await uploadMultipleFiles(req.files, folder);

        res.status(200).json({
            success: true,
            message: 'Upload file thành công',
            urls: urls
        });
    } catch (error) {
        console.error('Lỗi upload:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: error.message
        });
    }
};

/**
 * Xóa file
 */
const deleteFileHandler = async (req, res) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp URL file cần xóa'
            });
        }

        await deleteFile(fileUrl);

        res.status(200).json({
            success: true,
            message: 'Xóa file thành công'
        });
    } catch (error) {
        console.error('Lỗi xóa file:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa file',
            error: error.message
        });
    }
};

/**
 * Upload file với tên mã hóa theo userId
 * Tự động replace nếu có oldFileUrl
 * POST /api/upload/by-user?folder=avatars&prefix=avatar
 * Body: file (multipart), userId (string/number), oldFileUrl (optional)
 */
const uploadByUserIdHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'Vui lòng chọn file để upload' 
            });
        }

        const userId = req.body.userId || req.query.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu userId'
            });
        }

        const folder = req.query.folder || 'uploads';
        const prefix = req.query.prefix || 'file';
        const oldFileUrl = req.body.oldFileUrl || req.query.oldFileUrl;

        // Upload file (tự động replace nếu có oldFileUrl)
        const fileUrl = await uploadFileByUserId(req.file, userId, folder, prefix, oldFileUrl);

        res.status(200).json({
            success: true,
            message: oldFileUrl ? 'Thay thế file thành công' : 'Upload file thành công',
            url: fileUrl,
            userId: userId,
            oldUrl: oldFileUrl || null
        });
    } catch (error) {
        console.error('Lỗi upload by userId:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload file',
            error: error.message
        });
    }
};

module.exports = {
    uploadSingleFile,
    uploadMultiple,
    deleteFileHandler,
    uploadByUserIdHandler
};
