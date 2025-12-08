const BacSi = require("../models/bacSiModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const BacSiController = {
    getAllBacSi: async (req, res) => {
        try {
            const data = await BacSi.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getBacSiById: async (req, res) => {
        try {
            const { id } = req.params;
            const bacSi = await BacSi.getById(id);
            if (!bacSi) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            res.status(200).json(bacSi);
        } catch (error) {
            console.error("Lỗi khi lấy bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getBacSiByEmail: async (req, res) => {
        try {
            const { email } = req.params;
            const bacSi = await BacSi.getByEmail(email);
            if (!bacSi) {
                return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            }
            res.status(200).json(bacSi);
        } catch (error) {
            console.error("Lỗi khi lấy bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    loginBacSi: async (req, res) => {
        try {
            const { Email, MatKhau } = req.body;
            const bacSi = await BacSi.getByEmail(Email);
            if (!bacSi) {
                return res.status(404).json({ message: "Email hoặc mật khẩu không hợp lệ." });
            }
            const isMatch = await bcrypt.compare(MatKhau, bacSi.MatKhau);
            if (!isMatch) {
                return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });
            }
            if (bacSi && isMatch) {
                const payload = {
                    MaBacSi: bacSi.MaBacSi,
                    email: bacSi.Email,
                    hoTen: bacSi.HoTen,
                    role: 'Bác sĩ',
                    sdt: bacSi.SoDienThoai,
                    kinhNghiem: bacSi.KinhNghiem,
                    diaChi: bacSi.DiaChi,
                    ngaySinh: bacSi.NgaySinh,
                    chuyenKhoa: bacSi.ChuyenKhoa,
                    bangCap: bacSi.BangCap,
                    chuyenMon: bacSi.ChuyenMon
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

   createBacSi: async (req, res) => {
        try {
            const { HoTen, SoDienThoai, Email, MatKhau, KinhNghiem, NgaySinh, DiaChi, AnhDaiDien, ChuyenKhoa, BangCap, ChuyenMon } = req.body;
            if (!HoTen || !SoDienThoai || !Email || !MatKhau || !KinhNghiem || !NgaySinh || !DiaChi || !ChuyenKhoa || !BangCap || !ChuyenMon)
                return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(Email))
                return res.status(400).json({ message: "Email không hợp lệ!" });

            const phoneRegex = /^(0\d{9})$/;
            if (!phoneRegex.test(SoDienThoai))
                return res.status(400).json({ message: "Số điện thoại không hợp lệ!" });
            if (MatKhau.length < 6) {
                return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
            }
            const existingBacSi = await BacSi.getByEmail(Email);
            if (existingBacSi) {
                return res.status(400).json({ message: "Email đã được sử dụng bởi bác sĩ khác!" });
            }
            const hashedPassword = await bcrypt.hash(MatKhau, 10);
            
            const createData = { 
                HoTen, 
                SoDienThoai, 
                Email, 
                MatKhau: hashedPassword, 
                KinhNghiem, 
                NgaySinh, 
                DiaChi,
                ChuyenKhoa,
                BangCap,
                ChuyenMon
            };
            
            // Thêm AnhDaiDien nếu có
            if (AnhDaiDien) {
                createData.AnhDaiDien = AnhDaiDien;
            }
            
            const result = await BacSi.create(createData);
            
            // Lấy MaBacSi vừa tạo
            const newBacSi = await BacSi.getByEmail(Email);
            
            res.status(201).json({ 
                message: "Thêm bác sĩ thành công!", 
                data: result,
                MaBacSi: newBacSi.MaBacSi 
            });
        } catch (error) {
            console.error("Lỗi khi thêm bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const { HoTen, SoDienThoai, Email, KinhNghiem, NgaySinh, DiaChi, AnhDaiDien, ChuyenKhoa, BangCap, ChuyenMon } = req.body;

            if (!HoTen || !SoDienThoai || !Email || !KinhNghiem || !NgaySinh || !DiaChi || !ChuyenKhoa || !BangCap || !ChuyenMon)
                return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });

            const updateData = { HoTen, SoDienThoai, Email, KinhNghiem, NgaySinh, DiaChi, ChuyenKhoa, BangCap, ChuyenMon };
            
            // Thêm AnhDaiDien nếu có
            if (AnhDaiDien !== undefined) {
                updateData.AnhDaiDien = AnhDaiDien;
            }
            console.log("📤 Final update data:", updateData);
            const result = await BacSi.update(id, updateData);
            if (result.affectedRows === 0)
                return res.status(404).json({ message: "Không tìm thấy bác sĩ để cập nhật!" });

            res.status(200).json({ message: "Cập nhật bác sĩ thành công!", data: updateData });
        } catch (error) {
            console.error("Lỗi khi cập nhật bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await BacSi.delete(id);
            if (!result) return res.status(404).json({ message: "Không tìm thấy bác sĩ" });
            res.status(200).json({ message: "Xóa bác sĩ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Lấy danh sách bác sĩ có thể làm dịch vụ
    getBacSiByDichVu: async (req, res) => {
        try {
            const { dichVuId } = req.params;
            if (!dichVuId) {
                return res.status(400).json({ message: "Thiếu mã dịch vụ" });
            }
            const bacSiList = await BacSi.getByDichVu(dichVuId);
            res.status(200).json(bacSiList);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bác sĩ theo dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Thống kê cho bác sĩ
    getDoctorStats: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const stats = await BacSi.getDoctorStats(doctorId);
            res.status(200).json(stats);
        } catch (error) {
            console.error("Lỗi khi lấy thống kê bác sĩ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Lịch hẹn hôm nay
    getTodayAppointments: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const appointments = await BacSi.getTodayAppointments(doctorId);
            res.status(200).json(appointments);
        } catch (error) {
            console.error("Lỗi khi lấy lịch hẹn hôm nay:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Lịch hẹn sắp tới
    getUpcomingAppointments: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const appointments = await BacSi.getUpcomingAppointments(doctorId);
            res.status(200).json(appointments);
        } catch (error) {
            console.error("Lỗi khi lấy lịch hẹn sắp tới:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Thống kê theo trạng thái
    getAppointmentsByStatus: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const stats = await BacSi.getAppointmentsByStatus(doctorId);
            res.status(200).json(stats);
        } catch (error) {
            console.error("Lỗi khi lấy thống kê trạng thái:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // Biểu đồ lịch hẹn
    getAppointmentsChart: async (req, res) => {
        try {
            const { doctorId } = req.params;
            const chartData = await BacSi.getAppointmentsChart(doctorId);
            res.status(200).json(chartData);
        } catch (error) {
            console.error("Lỗi khi lấy biểu đồ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = BacSiController;
