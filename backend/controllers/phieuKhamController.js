const PhieuKham = require("../models/phieuKhamModel");

const PhieuKhamController = {
    getAllPhieuKham: async (req, res) => {
        try {
            const data = await PhieuKham.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getById(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamByIdBacSi: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getByBacSiId(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } 
        catch (error) {
            console.error("Lỗi khi lấy phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getPhieuKhamByKhachHangId: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.getByKhachHangId(id);
            if (!result || result.length === 0) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json(result);
        } 
        catch (error) {
            console.error("Lỗi khi lấy phiếu khám theo khách hàng:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createPhieuKham: async (req, res) => {
        try {
            const { MaKhachHang, MaBacSi, NgayKham, MaLichHen } = req.body;

            if (!MaKhachHang || !MaBacSi || !NgayKham || !MaLichHen) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }


            // 1. THÊM BƯỚC KIỂM TRA TỒN TẠI (chỉ kiểm tra theo MaLichHen: mỗi lịch hẹn chỉ 1 phiếu khám)
            const existingPhieuKham = await PhieuKham.findByLichHenID({ MaLichHen });

            if (existingPhieuKham && existingPhieuKham.length > 0) {
                return res.status(409).json({
                    message: "Phiếu khám của lịch hẹn này đã tồn tại!"
                });
            }
            // -----------------------------------

            // 2. Nếu chưa tồn tại, tiến hành tạo mới
            const result = await PhieuKham.create({
                MaKhachHang,
                MaBacSi,
                NgayKham,
                MaLichHen
            });

            // Lấy thông tin chi tiết phiếu khám vừa tạo
            const phieuKhamDetail = await PhieuKham.getById(result.insertId);
            const TenBacSi = phieuKhamDetail?.TenBacSi || 'Bác sĩ';

            // Gửi thông báo qua Socket.IO cho bác sĩ và admin
            const io = req.app.get('io');
            io.emit('phieuKham:created', {
                message: `Phiếu khám mới cho bác sĩ ${TenBacSi} đã được tạo`,
                phieuKham: phieuKhamDetail,
                maBacSi: MaBacSi
            });

            res.status(201).json({ message: "Thêm phiếu khám thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updatePhieuKham: async (req, res) => {
        try {
            const { id } = req.params;
            const { MaKhachHang, MaBacSi, NgayKham, ChuanDoan, GhiChu, TrangThai } = req.body;

            if (!MaKhachHang || !MaBacSi || !NgayKham || !ChuanDoan) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }
            const existingPhieuKham = await PhieuKham.getById(id);
            if (!existingPhieuKham) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            await PhieuKham.update(id, {
                MaKhachHang,
                MaBacSi,
                NgayKham,
                ChuanDoan,
                GhiChu,
                TrangThai
            });

            // Nếu trạng thái là "Đã khám", gửi thông báo qua Socket.IO
            if (TrangThai === "Đã khám") {
                const phieuKhamDetail = await PhieuKham.getById(id);
                const TenBacSi = phieuKhamDetail?.TenBacSi || 'Bác sĩ';
                const io = req.app.get('io');
                io.emit('phieuKham:completed', {
                    message: `Phiếu khám ${id} của bác sĩ ${TenBacSi} đã hoàn thành`,
                    phieuKham: phieuKhamDetail,
                    trangThai: TrangThai
                });
            }

            res.status(200).json({ message: "Cập nhật phiếu khám thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deletePhieuKham: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await PhieuKham.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy phiếu khám!" });
            }
            res.status(200).json({ message: "Xóa phiếu khám thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa phiếu khám:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = PhieuKhamController;
