const DanhGia = require("../models/danhGiaModel");

const DanhGiaController = {
    getAllDanhGia: async (req, res) => {
        try {
            const data = await DanhGia.getAlls();
            res.status(200).json(data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đánh giá:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    getDanhGiaById: async (req, res) => {},
    createDanhGia: async (req, res) => {
        try {
            const { MaKhachHang, NoiDung, Diem, NgayDanhGia } = req.body;

            if (!MaKhachHang || !NoiDung || !Diem || !NgayDanhGia) {
                return res.status(400).json({ message: "Thiếu trường dữ liệu" });
            }

            const result = await DanhGia.create({
                MaKhachHang,
                NoiDung,
                Diem,
                NgayDanhGia
            });

            res.status(201).json({ message: "Thêm đánh giá thành công!", data: result });
        } catch (error) {
            console.error("Lỗi khi thêm đánh giá:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    },

    deleteDanhGia: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await DanhGia.delete(id);
            if (!result) {
                return res.status(404).json({ message: "Không tìm thấy đánh giá!" });
            }
            res.status(200).json({ message: "Xóa đánh giá thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa đánh giá:", error);
            res.status(500).json({ message: "Lỗi server", error: error.message });
        }
    }
};

module.exports = DanhGiaController;
