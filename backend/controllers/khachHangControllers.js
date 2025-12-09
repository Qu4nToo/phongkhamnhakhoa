const KhachHang = require("../models/khachHangModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const KhachHangController = {
    getAllKhachHang: async (req, res) => {
        try {
            const data = await KhachHang.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    getKhachHangById: async (req, res) => {
        try {
            const { id } = req.params;
            const khachHang = await KhachHang.getById(id);
            if (!khachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng" });
            }
            res.status(200).json(khachHang);
        } catch (error) {
            console.error("Lỗi khi lấy khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getKhachHangByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            const khachHang = await KhachHang.getByEmail(email);
            if (!khachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng" });
            }
            res.status(200).json(khachHang);
        } catch (error) {
            console.error("Lỗi khi lấy khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    loginKhachHang: async (req, res) => {
        try {
            const { Email, MatKhau } = req.body;
            const khachHang = await KhachHang.getByEmail(Email);
            if (!khachHang) {
                return res.status(404).json({ message: "Email hoặc mật khẩu không hợp lệ." });
            }
            const isMatch = await bcrypt.compare(MatKhau, khachHang.MatKhau);
            if (!isMatch) {
                return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });
            }
            if (khachHang && isMatch) {
                const payload = {
                    MaKhachHang: khachHang.MaKhachHang,
                    email: khachHang.Email,
                    hoTen: khachHang.HoTen,
                    role: 'Khách hàng',
                    sdt: khachHang.SoDienThoai,
                    ngaySinh: khachHang.NgaySinh,
                    diaChi: khachHang.DiaChi,
                    anhDaiDien: khachHang.AnhDaiDien
                };
                
        // Tạo access token (15 phút)
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
        
        // Tạo refresh token (3 giờ)
        const refreshToken = jwt.sign(
          { ...payload, type: 'refresh' }, 
          process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, 
          { expiresIn: "3h" }
        );                // Trả về cả 2 tokens
                res.status(200).json({ 
                    accessToken,
                    refreshToken,
                    message: 'Đăng nhập thành công' 
                });
            }
        } catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createKhachHang: async (req, res) => {
        try {
            const { HoTen, NgaySinh, SoDienThoai, Email, MatKhau } = req.body;

            if (!HoTen || !NgaySinh || !SoDienThoai || !Email || !MatKhau) {
                return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: "Email không hợp lệ!" });
            }

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
            }

            if (MatKhau.length < 6) {
                return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
            }

            const existingKhachHang = await KhachHang.getByEmail(Email);
            if (existingKhachHang) {

                return res.status(409).json({ message: "Email đã tồn tại. Vui lòng sử dụng Email khác." });
            }
            const hashedPassword = await bcrypt.hash(MatKhau, 10);
            const result = await KhachHang.create({
                HoTen,
                NgaySinh,
                SoDienThoai,
                Email,
                MatKhau: hashedPassword,
            });

            return res.status(201).json({ message: "Thêm khách hàng thành công!", data: result });

        } catch (error) {
            console.error("Lỗi khi thêm khách hàng:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    updateKhachHang: async (req, res) => {
        try {
            const { id } = req.params;
            const { HoTen, NgaySinh, SoDienThoai, Email, DiaChi } = req.body;

            if (!HoTen || !NgaySinh || !SoDienThoai || !Email) {
                return res.status(400).json({ message: "Các trường HoTen, NgaySinh, SoDienThoai, Email là bắt buộc!" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email)) {
                return res.status(400).json({ message: "Email không hợp lệ!" });
            }

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai)) {
                return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
            }

            const updateData = {
                HoTen,
                NgaySinh,
                SoDienThoai,
                Email
            };

            if (DiaChi !== undefined) {
                updateData.DiaChi = DiaChi;
            }

            const result = await KhachHang.update(id, updateData);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng để cập nhật!" });
            }

            return res.status(200).json({ message: "Cập nhật khách hàng thành công!" });

        } catch (error) {
            console.error("Lỗi khi cập nhật khách hàng:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    changePassword: async (req, res) => {
        try {
            const { id } = req.params;
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: "Mật khẩu cũ và mật khẩu mới là bắt buộc!" });
            }

            if (newPassword.length < 6) {
                return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự!" });
            }

            // Lấy thông tin khách hàng hiện tại
            const khachHang = await KhachHang.getById(id);
            if (!khachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng!" });
            }

            // Kiểm tra mật khẩu cũ
            const isMatch = await bcrypt.compare(oldPassword, khachHang.MatKhau);
            if (!isMatch) {
                return res.status(401).json({ message: "Mật khẩu cũ không đúng!" });
            }

            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Cập nhật mật khẩu
            const result = await KhachHang.updatePassword(id, hashedPassword);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không thể cập nhật mật khẩu!" });
            }

            return res.status(200).json({ message: "Đổi mật khẩu thành công!" });

        } catch (error) {
            console.error("Lỗi khi đổi mật khẩu:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateAvatar: async (req, res) => {
        try {
            const { id } = req.params;
            const uploadService = require('../services/uploadService');

            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn ảnh!" });
            }

            // Lấy thông tin khách hàng để xóa ảnh cũ
            const khachHang = await KhachHang.getById(id);
            if (!khachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng!" });
            }

            // Upload ảnh mới lên Firebase với tên file theo mã khách hàng
            // Tự động xóa ảnh cũ nếu có
            const avatarUrl = await uploadService.uploadFileByUserId(
                req.file,
                id,
                'avatars/khachhang',
                'avatar',
                khachHang.AnhDaiDien || null
            );

            // Cập nhật URL ảnh mới vào database
            const result = await KhachHang.update(id, { AnhDaiDien: avatarUrl });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không thể cập nhật avatar!" });
            }

            return res.status(200).json({ 
                message: "Cập nhật avatar thành công!",
                avatarUrl: avatarUrl
            });

        } catch (error) {
            console.error("Lỗi khi cập nhật avatar:", error);
            return res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },
    deleteKhachHang: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedKhachHang = await KhachHang.delete(id);
            if (!deletedKhachHang) {
                return res.status(404).json({ message: "Không tìm thấy khách hàng" });
            }
            return res.status(200).json({ message: "Xóa khách hàng thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = KhachHangController;