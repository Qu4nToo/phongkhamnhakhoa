const NguoiDung = require("../models/nguoiDungModel");

const NguoiDungController = {
  getAllNguoiDung: async (req, res) => {
    try {
      const data = await NguoiDung.getAlls();
      res.status(200).json(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  getNguoiDungById: async (req, res) => {
    try {
      const { id } = req.params;
      const nguoiDung = await NguoiDung.getById(id);
      if (!nguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json(nguoiDung);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  createNguoiDung: async (req, res) => {
    try {
      const { HoTen, NgaySinh, SDT, MatKhau, DiaChi, MaChucVu } = req.body;
      if (!HoTen || !NgaySinh || !SDT || !MatKhau || !DiaChi || !MaChucVu) {
        return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
      }

      const phoneRegex = /^(0\d{9})$/;
      if (!phoneRegex.test(SDT)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
      }

      if (MatKhau.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
      }

      const result = await NguoiDung.create({ HoTen, NgaySinh, SDT, MatKhau, DiaChi, MaChucVu });
      return res.status(201).json({ message: "Thêm người dùng thành công!", data: result });
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  updateNguoiDung: async (req, res) => {
    try {
      const { id } = req.params;
      const { HoTen, NgaySinh, SDT, MatKhau, DiaChi, MaChucVu } = req.body;
      if (!HoTen || !NgaySinh || !SDT || !MatKhau || !DiaChi || !MaChucVu) {
         return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
      }

      const phoneRegex = /^(0\d{9})$/;
      if (!phoneRegex.test(SDT)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
      }

      if (MatKhau && MatKhau.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
      }

      const result = await NguoiDung.update(id, { HoTen, NgaySinh, SDT, MatKhau, DiaChi, MaChucVu });
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
      }
      return res.status(200).json({ message: "Cập nhật người dùng thành công!" });
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  deleteNguoiDung: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedNguoiDung = await NguoiDung.delete(id);
      if (!deletedNguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      return res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  }
};

module.exports = NguoiDungController;
