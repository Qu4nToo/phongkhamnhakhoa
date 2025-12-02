const NguoiDung = require("../models/nguoiDungModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  getNguoiDungByEmail: async (req, res) => {
    try {
      const { email } = req.params;
      const nguoiDung = await NguoiDung.getByEmail(email);
      if (!nguoiDung) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      res.status(200).json(nguoiDung);
    } catch (error) {
      console.error("Lỗi khi lấy người dùng:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  loginNguoiDung: async (req, res) => {
    try {
      const { Email, MatKhau } = req.body;
      const nguoiDung = await NguoiDung.getByEmail(Email);
      if (!nguoiDung) {
        return res.status(404).json({ message: "Email hoặc mật khẩu không hợp lệ." });
      }
      const isMatch = await bcrypt.compare(MatKhau, nguoiDung.MatKhau);
      if (!isMatch) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không hợp lệ." });
      }
      if (nguoiDung && isMatch) {
        const token = jwt.sign({ id: nguoiDung.MaNguoiDung, role: nguoiDung.VaiTro }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ nguoiDung, token, message: 'Đăng nhập thành công' });
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  createNguoiDung: async (req, res) => {
    try {
      const { HoTen, Email, NgaySinh, SDT, MatKhau, DiaChi, VaiTro, AnhDaiDien } = req.body;
      console.log("Received data:", { HoTen, Email, NgaySinh, SDT, MatKhau: MatKhau ? "***" : MatKhau, DiaChi, VaiTro, AnhDaiDien });
      if (!HoTen || !Email || !NgaySinh || !SDT || !MatKhau || !DiaChi || !VaiTro) {
        console.log("Missing fields:", { HoTen: !!HoTen, Email: !!Email, NgaySinh: !!NgaySinh, SDT: !!SDT, MatKhau: !!MatKhau, DiaChi: !!DiaChi, VaiTro: !!VaiTro });
        return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
      }

      const phoneRegex = /^(0\d{9})$/;
      if (!phoneRegex.test(SDT)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
      }

      if (MatKhau.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: "Email không hợp lệ!" });
      }
      const existingNguoiDung = await NguoiDung.getByEmail(Email);
      if (existingNguoiDung) {
        return res.status(400).json({ message: "Email đã được sử dụng bởi người dùng khác!" });
      }
      const hashedPassword = await bcrypt.hash(MatKhau, 10);
      const result = await NguoiDung.create({ HoTen, Email, NgaySinh, SDT, MatKhau: hashedPassword, DiaChi, VaiTro, AnhDaiDien: AnhDaiDien || null });
      return res.status(201).json({ message: "Thêm người dùng thành công!", data: result });
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  updateNguoiDung: async (req, res) => {
    try {
      const { id } = req.params;
      const { HoTen, Email, NgaySinh, SDT, MatKhau, DiaChi, VaiTro, AnhDaiDien } = req.body;
      console.log("📥 Received update data:", { id, HoTen, Email, AnhDaiDien });
      
      if (!HoTen || !Email || !NgaySinh || !SDT || !MatKhau || !DiaChi || !VaiTro) {
        return res.status(400).json({ message: "Tất cả các trường đều là bắt buộc!" });
      }

      const phoneRegex = /^(0\d{9})$/;
      if (!phoneRegex.test(SDT)) {
        return res.status(400).json({ message: "Số điện thoại không hợp lệ! Phải gồm 10 chữ số và bắt đầu bằng 0." });
      }

      if (MatKhau && MatKhau.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự!" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ message: "Email không hợp lệ!" });
      }

      const updateData = { HoTen, Email, NgaySinh, SDT, MatKhau, DiaChi, VaiTro };
      if (AnhDaiDien !== undefined) {
        updateData.AnhDaiDien = AnhDaiDien;
        console.log("✅ AnhDaiDien will be updated:", AnhDaiDien);
      } else {
        console.log("⚠️ AnhDaiDien is undefined, will not update");
      }

      console.log("📤 Final update data:", updateData);
      const result = await NguoiDung.update(id, updateData);
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
