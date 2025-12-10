const DichVu = require("../models/dichVuModel");

// Hàm tạo slug
const createSlug = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const DichVuController = {
    getAllDichVu: async (req, res) => {
        try {
            const data = await DichVu.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getDichVuById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await DichVu.getById(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }
            res.status(200).json(result);
        } catch (error) {
            console.error("Lỗi khi lấy dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getDichVuByMaLoaiDV: async (req, res) => {
        try {
            const { maloaidv } = req.params;
            
            // Lấy danh sách dịch vụ theo MaLoaiDV
            const dichVuList = await DichVu.getByLoaiDichVu(maloaidv);
            res.status(200).json(dichVuList);
        } catch (error) {
            console.error("Lỗi khi lấy dịch vụ theo mã loại:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getDichVuBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            
            // Lấy chi tiết dịch vụ theo slug
            const dichVu = await DichVu.getBySlug(slug);
            if (!dichVu) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }
            res.status(200).json(dichVu);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết dịch vụ theo slug:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    createDichVu: async (req, res) => {
        try {
            const { TenDichVu, Gia, MoTa, DonVi, MaLoaiDV, ThoiLuong, TrangThai } = req.body;

            if (!TenDichVu || !Gia || !MoTa || !DonVi || !MaLoaiDV || !ThoiLuong) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            // Tạo slug từ tên dịch vụ
            const Slug = createSlug(TenDichVu);

            const result = await DichVu.create({ 
                TenDichVu, 
                Slug, 
                Gia, 
                MoTa, 
                DonVi, 
                MaLoaiDV, 
                ThoiLuong,
                TrangThai: TrangThai || 'Đang hoạt động'
            });
            res.status(201).json({ message: "Thêm dịch vụ thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    updateDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const { TenDichVu, Gia, MoTa, DonVi, MaLoaiDV, ThoiLuong, TrangThai } = req.body;

            if (!TenDichVu || !Gia || !MoTa || !DonVi || !MaLoaiDV || !ThoiLuong) {
                return res.status(400).json({ message: "Các trường TenDichVu, Gia, MoTa, DonVi, MaLoaiDV, ThoiLuong là bắt buộc!" });
            }

            // Tạo slug mới từ tên dịch vụ
            const Slug = createSlug(TenDichVu);

            const result = await DichVu.update(id, { 
                TenDichVu, 
                Slug, 
                Gia, 
                MoTa, 
                DonVi, 
                MaLoaiDV, 
                ThoiLuong,
                TrangThai: TrangThai || 'Đang hoạt động'
            });

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ để cập nhật!" });
            }

            res.status(200).json({ message: "Cập nhật dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await DichVu.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy dịch vụ!" });
            }
            res.status(200).json({ message: "Xóa dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = DichVuController;
