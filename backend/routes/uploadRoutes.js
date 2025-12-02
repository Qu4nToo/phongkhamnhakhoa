const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadSingleFile, uploadMultiple, deleteFileHandler, uploadByUserIdHandler } = require('../controllers/uploadController');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ được upload file ảnh (JPEG, PNG, GIF, WEBP)'), false);
        }
    }
});

// Route upload 1 file
// POST /api/upload/single?folder=avatars
router.post('/single', upload.single('file'), uploadSingleFile);

// Route upload nhiều file
// POST /api/upload/multiple?folder=documents
router.post('/multiple', upload.array('files', 10), uploadMultiple); // Tối đa 10 file

// Route xóa file
// DELETE /api/upload
router.delete('/delete', deleteFileHandler);

// Route upload với tên mã hóa theo userId (có auto-replace nếu truyền oldFileUrl)
// POST /api/upload/by-user?folder=avatars&prefix=avatar
// Body: file (multipart), userId (string/number), oldFileUrl (optional)
router.post('/by-user', upload.single('file'), uploadByUserIdHandler);

module.exports = router;
