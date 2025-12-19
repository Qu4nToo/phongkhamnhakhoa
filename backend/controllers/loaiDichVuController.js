const LoaiDichVu = require("../models/loaiDichVuModel");

// Hàm tạo slug từ tiếng Việt có dấu
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

const LoaiDichVuController = {
    // ✅ Lấy tất cả loại dịch vụ
    getAllLoaiDichVu: async (req, res) => {
        try {
            const data = await LoaiDichVu.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Lấy loại dịch vụ theo ID
    getLoaiDichVuById: async (req, res) => {
        try {
            const { id } = req.params;
            const loaiDichVu = await LoaiDichVu.getById(id);
            if (!loaiDichVu) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ!" });
            }
            res.status(200).json(loaiDichVu);
        } catch (error) {
            console.error("Lỗi khi lấy loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Lấy loại dịch vụ theo Slug
    getLoaiDichVuBySlug: async (req, res) => {
        try {
            const { slug } = req.params;
            const loaiDichVu = await LoaiDichVu.getBySlug(slug);
            if (!loaiDichVu) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ!" });
            }
            res.status(200).json(loaiDichVu);
        } catch (error) {
            console.error("Lỗi khi lấy loại dịch vụ theo slug:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Thêm loại dịch vụ mới
    createLoaiDichVu: async (req, res) => {
        try {
            const { TenLoaiDV, MoTa } = req.body;

            if (!TenLoaiDV || TenLoaiDV.trim() === "") {
                return res.status(400).json({ message: "Tên loại dịch vụ là bắt buộc!" });
            }
            const existingLoaiDichVu = await LoaiDichVu.getByName(TenLoaiDV);
            if (existingLoaiDichVu && existingLoaiDichVu.length > 0) {
                return res.status(409).json({ message: "Loại dịch vụ với tên này đã tồn tại!" });
            }

            // Tạo slug từ tên loại dịch vụ
            const slug = createSlug(TenLoaiDV);

            const result = await LoaiDichVu.create({
                TenLoaiDV,
                Slug: slug,
                MoTa: MoTa || null
            });

            res.status(201).json({
                message: "Thêm loại dịch vụ thành công!",
                data: result
            });
        } catch (error) {
            console.error("Lỗi khi thêm loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Cập nhật loại dịch vụ
    updateLoaiDichVu: async (req, res) => {
        try {
            const { id } = req.params;
            const { TenLoaiDV, MoTa } = req.body;

            if (!TenLoaiDV || TenLoaiDV.trim() === "") {
                return res.status(400).json({ message: "Tên loại dịch vụ là bắt buộc!" });
            }

            const loaiDichVu = await LoaiDichVu.getById(id);
            if (!loaiDichVu) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ!" });
            }

            const existingLoaiDichVu = await LoaiDichVu.getByName(TenLoaiDV);
            if (existingLoaiDichVu && existingLoaiDichVu.length > 0) {
                return res.status(409).json({ message: "Loại dịch vụ với tên này đã tồn tại!" });
            }

            // Tạo slug mới từ tên loại dịch vụ
            const slug = createSlug(TenLoaiDV);

            const result = await LoaiDichVu.update(id, {
                TenLoaiDV,
                Slug: slug,
                MoTa: MoTa || null
            });

            res.status(200).json({ message: "Cập nhật loại dịch vụ thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi cập nhật loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    // ✅ Xóa loại dịch vụ
    deleteLoaiDichVu: async (req, res) => {
        try {
            const { id } = req.params;

            const loaiDichVu = await LoaiDichVu.getById(id);
            if (!loaiDichVu) {
                return res.status(404).json({ message: "Không tìm thấy loại dịch vụ!" });
            }

            await LoaiDichVu.delete(id);
            res.status(200).json({ message: "Xóa loại dịch vụ thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa loại dịch vụ:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = LoaiDichVuController;
