-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th1 17, 2026 lúc 10:58 AM
-- Phiên bản máy phục vụ: 8.2.0
-- Phiên bản PHP: 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `phongkhamnhakhoa`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bacsi`
--

DROP TABLE IF EXISTS `bacsi`;
CREATE TABLE IF NOT EXISTS `bacsi` (
  `MaBacSi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT (uuid()),
  `AnhDaiDien` varchar(500) DEFAULT NULL,
  `HoTen` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ChuyenKhoa` varchar(30) NOT NULL,
  `BangCap` varchar(50) NOT NULL,
  `ChuyenMon` varchar(50) NOT NULL,
  `SoDienThoai` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MatKhau` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `KinhNghiem` int NOT NULL,
  `NgaySinh` date NOT NULL,
  `DiaChi` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `VaiTro` enum('Khách hàng','Bác sĩ','Lễ tân','Quản lý') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Bác sĩ',
  PRIMARY KEY (`MaBacSi`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `bacsi`
--

INSERT INTO `bacsi` (`MaBacSi`, `AnhDaiDien`, `HoTen`, `ChuyenKhoa`, `BangCap`, `ChuyenMon`, `SoDienThoai`, `Email`, `MatKhau`, `KinhNghiem`, `NgaySinh`, `DiaChi`, `VaiTro`) VALUES
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/bacsi/avatar_1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d.jpg', 'Nguyễn Văn A', 'Nha khoa tổng quát', 'Đại học Y Hà Nội', 'Chỉnh nha, Cấy ghép Implant', '0901234567', 'nguyenvana@clinic.com', '$2b$10$1Y37EpoSoo9kY43DBbxcIe/FX97qbugVPJhv6UHHyGdlujMZOrUsu', 13, '1985-05-15', '10 Phan Chu Trinh, Q.1, TP.HCM', 'Bác sĩ'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/bacsi/avatar_2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e.jpg', 'Trần Thị B', 'Nha chu', 'Đại học Y Dược TP.HCM', 'Điều trị nha chu, Phục hồi răng', '0912345678', 'tranthib@clinic.com', 'b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8', 7, '1990-11-20', '25 Hùng Vương, Q.5, TP.HCM', 'Bác sĩ'),
('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/bacsi/avatar_3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f.jpg', 'Lê Văn C', 'Phẫu thuật hàm mặt', 'Đại học Y Hà Nội', 'Phẫu thuật chỉnh hình, Cắt u', '0923456789', 'levanc@clinic.com', 'c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', 15, '1978-01-25', '30 Nguyễn Thị Minh Khai, Q.3, TP.HCM', 'Bác sĩ'),
('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g', NULL, 'Phạm Thu D', 'Nha khoa thẩm mỹ', 'Đại học Y Dược Cần Thơ', 'Tẩy trắng răng, Veneer', '0934567890', 'phamd@clinic.com', 'd5e6f7a8b9c0d1e2f3a4b5c6d7e8f9g0', 5, '1995-08-01', '45 Hai Bà Trưng, Q.1, TP.HCM', 'Bác sĩ'),
('1f34c02f-dc55-11f0-8714-0250d18a7895', NULL, 'Nguyễn Quân', 'Nha khoa tổng quát', 'Đại học Y Hà Nội', 'Chỉnh nha, Cấy ghép Implant', '0911341117', 'quantoo@clinic.com', '$2b$10$DyoT9xeZFmyAXQ9wuJIhG.6YNt4gQdPE2zDLAfQJJY3sKX4jbWBna', 20, '2000-10-31', '10 Phan Chu Trinh, Q.1, TP.HCM', 'Bác sĩ'),
('9a6ea003-f384-11f0-820f-0250d18a7895', NULL, 'BS. Lê Thị Hương', '', '', 'Nha khoa thẩm mỹ, Tẩy trắng răng', '0903333333', 'bs.huong.demo@phongkham.vn', '$2b$10$dummypasswordhash1234567890123456789012', 10, '1985-11-08', '', 'Bác sĩ'),
('9a6c3583-f384-11f0-820f-0250d18a7895', NULL, 'BS. Trần Văn Minh', '', '', 'Phẫu thuật, Cấy ghép Implant', '0902222222', 'bs.minh.demo@phongkham.vn', '$2b$10$dummypasswordhash1234567890123456789012', 20, '1975-07-22', '', 'Bác sĩ'),
('9a68875c-f384-11f0-820f-0250d18a7895', NULL, 'BS. Nguyễn Thị Kim Ngân', '', '', 'Chỉnh nha, Niềng răng thẩm mỹ', '0901111111', 'bs.ngan.demo@phongkham.vn', '$2b$10$dummypasswordhash1234567890123456789012', 15, '1980-03-15', '', 'Bác sĩ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietdichvu`
--

DROP TABLE IF EXISTS `chitietdichvu`;
CREATE TABLE IF NOT EXISTS `chitietdichvu` (
  `MaBSDV` varchar(36) NOT NULL DEFAULT (uuid()),
  `MaBacSi` varchar(36) NOT NULL,
  `MaDichVu` varchar(36) NOT NULL,
  PRIMARY KEY (`MaBSDV`),
  KEY `MaBacSi` (`MaBacSi`),
  KEY `MaDichVu` (`MaDichVu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietdichvu`
--

INSERT INTO `chitietdichvu` (`MaBSDV`, `MaBacSi`, `MaDichVu`) VALUES
('d0cc6c9a-f382-11f0-820f-0250d18a7895', 'd09ea0ac-f382-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d0cc70d7-f382-11f0-820f-0250d18a7895', 'd09ea0ac-f382-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('d0cc716b-f382-11f0-820f-0250d18a7895', 'd09ea0ac-f382-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('d0cc71cf-f382-11f0-820f-0250d18a7895', 'd09ea0ac-f382-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('d0cc722a-f382-11f0-820f-0250d18a7895', 'd0a1264d-f382-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d0cc7283-f382-11f0-820f-0250d18a7895', 'd0a1264d-f382-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('d0cc7309-f382-11f0-820f-0250d18a7895', 'd0a1264d-f382-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('d0cc73b8-f382-11f0-820f-0250d18a7895', 'd0a1264d-f382-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('d0cc7482-f382-11f0-820f-0250d18a7895', 'd0a1264d-f382-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('d0cc74eb-f382-11f0-820f-0250d18a7895', 'd0a41442-f382-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d0cc754a-f382-11f0-820f-0250d18a7895', 'd0a41442-f382-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('d0cc75b8-f382-11f0-820f-0250d18a7895', 'd0a41442-f382-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('d0cc761d-f382-11f0-820f-0250d18a7895', 'd0a41442-f382-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('d0cc76c0-f382-11f0-820f-0250d18a7895', 'd0a41442-f382-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('3c77d599-f383-11f0-820f-0250d18a7895', '3c4dc5be-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('3c77d768-f383-11f0-820f-0250d18a7895', '3c4dc5be-f383-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('3c77d7fd-f383-11f0-820f-0250d18a7895', '3c4dc5be-f383-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('3c77d862-f383-11f0-820f-0250d18a7895', '3c4dc5be-f383-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('3c77d8ca-f383-11f0-820f-0250d18a7895', '3c50b06e-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('3c77d926-f383-11f0-820f-0250d18a7895', '3c50b06e-f383-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('3c77d98b-f383-11f0-820f-0250d18a7895', '3c50b06e-f383-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('3c77d9eb-f383-11f0-820f-0250d18a7895', '3c50b06e-f383-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('3c77da55-f383-11f0-820f-0250d18a7895', '3c50b06e-f383-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('3c77dabd-f383-11f0-820f-0250d18a7895', '3c533f2c-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('3c77dcec-f383-11f0-820f-0250d18a7895', '3c533f2c-f383-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('3c77dd93-f383-11f0-820f-0250d18a7895', '3c533f2c-f383-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('3c77de01-f383-11f0-820f-0250d18a7895', '3c533f2c-f383-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('3c77de70-f383-11f0-820f-0250d18a7895', '3c533f2c-f383-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('9c485574-f383-11f0-820f-0250d18a7895', '9c1e9f89-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('9c485712-f383-11f0-820f-0250d18a7895', '9c1e9f89-f383-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('9c4857b3-f383-11f0-820f-0250d18a7895', '9c1e9f89-f383-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('9c485829-f383-11f0-820f-0250d18a7895', '9c1e9f89-f383-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('9c48589a-f383-11f0-820f-0250d18a7895', '9c217088-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('9c485903-f383-11f0-820f-0250d18a7895', '9c217088-f383-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('9c485975-f383-11f0-820f-0250d18a7895', '9c217088-f383-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('9c4859e3-f383-11f0-820f-0250d18a7895', '9c217088-f383-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('9c485a57-f383-11f0-820f-0250d18a7895', '9c217088-f383-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('9c485acb-f383-11f0-820f-0250d18a7895', '9c24e16f-f383-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('9c485b42-f383-11f0-820f-0250d18a7895', '9c24e16f-f383-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('9c485bbb-f383-11f0-820f-0250d18a7895', '9c24e16f-f383-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('9c485c30-f383-11f0-820f-0250d18a7895', '9c24e16f-f383-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('9c485cac-f383-11f0-820f-0250d18a7895', '9c24e16f-f383-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('5338209e-f384-11f0-820f-0250d18a7895', '530a41a8-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('5338225b-f384-11f0-820f-0250d18a7895', '530a41a8-f384-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('53382346-f384-11f0-820f-0250d18a7895', '530a41a8-f384-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('533823c6-f384-11f0-820f-0250d18a7895', '530a41a8-f384-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('53382443-f384-11f0-820f-0250d18a7895', '530d6671-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('533824b6-f384-11f0-820f-0250d18a7895', '530d6671-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('53382530-f384-11f0-820f-0250d18a7895', '530d6671-f384-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('533825aa-f384-11f0-820f-0250d18a7895', '530d6671-f384-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('5338265d-f384-11f0-820f-0250d18a7895', '530d6671-f384-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('5338276c-f384-11f0-820f-0250d18a7895', '53108a03-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('5338284f-f384-11f0-820f-0250d18a7895', '53108a03-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('5338292c-f384-11f0-820f-0250d18a7895', '53108a03-f384-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('53382a1a-f384-11f0-820f-0250d18a7895', '53108a03-f384-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('53382c01-f384-11f0-820f-0250d18a7895', '53108a03-f384-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('81bb523d-f386-11f0-820f-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('81bb510c-f386-11f0-820f-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', ''),
('81bb501d-f386-11f0-820f-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('81bb4c32-f386-11f0-820f-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81bb4f17-f386-11f0-820f-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('01b70c6e-f385-11f0-820f-0250d18a7895', '0195e565-f385-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('01b70e3a-f385-11f0-820f-0250d18a7895', '0195e565-f385-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('01b70ec2-f385-11f0-820f-0250d18a7895', '0195e565-f385-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('01b70f36-f385-11f0-820f-0250d18a7895', '0195e565-f385-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('01b70fab-f385-11f0-820f-0250d18a7895', '0198c17a-f385-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('01b71017-f385-11f0-820f-0250d18a7895', '0198c17a-f385-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('01b71086-f385-11f0-820f-0250d18a7895', '0198c17a-f385-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('01b710f1-f385-11f0-820f-0250d18a7895', '0198c17a-f385-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('01b71168-f385-11f0-820f-0250d18a7895', '0198c17a-f385-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('01b711dc-f385-11f0-820f-0250d18a7895', '019c3453-f385-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('01b7124f-f385-11f0-820f-0250d18a7895', '019c3453-f385-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('01b712c5-f385-11f0-820f-0250d18a7895', '019c3453-f385-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('01b71339-f385-11f0-820f-0250d18a7895', '019c3453-f385-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('01b713b9-f385-11f0-820f-0250d18a7895', '019c3453-f385-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('81d8ae83-f386-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', ''),
('81d8af0b-f386-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('81bf63ce-f386-11f0-820f-0250d18a7895', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81bf65df-f386-11f0-820f-0250d18a7895', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', ''),
('81bf6722-f386-11f0-820f-0250d18a7895', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('81bf6839-f386-11f0-820f-0250d18a7895', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13'),
('81c37a60-f386-11f0-820f-0250d18a7895', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81c37d0c-f386-11f0-820f-0250d18a7895', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13'),
('81c37e3d-f386-11f0-820f-0250d18a7895', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('81c7783b-f386-11f0-820f-0250d18a7895', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81c77b09-f386-11f0-820f-0250d18a7895', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g', 'r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18'),
('81c77c3c-f386-11f0-820f-0250d18a7895', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g', ''),
('81cc05ec-f386-11f0-820f-0250d18a7895', '1f34c02f-dc55-11f0-8714-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81cc088e-f386-11f0-820f-0250d18a7895', '1f34c02f-dc55-11f0-8714-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('81cc09bd-f386-11f0-820f-0250d18a7895', '1f34c02f-dc55-11f0-8714-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('81cc0ae8-f386-11f0-820f-0250d18a7895', '1f34c02f-dc55-11f0-8714-0250d18a7895', ''),
('81cc0c07-f386-11f0-820f-0250d18a7895', '1f34c02f-dc55-11f0-8714-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('81d03e8d-f386-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81d04116-f386-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('81d04242-f386-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', ''),
('81d0436e-f386-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('81d4689e-f386-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81d46b9b-f386-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13'),
('81d46d13-f386-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', 'r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18'),
('81d46e86-f386-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('81d4707e-f386-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('81d8aaf3-f386-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('81d8ad2c-f386-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13'),
('81d8adf6-f386-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', 'r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitietphieukham`
--

DROP TABLE IF EXISTS `chitietphieukham`;
CREATE TABLE IF NOT EXISTS `chitietphieukham` (
  `MaCTPK` varchar(36) NOT NULL DEFAULT (uuid()),
  `ThanhTien` decimal(12,2) NOT NULL,
  `SoLuong` int NOT NULL,
  `MaPhieuKham` varchar(36) NOT NULL,
  `MaDichVu` varchar(36) NOT NULL,
  PRIMARY KEY (`MaCTPK`),
  KEY `MaPhieuKham` (`MaPhieuKham`),
  KEY `MaDichVu` (`MaDichVu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `chitietphieukham`
--

INSERT INTO `chitietphieukham` (`MaCTPK`, `ThanhTien`, `SoLuong`, `MaPhieuKham`, `MaDichVu`) VALUES
('d6107504-f384-11f0-820f-0250d18a7895', 500000.00, 1, 'd5f9d823-f384-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('d61074ae-f384-11f0-820f-0250d18a7895', 700000.00, 1, 'd5f71a73-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('d610745b-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5f71a73-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d6107405-f384-11f0-820f-0250d18a7895', 150000.00, 1, 'd5f2a292-f384-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31'),
('d61073b0-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5f2a292-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d6107353-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5f00fdd-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d61072ce-f384-11f0-820f-0250d18a7895', 250000.00, 1, 'd5ed20d5-f384-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('d6106ea5-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5ed20d5-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4aacf81-f387-11f0-820f-0250d18a7895', 500000.00, 1, '5357fd37-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('8fa5268e-e9e0-11f0-8bc3-0250d18a7895', 1500000.00, 1, '7647150a-e9e0-11f0-8bc3-0250d18a7895', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14'),
('8fa47875-e9e0-11f0-8bc3-0250d18a7895', 40000000.00, 1, '7647150a-e9e0-11f0-8bc3-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('d610755d-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5fcb6f8-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d6107620-f384-11f0-820f-0250d18a7895', 1100000.00, 1, 'd5fcb6f8-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d610767f-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd5ff60d6-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d61076d2-f384-11f0-820f-0250d18a7895', 100000.00, 1, 'd6022458-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('d6107727-f384-11f0-820f-0250d18a7895', 2400000.00, 1, 'd6022458-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4aad110-f387-11f0-820f-0250d18a7895', 300000.00, 1, '5357fd37-f384-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('f4aed810-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9abddd2f-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4aed96c-f387-11f0-820f-0250d18a7895', 1500000.00, 1, '9abddd2f-f384-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32'),
('f4b29da8-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9abb1b0b-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4b29ef8-f387-11f0-820f-0250d18a7895', 800000.00, 1, '9abb1b0b-f384-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12'),
('f4b69065-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9ab8689a-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4b691c9-f387-11f0-820f-0250d18a7895', 1200000.00, 1, '9ab8689a-f384-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28'),
('f4ba6b1e-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9ab5730f-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4ba6d30-f387-11f0-820f-0250d18a7895', 400000.00, 1, '9ab5730f-f384-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30'),
('f4be2e93-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9ab2d501-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4c21339-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9aaea529-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4c214f5-f387-11f0-820f-0250d18a7895', 300000.00, 1, '9aaea529-f384-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29'),
('f4c5b201-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9ac1ab0a-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4c99525-f387-11f0-820f-0250d18a7895', 500000.00, 1, '9ac41eef-f384-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4c99697-f387-11f0-820f-0250d18a7895', 2000000.00, 1, '9ac41eef-f384-11f0-820f-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20'),
('f4cd8a03-f387-11f0-820f-0250d18a7895', 500000.00, 1, 'fff6bb8b-f14f-11f0-a030-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27'),
('f4cd8b83-f387-11f0-820f-0250d18a7895', 200000.00, 1, 'fff6bb8b-f14f-11f0-a030-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `dichvu`
--

DROP TABLE IF EXISTS `dichvu`;
CREATE TABLE IF NOT EXISTS `dichvu` (
  `MaDichVu` varchar(36) NOT NULL DEFAULT (uuid()),
  `TenDichVu` varchar(100) NOT NULL,
  `Slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Gia` decimal(12,2) NOT NULL,
  `MoTa` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ThoiLuong` int NOT NULL DEFAULT '30' COMMENT 'Thời lượng dịch vụ tính bằng phút',
  `DonVi` enum('Chiếc','Gói') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `TrangThai` enum('Đang hoạt động','Dừng hoạt động') NOT NULL DEFAULT 'Đang hoạt động',
  `MaLoaiDV` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MaDichVu`),
  KEY `MaLoaiDV` (`MaLoaiDV`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `dichvu`
--

INSERT INTO `dichvu` (`MaDichVu`, `TenDichVu`, `Slug`, `Gia`, `MoTa`, `ThoiLuong`, `DonVi`, `TrangThai`, `MaLoaiDV`) VALUES
('q16ebc99-9c0b-4ef9-bb6d-6bb9bd380a17', 'Bọc răng sứ Zirconia', 'boc-rang-su-zirconia', 5000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Bọc răng sứ Zirconia là gì?</strong></h2><p>Bọc răng sứ Zirconia là giải pháp phục hình răng cao cấp với vật liệu sứ Zirconia (Dioxide Zirconium) - một loại sứ có độ cứng cao nhất hiện nay. Răng sứ Zirconia không chỉ có độ bền vượt trội mà còn có màu sắc tự nhiên, trong mờ giống răng thật.</p><h2><strong>Ưu điểm của răng sứ Zirconia</strong></h2><ul><li>Độ cứng cao gấp 5 lần sứ thông thường, chịu lực ăn nhai tốt</li><li>Màu sắc tự nhiên, trong mờ như răng thật</li><li>Tương thích sinh học tuyệt đối, không gây kích ứng nướu</li><li>Không bị ố vàng theo thời gian</li><li>Tuổi thọ trên 20 năm nếu chăm sóc đúng cách</li></ul><h2><strong>Quy trình bọc răng sứ Zirconia tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám và chụp phim để đánh giá tình trạng răng</p><p><strong>Bước 2:</strong> Mài răng và lấy dấu hàm</p><p><strong>Bước 3:</strong> Gắn răng sứ tạm trong thời gian chế tác răng sứ</p><p><strong>Bước 4:</strong> Thử và điều chỉnh răng sứ cho vừa khít</p><p><strong>Bước 5:</strong> Gắn răng sứ Zirconia chính thức</p><h2><strong>Vì sao nên chọn bọc răng sứ tại Nha khoa Hoàng Quân?</strong></h2><p>Hoàng Quân là chuỗi hệ thống nha khoa uy tín toàn quốc. Khi sử dụng dịch vụ tại Hoàng Quân, bạn sẽ được:</p><ul><li>Sử dụng răng sứ Zirconia chính hãng, có nguồn gốc rõ ràng</li><li>Bác sĩ giàu kinh nghiệm, tay nghề cao</li><li>Công nghệ CAD/CAM hiện đại, chính xác tuyệt đối</li><li>Bảo hành dài hạn, chăm sóc trọn đời</li><li>Miễn phí khám và tư vấn</li></ul>', 90, 'Chiếc', 'Đang hoạt động', 'c2eebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', 'Dán sứ Veneer Emax', 'dan-su-veneer-emax', 8000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Dán sứ Veneer Emax là gì?</strong></h2><p>Dán sứ Veneer Emax là kỹ thuật thẩm mỹ răng hiện đại, sử dụng những miếng sứ siêu mỏng (0.2-0.5mm) làm từ vật liệu Emax để dán lên bề mặt răng thật. Đây là giải pháp tối ưu để cải thiện màu sắc, hình dáng răng mà không cần mài nhiều răng thật.</p><h2><strong>Ưu điểm của dán sứ Veneer Emax</strong></h2><ul><li>Siêu mỏng chỉ 0.2-0.5mm, ít mài răng thật</li><li>Độ trong mờ cao, ánh sáng xuyên qua tự nhiên như răng thật</li><li>Độ bền cao, chống mẻ vỡ tốt</li><li>Màu sắc đa dạng, tùy chỉnh theo mong muốn</li><li>Thời gian sử dụng lên đến 15-20 năm</li></ul><h2><strong>Quy trình dán sứ Veneer Emax tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám và tư vấn, thiết kế nụ cười</p><p><strong>Bước 2:</strong> Mài nhẹ bề mặt răng và lấy dấu hàm</p><p><strong>Bước 3:</strong> Chế tác miếng dán sứ Emax</p><p><strong>Bước 4:</strong> Thử và điều chỉnh màu sắc</p><p><strong>Bước 5:</strong> Dán chính thức bằng keo chuyên dụng</p><h2><strong>Vì sao nên chọn dán sứ Veneer tại Nha khoa Hoàng Quân?</strong></h2><p>Hoàng Quân là nha khoa hàng đầu về thẩm mỹ răng:</p><ul><li>Răng sứ Emax nhập khẩu chính hãng</li><li>Công nghệ Smile Design 3D</li><li>Bác sĩ thẩm mỹ chuyên sâu</li><li>Cam kết màu sắc đẹp tự nhiên</li><li>Bảo hành lên đến 10 năm</li></ul>', 120, 'Chiếc', 'Đang hoạt động', 'c2eebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('o14ebc99-9c0b-4ef9-bb6d-6bb9bd380a15', 'Nhổ răng số 8 mọc lệch', 'nho-rang-so-8-moc-lech', 2000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Nhổ răng số 8 mọc lệch là gì?</strong></h2><p>Răng số 8 (răng khôn) thường mọc từ 17-25 tuổi và dễ gặp vấn đề như mọc lệch, mọc ngầm. Nhổ răng số 8 là tiểu phẫu để loại bỏ răng khôn gây đau nhức hoặc ảnh hưởng đến răng xung quanh.</p><h2><strong>Dấu hiệu cần nhổ răng số 8</strong></h2><ul><li>Răng số 8 mọc lệch, đâm vào má</li><li>Đau nhức kéo dài, sưng nướu</li><li>Răng mọc ngầm gây viêm nhiễm</li><li>Sâu răng không thể điều trị</li><li>Ảnh hưởng kết quả niềng răng</li></ul><h2><strong>Quy trình nhổ răng số 8 tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám và chụp phim X-quang</p><p><strong>Bước 2:</strong> Gây tê cục bộ</p><p><strong>Bước 3:</strong> Tiến hành nhổ răng</p><p><strong>Bước 4:</strong> Khâu vết thương</p><p><strong>Bước 5:</strong> Tái khám sau 7 ngày</p><h2><strong>Vì sao nên nhổ răng số 8 tại Hoàng Quân?</strong></h2><p>Nhổ răng tại Hoàng Quân mang lại:</p><ul><li>Không đau nhờ kỹ thuật gây tê tiên tiến</li><li>Phẫu thuật chính xác bằng công nghệ Piezo</li><li>Vết thương nhỏ, lành nhanh</li><li>Phòng phẫu vô trùng chuẩn quốc tế</li><li>Chăm sóc sau phẫu tận tình</li></ul>', 60, 'Chiếc', 'Đang hoạt động', 'b1eebc99-9c0b-4ef9-bb6d-6bb9bd380a22'),
('n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', 'Điều trị tủy răng', 'dieu-tri-tuy-rang', 1500000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Điều trị tủy răng là gì?</strong></h2><p>Điều trị tủy răng là phương pháp loại bỏ tủy răng bị viêm hoặc chết, sau đó làm sạch và trám bít ống tủy. Đây là giải pháp để giữ răng thật thay vì nhổ bỏ.</p><h2><strong>Dấu hiệu cần điều trị tủy răng</strong></h2><ul><li>Đau răng dữ dội vào ban đêm</li><li>Răng ê buốt khi ăn nóng lạnh</li><li>Sưng nướu, mủ chảy ra</li><li>Răng đổi màu sẫm hơn</li><li>Răng bị sâu tới tủy</li></ul><h2><strong>Quy trình điều trị tủy răng tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám và chụp phim</p><p><strong>Bước 2:</strong> Gây tê vô cảm</p><p><strong>Bước 3:</strong> Lấy tủy và làm sạch</p><p><strong>Bước 4:</strong> Trám bít ống tủy</p><p><strong>Bước 5:</strong> Trám hoặc bọc sứ</p><h2><strong>Vì sao nên điều trị tủy tại Hoàng Quân?</strong></h2><p>Hoàng Quân ứng dụng công nghệ tiên tiến:</p><ul><li>Máy X-Smart Plus hiện đại</li><li>Kính hiển vi nội nha</li><li>Vật liệu Bioroot kháng khuẩn</li><li>Bác sĩ chuyên sâu</li><li>Tỷ lệ thành công trên 95%</li></ul>', 90, 'Chiếc', 'Đang hoạt động', 'b1eebc99-9c0b-4ef9-bb6d-6bb9bd380a22'),
('l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12', 'Trám răng sâu GIC', 'tram-rang-sau-gic', 350000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Trám răng sâu GIC là gì?</strong></h2><p>Trám răng GIC (Glass Ionomer Cement) sử dụng vật liệu xi măng thủy tinh để hàn trám lỗ sâu răng. GIC có khả năng giải phóng Fluoride giúp phòng ngừa sâu răng tái phát.</p><h2><strong>Ưu điểm trám răng GIC</strong></h2><ul><li>An toàn tuyệt đối</li><li>Giải phóng Fluoride</li><li>Bám dính tự nhiên</li><li>Phù hợp trẻ em và thai phụ</li><li>Giá thành hợp lý</li></ul><h2><strong>Quy trình trám răng GIC tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám đánh giá</p><p><strong>Bước 2:</strong> Làm sạch răng sâu</p><p><strong>Bước 3:</strong> Chuẩn bị và trám GIC</p><p><strong>Bước 4:</strong> Tạo hình đánh bóng</p><p><strong>Bước 5:</strong> Kiểm tra khớp cắn</p><h2><strong>Vì sao nên trám răng tại Hoàng Quân?</strong></h2><p>Trám răng tại Hoàng Quân:</p><ul><li>Vật liệu GIC chính hãng từ Nhật</li><li>Kỹ thuật trám tỷ mỉ</li><li>Không đau, an toàn</li><li>Bảo hành 6 tháng</li><li>Tư vấn chu đáo</li></ul>', 45, 'Chiếc', 'Đang hoạt động', 'b1eebc99-9c0b-4ef9-bb6d-6bb9bd380a22'),
('m12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13', 'Nhổ răng sữa', 'nho-rang-sua', 100000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Nhổ răng sữa là gì?</strong></h2><p>Nhổ răng sữa là quy trình loại bỏ răng sữa lung lay hoặc bị sâu không thể điều trị ở trẻ em. Giúp răng vĩnh viễn mọc đúng vị trí.</p><h2><strong>Khi nào cần nhổ răng sữa?</strong></h2><ul><li>Răng sữa lung lay không rụng</li><li>Răng sữa sâu nặng</li><li>Răng vĩnh viễn mọc lệch</li><li>Viêm nhiễm ảnh hưởng xung quanh</li><li>Chỉnh nha cần tạo khoảng</li></ul><h2><strong>Quy trình nhổ răng sữa tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám đánh giá</p><p><strong>Bước 2:</strong> Gây tê nhẹ nhàng</p><p><strong>Bước 3:</strong> Nhổ răng không đau</p><p><strong>Bước 4:</strong> Cầm máu</p><p><strong>Bước 5:</strong> Tái khám nếu cần</p><h2><strong>Vì sao nên nhổ răng sữa tại Hoàng Quân?</strong></h2><p>Hoàng Quân chuyên nha khoa trẻ em:</p><ul><li>Bác sĩ chuyên môn cao</li><li>Không gian vui nhộn</li><li>Kỹ thuật nhẹ nhàng</li><li>Theo dõi răng vĩnh viễn</li><li>Tư vấn chăm sóc</li></ul>', 30, 'Chiếc', 'Đang hoạt động', 'b1eebc99-9c0b-4ef9-bb6d-6bb9bd380a22'),
('r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18', 'Tẩy trắng răng', 'tay-trang-rang-tai-nha', 2000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Tẩy trắng răng tại nhà là gì?</strong></h2><p>Tẩy trắng răng tại nhà sử dụng máng răng cá nhân và gel tẩy trắng để làm trắng răng dần tại nhà. Giải pháp an toàn và tiện lợi.</p><h2><strong>Ưu điểm tẩy trắng tại nhà</strong></h2><ul><li>Linh hoạt về thời gian</li><li>An toàn, nồng độ thấp</li><li>Hiệu quả bền vững</li><li>Chi phí hợp lý</li><li>Máng tái sử dụng được</li></ul><h2><strong>Quy trình tẩy trắng tại nhà của Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám và vệ sinh răng</p><p><strong>Bước 2:</strong> Lấy dấu làm máng răng</p><p><strong>Bước 3:</strong> Bàn giao kit và hướng dẫn</p><p><strong>Bước 4:</strong> Khách tự tẩy 2-4 tuần</p><p><strong>Bước 5:</strong> Tái khám kiểm tra</p><h2><strong>Vì sao nên chọn kit tẩy trắng Hoàng Quân?</strong></h2><p>Bộ kit của Hoàng Quân:</p><ul><li>Gel Opalescence Mỹ số 1</li><li>Máng răng cá nhân hóa</li><li>Nồng độ an toàn</li><li>Hướng dẫn chi tiết</li><li>Theo dõi suốt quá trình</li></ul>', 30, 'Gói', 'Đang hoạt động', 'c2eebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('s18ebc99-9c0b-4ef9-bb6d-6bb9bd380a19', 'Phục hồi răng bằng Inlay/Onlay', 'phuc-hoi-rang-bang-inlay-onlay', 4000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Phục hồi răng bằng Inlay/Onlay là gì?</strong></h2><p>Inlay/Onlay là mảnh trám sứ được chế tác riêng để khôi phục răng bị sâu diện rộng. Giải pháp trung gian giữa trám thường và bọc sứ.</p><h2><strong>Ưu điểm Inlay/Onlay</strong></h2><ul><li>Bảo tồn răng thật tối đa</li><li>Độ bền 15-20 năm</li><li>Màu sắc tự nhiên</li><li>Khôi phục ăn nhai tốt</li><li>Không co ngót</li></ul><h2><strong>Quy trình Inlay/Onlay tại Hoàng Quân</strong></h2><p><strong>Bước 1:</strong> Khám đánh giá</p><p><strong>Bước 2:</strong> Mài sửa và lấy dấu</p><p><strong>Bước 3:</strong> Chế tác CAD/CAM</p><p><strong>Bước 4:</strong> Thử và điều chỉnh</p><p><strong>Bước 5:</strong> Gắn chính thức</p><h2><strong>Vì sao nên chọn Inlay/Onlay tại Hoàng Quân?</strong></h2><p>Hoàng Quân sử dụng công nghệ tiên tiến:</p><ul><li>Sứ Emax hoặc Zirconia</li><li>Hệ thống CEREC 1 ngày</li><li>Độ khớp cắn hoàn hảo</li><li>Bảo hành 10 năm</li><li>Tư vấn chi tiết</li></ul>', 75, 'Chiếc', 'Đang hoạt động', 'c2eebc99-9c0b-4ef9-bb6d-6bb9bd380a33'),
('t19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20', 'Niềng răng mắc cài sứ', 'nieng-rang-mac-cai-su', 40000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Niềng răng mắc cài sứ là gì?</strong></h2><p>Niềng răng mắc cài sứ sử dụng mắc cài sứ trắng hoặc trong suốt, kết hợp dây kim loại để di chuyển răng. Giải pháp thẩm mỹ hơn mắc cài kim loại.</p><h2><strong>Ưu điểm</strong></h2><ul><li>Màu trắng ít lộ</li><li>Hiệu quả cao</li><li>Chi phí hợp lý</li><li>Phù hợp mọi lứa tuổi</li></ul><h2><strong>Vì sao nên niềng răng tại Hoàng Quân?</strong></h2><ul><li>Mắc cài 3M Clarity từ Mỹ</li><li>Bác sĩ chứng chỉ quốc tế</li><li>Công nghệ 3D Smile Design</li><li>Hỗ trợ trả góp 0%</li></ul>', 120, 'Gói', 'Đang hoạt động', 'd3eebc99-9c0b-4ef9-bb6d-6bb9bd380a44'),
('u20ebc99-9c0b-4ef9-bb6d-6bb9bd380a21', 'Niềng răng Invisalign', 'nieng-rang-invisalign', 80000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Niềng răng Invisalign là gì?</strong></h2><p>Invisalign là hệ thống niềng răng trong suốt không mắc cài từ Mỹ, sử dụng khay nhựa trong suốt có thể tháo rời.</p><h2><strong>Ưu điểm</strong></h2><ul><li>Trong suốt, gần như vô hình</li><li>Có thể tháo rời</li><li>Không đau, không cấn khấu</li><li>Dự đoán trước kết quả 3D</li></ul><h2><strong>Vì sao nên niềng Invisalign tại Hoàng Quân?</strong></h2><ul><li>Red Diamond Provider - cấp cao nhất VN</li><li>Bác sĩ đào tạo chuyên sâu</li><li>Công nghệ iTero Scanner 3D</li><li>Cam kết kết quả</li></ul>', 120, 'Gói', 'Đang hoạt động', 'd3eebc99-9c0b-4ef9-bb6d-6bb9bd380a44'),
('v21ebc99-9c0b-4ef9-bb6d-6bb9bd380a22', 'Niềng răng mắc cài tự động', 'nieng-rang-mac-cai-tu-dong', 50000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Niềng răng mắc cài tự động là gì?</strong></h2><p>Mắc cài tự động (Self-Ligating) có nắp đậy tự khóa dây cung, không cần dùng chun buộc. Giảm đau và rút ngắn thời gian điều trị.</p><h2><strong>Ưu điểm</strong></h2><ul><li>Giảm đau nhờ lực nhẹ nhàng</li><li>Rút ngắn thời gian 4-6 tháng</li><li>Ít tái khám hơn</li><li>Dễ vệ sinh</li></ul><h2><strong>Vì sao nên chọn tại Hoàng Quân?</strong></h2><ul><li>Mắc cài Damon Q từ Mỹ</li><li>Bác sĩ đào tạo bài bản</li><li>Cam kết thời gian</li><li>Hỗ trợ 24/7</li></ul>', 120, 'Gói', 'Đang hoạt động', 'd3eebc99-9c0b-4ef9-bb6d-6bb9bd380a44'),
('w22ebc99-9c0b-4ef9-bb6d-6bb9bd380a23', 'Chỉnh nha trẻ em sớm', 'chinh-nha-tre-em-som', 25000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Chỉnh nha trẻ em sớm là gì?</strong></h2><p>Can thiệp điều chỉnh răng và xương hàm ở trẻ 6-12 tuổi. Giai đoạn vàng để chỉnh hình xương hàm và hướng dẫn răng mọc đúng.</p><h2><strong>Lợi ích</strong></h2><ul><li>Điều chỉnh xương hàm đúng hướng</li><li>Tạo khoảng cho răng vĩnh viễn</li><li>Rút ngắn thời gian sau này</li><li>Chi phí thấp hơn</li></ul><h2><strong>Vì sao nên chọn Hoàng Quân?</strong></h2><ul><li>Bác sĩ chuyên sâu trẻ em</li><li>Khí cụ hiện đại an toàn</li><li>Không gian thân thiện</li><li>Theo dõi dài hạn</li></ul>', 60, 'Gói', 'Đang hoạt động', 'd3eebc99-9c0b-4ef9-bb6d-6bb9bd380a44'),
('x23ebc99-9c0b-4ef9-bb6d-6bb9bd380a24', 'Cấy ghép Implant Mỹ', 'cay-ghep-implant-my', 25000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Cấy ghép Implant Mỹ là gì?</strong></h2><p>Cấy ghép Implant là phương pháp trồng răng bằng trụ Titanium vào xương hàm. Trụ Implant Mỹ (Nobel, Straumann) là dòng cao cấp nhất.</p><h2><strong>Ưu điểm</strong></h2><ul><li>Titanium Grade 4, tương thích 100%</li><li>Tích hợp xương trong 3-4 tuần</li><li>Độ bền trên 25 năm</li><li>Tỷ lệ thành công 99%</li></ul><h2><strong>Vì sao nên cấy Implant tại Hoàng Quân?</strong></h2><ul><li>Đối tác Diamond Elite Straumann</li><li>Bác sĩ có chứng chỉ quốc tế</li><li>Phòng mổ chuẩn quốc tế</li><li>Bảo hành trọn đời</li></ul>', 150, 'Chiếc', 'Đang hoạt động', 'e4eebc99-9c0b-4ef9-bb6d-6bb9bd380a55'),
('y24ebc99-9c0b-4ef9-bb6d-6bb9bd380a25', 'Ghép xương hàm trước cấy Implant', 'ghep-xuong-ham-truoc-cay-implant', 10000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Ghép xương hàm là gì?</strong></h2><p>Phẫu thuật bổ sung xương nhân tạo vào vùng xương hàm bị thiếu hụt. Bước tiên quyết cho cấy Implant khi xương không đủ.</p><h2><strong>Khi nào cần ghép xương?</strong></h2><ul><li>Xương tiêu sau mất răng lâu</li><li>Xương quá mỏng</li><li>Xương bị tổn thương</li><li>Viêm nha chu nặng</li></ul><h2><strong>Vì sao nên ghép xương tại Hoàng Quân?</strong></h2><ul><li>Vật liệu Bio-Oss Thụy Sỹ</li><li>Màng Bio-Gide cao cấp</li><li>Phẫu thuật viên quốc tế</li><li>Tỷ lệ thành công 96%</li></ul>', 120, '', 'Đang hoạt động', 'e4eebc99-9c0b-4ef9-bb6d-6bb9bd380a55'),
('z25ebc99-9c0b-4ef9-bb6d-6bb9bd380a26', 'Cấy Implant toàn hàm All-on-4', 'cay-implant-toan-ham-all-on-4', 180000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>All-on-4 là gì?</strong></h2><p>Kỹ thuật cấy ghép toàn hàm tiên tiến, chỉ cần 4 trụ Implant để đỡ cả hàm răng giả cố định. Giải pháp cho người mất răng toàn bộ.</p><h2><strong>Ưu điểm</strong></h2><ul><li>Chỉ cần 4 trụ thay vì 8-10</li><li>Tiết kiệm 40-50% chi phí</li><li>Không cần ghép xương</li><li>Có răng ngay trong ngày</li></ul><h2><strong>Vì sao nên làm All-on-4 tại Hoàng Quân?</strong></h2><ul><li>Trụ Nobel Biocare chính hãng</li><li>Phẫu thuật viên Nobel đào tạo</li><li>Navigation Surgery không dao kéo</li><li>Bảo hành trọn đời</li></ul>', 240, 'Gói', 'Đang hoạt động', 'e4eebc99-9c0b-4ef9-bb6d-6bb9bd380a55'),
('a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', 'Răng sứ trên Implant', 'rang-su-tren-implant', 12000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Răng sứ trên Implant là gì?</strong></h2><p>Răng sứ cao cấp được gắn lên trụ Implant đã cấy trong xương. Bước cuối cùng trong quy trình trồng răng Implant.</p><h2><strong>Các loại răng sứ</strong></h2><ul><li>Răng sứ kim loại: Bền, giá rẻ</li><li>Răng sứ Zirconia: Thẩm mỹ, bền</li><li>Răng sứ Emax: Trong mờ tự nhiên</li></ul><h2><strong>Vì sao nên làm tại Hoàng Quân?</strong></h2><ul><li>Răng sứ chính hãng Đức, Mỹ, Nhật</li><li>Kỹ thuật viên quốc tế</li><li>Màu sắc giống răng thật 100%</li><li>Bảo hành 10 năm</li></ul>', 90, 'Chiếc', 'Đang hoạt động', 'e4eebc99-9c0b-4ef9-bb6d-6bb9bd380a55'),
('f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32', 'Gói chăm sóc gia đình 4 người', 'goi-cham-soc-gia-dinh-4-nguoi', 2500000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Gói chăm sóc gia đình 4 người</strong></h2><p>Combo dịch vụ cho 4 thành viên gia đình: khám tổng quát, cạo vôi, đánh bóng và tư vấn. Giải pháp tiết kiệm cho cả nhà.</p><h2><strong>Nội dung gói</strong></h2><ul><li>Khám cho 4 người</li><li>Cạo vôi siêu âm</li><li>Đánh bóng răng</li><li>Tư vấn cá nhân</li></ul><h2><strong>Lợi ích</strong></h2><ul><li>Tiết kiệm 30%</li><li>Linh hoạt thời gian</li><li>Ưu tiên phục vụ</li><li>Tặng kèm bàn chải</li></ul>', 180, 'Gói', 'Đang hoạt động', '58c8f3aa-d5ca-11f0-8312-0250d18a7895'),
('g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33', 'Khám răng định kỳ cho trẻ em', 'kham-rang-dinh-ky-cho-tre-em', 150000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Khám răng định kỳ cho trẻ em</strong></h2><p>Kiểm tra sức khỏe răng miệng trẻ 3-15 tuổi. Phát hiện sớm sâu răng và can thiệp kịp thời.</p><h2><strong>Tầm quan trọng</strong></h2><ul><li>Phát hiện sớm sâu răng</li><li>Theo dõi thay răng</li><li>Tư vấn chăm sóc đúng</li><li>Giúp trẻ không sợ nha sĩ</li></ul><h2><strong>Vì sao nên khám tại Hoàng Quân?</strong></h2><ul><li>Bác sĩ trẻ em chuyên môn</li><li>Không gian vui nhộn</li><li>Khám nhẹ nhàng</li><li>Tặng quà cho bé</li></ul>', 30, '', 'Đang hoạt động', '58c8f3aa-d5ca-11f0-8312-0250d18a7895'),
('h33ebc99-9c0b-4ef9-bb6d-6bb9bd380a34', 'Điều trị sâu răng trẻ em', 'dieu-tri-sau-rang-tre-em', 400000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Điều trị sâu răng trẻ em</strong></h2><p>Loại bỏ mô răng bị sâu và trám lại bằng vật liệu an toàn. Điều trị kịp thời giúp bảo tồn răng sữa.</p><h2><strong>Dấu hiệu sâu răng</strong></h2><ul><li>Đau răng khi ăn lạnh nóng</li><li>Xuất hiện đốm đen</li><li>Trẻ không nhai được</li><li>Sưng nướu quanh răng</li></ul><h2><strong>Vì sao nên điều trị tại Hoàng Quân?</strong></h2><ul><li>Bác sĩ yêu trẻ em</li><li>Vật liệu an toàn</li><li>Không đau, không sợ</li><li>Bảo hành 6 tháng</li></ul>', 45, 'Chiếc', 'Đang hoạt động', '58c8f3aa-d5ca-11f0-8312-0250d18a7895'),
('i34ebc99-9c0b-4ef9-bb6d-6bb9bd380a35', 'Chăm sóc răng miệng người cao tuổi', 'cham-soc-rang-mieng-nguoi-cao-tuoi', 800000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Chăm sóc răng miệng người cao tuổi</strong></h2><p>Dịch vụ chuyên biệt cho người trên 60 tuổi: khám tổng quát, điều trị bệnh lý và tư vấn phục hồi răng.</p><h2><strong>Vấn đề thường gặp</strong></h2><ul><li>Mất răng nhiều</li><li>Viêm nha chu, nướu tụt</li><li>Răng ố vàng</li><li>Khô miệng do thuốc</li></ul><h2><strong>Vì sao nên chọn Hoàng Quân?</strong></h2><ul><li>Bác sĩ kiên nhẫn tận tình</li><li>Phương án phù hợp sức khỏe</li><li>Hỗ trợ di chuyển</li><li>Ưu đãi người cao tuổi</li></ul>', 60, '', 'Đang hoạt động', '58c8f3aa-d5ca-11f0-8312-0250d18a7895'),
('b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28', 'Khám và tư vấn răng miệng', 'kham-va-tu-van-rang-mieng', 100000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Khám và tư vấn răng miệng</strong></h2><p>Dịch vụ cơ bản giúp hiểu rõ tình trạng sức khỏe răng miệng và được tư vấn phương án điều trị phù hợp.</p><h2><strong>Nội dung khám</strong></h2><ul><li>Kiểm tra tổng quát răng, nướu</li><li>Phát hiện sâu răng, viêm nướu</li><li>Đánh giá khớp cắn</li><li>Tư vấn phương án cụ thể</li></ul><h2><strong>Vì sao nên khám tại Hoàng Quân?</strong></h2><ul><li>MIỄN PHÍ khám và tư vấn</li><li>Bác sĩ giàu kinh nghiệm</li><li>Trang thiết bị hiện đại</li><li>16 phòng khám toàn quốc</li></ul>', 30, '', 'Đang hoạt động', '62324f25-d5ca-11f0-8312-0250d18a7895'),
('c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', 'Bôi Fluor phòng sâu răng', 'boi-fluoride-phong-sau-rang', 200000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Bôi Fluoride là gì?</strong></h2><p>Phương pháp phòng ngừa sâu răng bằng cách thoa gel Fluoride lên bề mặt răng. Tăng cường độ cứng men răng.</p><h2><strong>Lợi ích</strong></h2><ul><li>Tăng cường khoáng cho men răng</li><li>Giảm 40% nguy cơ sâu răng</li><li>An toàn, không đau</li><li>Giá rẻ, hiệu quả</li></ul><h2><strong>Vì sao nên bôi Fluoride tại Hoàng Quân?</strong></h2><ul><li>Gel Fluoride 3M chuẩn FDA</li><li>Nồng độ phù hợp từng tuổi</li><li>Bác sĩ tư vấn chu đáo</li><li>Khuyến cáo 2 lần/năm</li></ul>', 20, '', 'Đang hoạt động', '62324f25-d5ca-11f0-8312-0250d18a7895'),
('d29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30', 'Điều trị nha chu', 'dieu-tri-nha-chu', 2000000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Điều trị nha chu là gì?</strong></h2><p>Điều trị các bệnh lý về mô nha chu như viêm nướu, viêm nha chu, túi nha chu. Cứu răng khỏi lung lay và rụng.</p><h2><strong>Dấu hiệu bệnh nha chu</strong></h2><ul><li>Nướu sưng đỏ, chảy máu</li><li>Hôi miệng dai dẳng</li><li>Răng lung lay</li><li>Nướu tụt lộ chân răng</li></ul><h2><strong>Vì sao nên điều trị tại Hoàng Quân?</strong></h2><ul><li>Máy Piezo không đau</li><li>Bác sĩ nha chu chuyên sâu</li><li>Liệu trình cá nhân hóa</li><li>Tỷ lệ cứu răng 90%</li></ul>', 60, 'Gói', 'Đang hoạt động', '62324f25-d5ca-11f0-8312-0250d18a7895'),
('e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', 'Hàn trám Seal răng hàm', 'han-tram-seal-rang-ham', 250000.00, '<h1><strong>Nội dung</strong></h1><h2><strong>Hàn trám Seal răng hàm là gì?</strong></h2><p>Phủ lớp nhựa lên rãnh sâu bề mặt răng hàm để phòng ngừa sâu răng. Dịch vụ phổ biến cho trẻ em.</p><h2><strong>Lợi ích</strong></h2><ul><li>Phòng sâu răng 80-90%</li><li>Bảo vệ răng hàm mới mọc</li><li>Không đau, nhanh chóng</li><li>Chi phí rẻ</li></ul><h2><strong>Vì sao nên hàn Seal tại Hoàng Quân?</strong></h2><ul><li>Vật liệu 3M an toàn</li><li>Bác sĩ trẻ em chuyên môn</li><li>Không gian thân thiện</li><li>Bảo hành 2 năm</li></ul>', 30, 'Chiếc', 'Đang hoạt động', '62324f25-d5ca-11f0-8312-0250d18a7895');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinhanhdichvu`
--

DROP TABLE IF EXISTS `hinhanhdichvu`;
CREATE TABLE IF NOT EXISTS `hinhanhdichvu` (
  `MaHinhAnh` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT (uuid()),
  `MaDichVu` varchar(36) NOT NULL,
  `URL` varchar(500) NOT NULL,
  `ThuTu` int DEFAULT '0',
  `LaAnhChinh` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`MaHinhAnh`),
  KEY `MaDichVu` (`MaDichVu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `hinhanhdichvu`
--

INSERT INTO `hinhanhdichvu` (`MaHinhAnh`, `MaDichVu`, `URL`, `ThuTu`, `LaAnhChinh`) VALUES
('332fccf2-f38f-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tram-rang-sau-gic/tram-rang-sau-gic-1.jpg', 1, 1),
('ee0b7bb9-f38e-11f0-820f-0250d18a7895', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-tuy-rang/dieu-tri-tuy-rang-4.jpg', 4, 0),
('ee0b7b5e-f38e-11f0-820f-0250d18a7895', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-tuy-rang/dieu-tri-tuy-rang-3.jpg', 3, 1),
('ee0b7aeb-f38e-11f0-820f-0250d18a7895', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-tuy-rang/dieu-tri-tuy-rang-2.jpg', 2, 0),
('ee0b7929-f38e-11f0-820f-0250d18a7895', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-tuy-rang/dieu-tri-tuy-rang-1.jpg', 1, 0),
('bd9a373c-f38e-11f0-820f-0250d18a7895', 'o14ebc99-9c0b-4ef9-bb6d-6bb9bd380a15', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-so-8-moc-lech/nho-rang-so-8-moc-lech-4.jpg', 4, 0),
('8ba252d5-f38e-11f0-820f-0250d18a7895', 'o14ebc99-9c0b-4ef9-bb6d-6bb9bd380a15', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-so-8-moc-lech/nho-rang-so-8-moc-lech-3.jpg', 3, 0),
('8ba250eb-f38e-11f0-820f-0250d18a7895', 'o14ebc99-9c0b-4ef9-bb6d-6bb9bd380a15', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-so-8-moc-lech/nho-rang-so-8-moc-lech-2.jpg', 2, 0),
('317fc8d7-e9e3-11f0-8bc3-0250d18a7895', 'o14ebc99-9c0b-4ef9-bb6d-6bb9bd380a15', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-so-8-moc-lech/nho-rang-so-8-moc-lech-1.jpg', 1, 1),
('332fce46-f38f-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tram-rang-sau-gic/tram-rang-sau-gic-2.jpg', 2, 0),
('332fcf92-f38f-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tram-rang-sau-gic/tram-rang-sau-gic-3.jpg', 3, 0),
('332fcfda-f38f-11f0-820f-0250d18a7895', 'l11ebc99-9c0b-4ef9-bb6d-6bb9bd380a12', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tram-rang-sau-gic/tram-rang-sau-gic-4.jpg', 4, 0),
('785c1f3d-f38f-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-sua/nho-rang-sua-1.jpg', 1, 0),
('785c209f-f38f-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-sua/nho-rang-sua-2.jpg', 2, 0),
('785c20ea-f38f-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-sua/nho-rang-sua-3.jpg', 3, 1),
('785c2126-f38f-11f0-820f-0250d18a7895', 'm12ebc99-9c0b-4ef9-bb6d-6bb9bd380a13', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nho-rang-sua/nho-rang-sua-4.jpg', 4, 0),
('3487041c-f390-11f0-820f-0250d18a7895', 'q16ebc99-9c0b-4ef9-bb6d-6bb9bd380a17', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boc-rang-su-zirconia/boc-rang-su-zirconia-1.jpg', 1, 0),
('3487058e-f390-11f0-820f-0250d18a7895', 'q16ebc99-9c0b-4ef9-bb6d-6bb9bd380a17', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boc-rang-su-zirconia/boc-rang-su-zirconia-2.jpg', 2, 0),
('348705dd-f390-11f0-820f-0250d18a7895', 'q16ebc99-9c0b-4ef9-bb6d-6bb9bd380a17', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boc-rang-su-zirconia/boc-rang-su-zirconia-3.jpg', 3, 1),
('34870884-f390-11f0-820f-0250d18a7895', 'q16ebc99-9c0b-4ef9-bb6d-6bb9bd380a17', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boc-rang-su-zirconia/boc-rang-su-zirconia-4.jpg', 4, 0),
('7cb6003a-f390-11f0-820f-0250d18a7895', 'p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dan-su-veneer-emax/dan-su-veneer-emax-1.jpg', 1, 0),
('7cb601c1-f390-11f0-820f-0250d18a7895', 'p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dan-su-veneer-emax/dan-su-veneer-emax-2.jpg', 2, 0),
('7cb60228-f390-11f0-820f-0250d18a7895', 'p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dan-su-veneer-emax/dan-su-veneer-emax-3.jpg', 3, 0),
('7cb60279-f390-11f0-820f-0250d18a7895', 'p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dan-su-veneer-emax/dan-su-veneer-emax-4.jpg', 4, 1),
('c378c6d5-f390-11f0-820f-0250d18a7895', 'r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tay-trang-rang/tay-trang-rang-1.jpg', 1, 1),
('c378c85c-f390-11f0-820f-0250d18a7895', 'r17ebc99-9c0b-4ef9-bb6d-6bb9bd380a18', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/tay-trang-rang/tay-trang-rang-2.jpg', 2, 0),
('dd93e4c4-f390-11f0-820f-0250d18a7895', 's18ebc99-9c0b-4ef9-bb6d-6bb9bd380a19', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/phuc-hoi-rang-bang-inlayonlay/phuc-hoi-rang-bang-inlayonlay-1.jpg', 1, 1),
('dd93e693-f390-11f0-820f-0250d18a7895', 's18ebc99-9c0b-4ef9-bb6d-6bb9bd380a19', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/phuc-hoi-rang-bang-inlayonlay/phuc-hoi-rang-bang-inlayonlay-2.jpg', 2, 0),
('6587c6ab-f391-11f0-820f-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-mac-cai-su/nieng-rang-mac-cai-su-1.png', 1, 1),
('6587c81b-f391-11f0-820f-0250d18a7895', 't19ebc99-9c0b-4ef9-bb6d-6bb9bd380a20', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-mac-cai-su/nieng-rang-mac-cai-su-2.jpg', 2, 0),
('86074ab0-f391-11f0-820f-0250d18a7895', 'u20ebc99-9c0b-4ef9-bb6d-6bb9bd380a21', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-invisalign/nieng-rang-invisalign-1.jpg', 1, 1),
('86074c89-f391-11f0-820f-0250d18a7895', 'u20ebc99-9c0b-4ef9-bb6d-6bb9bd380a21', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-invisalign/nieng-rang-invisalign-2.jpg', 2, 0),
('bfefd84f-f391-11f0-820f-0250d18a7895', 'v21ebc99-9c0b-4ef9-bb6d-6bb9bd380a22', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-mac-cai-tu-dong/nieng-rang-mac-cai-tu-dong-1.jpg', 1, 0),
('bfefd98a-f391-11f0-820f-0250d18a7895', 'v21ebc99-9c0b-4ef9-bb6d-6bb9bd380a22', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/nieng-rang-mac-cai-tu-dong/nieng-rang-mac-cai-tu-dong-2.jpg', 2, 1),
('e990ec8c-f391-11f0-820f-0250d18a7895', 'w22ebc99-9c0b-4ef9-bb6d-6bb9bd380a23', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/chinh-nha-tre-em-som/chinh-nha-tre-em-som-1.jpg', 1, 0),
('e990ef33-f391-11f0-820f-0250d18a7895', 'w22ebc99-9c0b-4ef9-bb6d-6bb9bd380a23', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/chinh-nha-tre-em-som/chinh-nha-tre-em-som-2.png', 2, 1),
('1cd59603-f392-11f0-820f-0250d18a7895', 'x23ebc99-9c0b-4ef9-bb6d-6bb9bd380a24', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cay-ghep-implant-my/cay-ghep-implant-my-1.jpg', 1, 0),
('1cd59863-f392-11f0-820f-0250d18a7895', 'x23ebc99-9c0b-4ef9-bb6d-6bb9bd380a24', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cay-ghep-implant-my/cay-ghep-implant-my-2.jpg', 2, 1),
('39955720-f392-11f0-820f-0250d18a7895', 'y24ebc99-9c0b-4ef9-bb6d-6bb9bd380a25', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/ghep-xuong-ham-truoc-cay-implant/ghep-xuong-ham-truoc-cay-implant-1.jpg', 1, 1),
('39955919-f392-11f0-820f-0250d18a7895', 'y24ebc99-9c0b-4ef9-bb6d-6bb9bd380a25', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/ghep-xuong-ham-truoc-cay-implant/ghep-xuong-ham-truoc-cay-implant-2.png', 2, 0),
('59a4afe5-f392-11f0-820f-0250d18a7895', 'z25ebc99-9c0b-4ef9-bb6d-6bb9bd380a26', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cay-implant-toan-ham-all-on-4/cay-implant-toan-ham-all-on-4-1.jpg', 1, 1),
('59a4b173-f392-11f0-820f-0250d18a7895', 'z25ebc99-9c0b-4ef9-bb6d-6bb9bd380a26', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cay-implant-toan-ham-all-on-4/cay-implant-toan-ham-all-on-4-2.jpg', 2, 0),
('6b2ddee5-f392-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/rang-su-tren-implant/rang-su-tren-implant-1.jpg', 1, 1),
('6b2de059-f392-11f0-820f-0250d18a7895', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/rang-su-tren-implant/rang-su-tren-implant-2.jpg', 2, 0),
('9c7c606c-f392-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/goi-cham-soc-gia-dinh-4-nguoi/goi-cham-soc-gia-dinh-4-nguoi-1.jpg', 1, 0),
('9c7c61ea-f392-11f0-820f-0250d18a7895', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/goi-cham-soc-gia-dinh-4-nguoi/goi-cham-soc-gia-dinh-4-nguoi-2.jpeg', 2, 1),
('bb70c003-f392-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/kham-rang-dinh-ky-cho-tre-em/kham-rang-dinh-ky-cho-tre-em-1.jpg', 1, 0),
('bb70c169-f392-11f0-820f-0250d18a7895', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/kham-rang-dinh-ky-cho-tre-em/kham-rang-dinh-ky-cho-tre-em-2.jpg', 2, 1),
('d3589605-f392-11f0-820f-0250d18a7895', 'h33ebc99-9c0b-4ef9-bb6d-6bb9bd380a34', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-sau-rang-tre-em/dieu-tri-sau-rang-tre-em-1.jpg', 1, 1),
('d3589772-f392-11f0-820f-0250d18a7895', 'h33ebc99-9c0b-4ef9-bb6d-6bb9bd380a34', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-sau-rang-tre-em/dieu-tri-sau-rang-tre-em-2.webp', 2, 0),
('e7bf588e-f392-11f0-820f-0250d18a7895', 'i34ebc99-9c0b-4ef9-bb6d-6bb9bd380a35', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cham-soc-rang-mieng-nguoi-cao-tuoi/cham-soc-rang-mieng-nguoi-cao-tuoi-1.jpg', 1, 0),
('e7bf59ec-f392-11f0-820f-0250d18a7895', 'i34ebc99-9c0b-4ef9-bb6d-6bb9bd380a35', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/cham-soc-rang-mieng-nguoi-cao-tuoi/cham-soc-rang-mieng-nguoi-cao-tuoi-2.webp', 2, 1),
('07fc4f8a-f393-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/kham-va-tu-van-rang-mieng/kham-va-tu-van-rang-mieng-1.jpg', 1, 1),
('07fc50dd-f393-11f0-820f-0250d18a7895', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/kham-va-tu-van-rang-mieng/kham-va-tu-van-rang-mieng-2.jpg', 2, 0),
('29b6b9ff-f393-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boi-fluor-phong-sau-rang/boi-fluor-phong-sau-rang-1.jpg', 1, 0),
('29b6bbd4-f393-11f0-820f-0250d18a7895', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/boi-fluor-phong-sau-rang/boi-fluor-phong-sau-rang-2.jpg', 2, 1),
('3dc86dbb-f393-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-nha-chu/dieu-tri-nha-chu-1.jpg', 1, 0),
('3dc86f23-f393-11f0-820f-0250d18a7895', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/dieu-tri-nha-chu/dieu-tri-nha-chu-2.jpg', 2, 1),
('5a8b537e-f393-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/han-tram-seal-rang-ham/han-tram-seal-rang-ham-1.jpg', 1, 1),
('5a8b54e7-f393-11f0-820f-0250d18a7895', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/dichvu/han-tram-seal-rang-ham/han-tram-seal-rang-ham-2.jpg', 2, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hoadon`
--

DROP TABLE IF EXISTS `hoadon`;
CREATE TABLE IF NOT EXISTS `hoadon` (
  `MaHoaDon` varchar(36) NOT NULL DEFAULT (uuid()),
  `TongTien` decimal(12,0) NOT NULL,
  `PhuongThuc` varchar(50) NOT NULL,
  `NgayTao` date NOT NULL,
  `NgayThanhToan` date DEFAULT NULL,
  `TrangThai` enum('Đã hủy','Đã thanh toán','Đã hoàn tiền','Chưa thanh toán') NOT NULL DEFAULT 'Chưa thanh toán',
  `MaKhachHang` varchar(36) NOT NULL,
  `MaPhieuKham` varchar(36) NOT NULL,
  `MaNguoiDung` varchar(36) NOT NULL,
  PRIMARY KEY (`MaHoaDon`),
  KEY `MaKhachHang` (`MaKhachHang`),
  KEY `MaPhieuKham` (`MaPhieuKham`),
  KEY `MaNguoiDung` (`MaNguoiDung`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `hoadon`
--

INSERT INTO `hoadon` (`MaHoaDon`, `TongTien`, `PhuongThuc`, `NgayTao`, `NgayThanhToan`, `TrangThai`, `MaKhachHang`, `MaPhieuKham`, `MaNguoiDung`) VALUES
('HD-20260117-164350', 14000000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã thanh toán', '438e098c-b873-11f0-ad15-0250d18a7895', 'fff6bb8b-f14f-11f0-a030-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164346', 12000000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã thanh toán', '9a5d86ac-f384-11f0-820f-0250d18a7895', '9ac1ab0a-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164341', 14500000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã thanh toán', '9a5b0d63-f384-11f0-820f-0250d18a7895', '9abddd2f-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260112-194139', 41500000, 'Tiền mặt', '2026-01-12', '2026-01-17', 'Đã thanh toán', 'add82e1c-c135-11f0-8b9c-0250d18a7895', '7647150a-e9e0-11f0-8bc3-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164336', 12350000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã hủy', '9a580a1c-f384-11f0-820f-0250d18a7895', '9abb1b0b-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164331', 12100000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã thanh toán', '9a554736-f384-11f0-820f-0250d18a7895', '9ab8689a-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164328', 14000000, 'Tiền mặt', '2026-01-17', '2026-01-17', 'Đã thanh toán', '9a52c883-f384-11f0-820f-0250d18a7895', '9ab5730f-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164325', 12000000, 'Tiền mặt', '2026-01-17', NULL, 'Chưa thanh toán', '9a502a33-f384-11f0-820f-0250d18a7895', '9ab2d501-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164322', 12200000, 'Tiền mặt', '2026-01-17', NULL, 'Chưa thanh toán', '9a4d351d-f384-11f0-820f-0250d18a7895', '9aaea529-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-164354', 52000000, 'Tiền mặt', '2026-01-17', NULL, 'Chưa thanh toán', '9a60830a-f384-11f0-820f-0250d18a7895', '9ac41eef-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895'),
('HD-20260117-165107', 12350000, 'Tiền mặt', '2026-01-17', NULL, 'Chưa thanh toán', '9a580a1c-f384-11f0-820f-0250d18a7895', '9abb1b0b-f384-11f0-820f-0250d18a7895', '184dd7fd-b7b2-11f0-ad15-0250d18a7895');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khachhang`
--

DROP TABLE IF EXISTS `khachhang`;
CREATE TABLE IF NOT EXISTS `khachhang` (
  `MaKhachHang` varchar(36) NOT NULL DEFAULT (uuid()),
  `AnhDaiDien` varchar(200) DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `SoDienThoai` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `NgaySinh` date DEFAULT NULL,
  `MatKhau` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DiaChi` varchar(128) DEFAULT NULL,
  `VaiTro` enum('Khách hàng','Bác sĩ','Lễ tân','Quản lý') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Khách hàng',
  PRIMARY KEY (`MaKhachHang`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `khachhang`
--

INSERT INTO `khachhang` (`MaKhachHang`, `AnhDaiDien`, `HoTen`, `SoDienThoai`, `Email`, `NgaySinh`, `MatKhau`, `DiaChi`, `VaiTro`) VALUES
('438e098c-b873-11f0-ad15-0250d18a7895', NULL, 'Nguyễn Quân', '0901234569', 'tnhq12134@gmail.com', '2003-11-21', '$2b$10$1Y37EpoSoo9kY43DBbxcIe/FX97qbugVPJhv6UHHyGdlujMZOrUsu', NULL, 'Khách hàng'),
('add82e1c-c135-11f0-8b9c-0250d18a7895', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/khachhang/avatar_add82e1c-c135-11f0-8b9c-0250d18a7895.png', 'Hoàng Quân', '0911341117', 'tnhq1210@gmail.com', '2003-10-12', '$2b$10$XDrHU9jvytFhYFPgCoaMQOiBLpGksEcY/dxQVkOergc3P7G5DpLyO', 'abcd', 'Khách hàng'),
('9a662268-f384-11f0-820f-0250d18a7895', NULL, 'Dương Thị Hoa', '0990123456', 'duongthihoa.demo@gmail.com', '1994-02-28', '$2b$10$dummypasswordhash1234567890123456789012', '741 Cách Mạng Tháng 8, Q.10, TP.HCM', 'Khách hàng'),
('9a580a1c-f384-11f0-820f-0250d18a7895', NULL, 'Hoàng Văn Dũng', '0945678901', 'hoangvandung.demo@gmail.com', '1995-07-30', '$2b$10$dummypasswordhash1234567890123456789012', '654 Võ Văn Tần, Q.3, TP.HCM', 'Khách hàng'),
('9a5b0d63-f384-11f0-820f-0250d18a7895', NULL, 'Võ Thị Em', '0956789012', 'vothiem.demo@gmail.com', '1991-11-05', '$2b$10$dummypasswordhash1234567890123456789012', '987 Nguyễn Thị Minh Khai, Q.1, TP.HCM', 'Khách hàng'),
('9a5d86ac-f384-11f0-820f-0250d18a7895', NULL, 'Đặng Văn Phúc', '0967890123', 'dangvanphuc.demo@gmail.com', '1987-04-18', '$2b$10$dummypasswordhash1234567890123456789012', '147 Pasteur, Q.1, TP.HCM', 'Khách hàng'),
('9a60830a-f384-11f0-820f-0250d18a7895', NULL, 'Bùi Thị Giang', '0978901234', 'buithgiang.demo@gmail.com', '1993-09-22', '$2b$10$dummypasswordhash1234567890123456789012', '258 Lý Tự Trọng, Q.1, TP.HCM', 'Khách hàng'),
('9a632480-f384-11f0-820f-0250d18a7895', NULL, 'Ngô Văn Hải', '0989012345', 'ngovanhai.demo@gmail.com', '1989-06-14', '$2b$10$dummypasswordhash1234567890123456789012', '369 Điện Biên Phủ, Q.3, TP.HCM', 'Khách hàng'),
('9a4d351d-f384-11f0-820f-0250d18a7895', NULL, 'Nguyễn Văn An', '0901234567', 'nguyenvanan.demo@gmail.com', '1990-05-15', '$2b$10$dummypasswordhash1234567890123456789012', '123 Nguyễn Huệ, Q.1, TP.HCM', 'Khách hàng'),
('9a554736-f384-11f0-820f-0250d18a7895', NULL, 'Phạm Thị Dung', '0934567890', 'phamthidung.demo@gmail.com', '1988-12-25', '$2b$10$dummypasswordhash1234567890123456789012', '321 Trần Hưng Đạo, Q.10, TP.HCM', 'Khách hàng'),
('9a52c883-f384-11f0-820f-0250d18a7895', NULL, 'Lê Hoàng Cường', '0923456789', 'lehoangcuong.demo@gmail.com', '1992-03-10', '$2b$10$dummypasswordhash1234567890123456789012', '789 Hai Bà Trưng, Q.5, TP.HCM', 'Khách hàng'),
('9a502a33-f384-11f0-820f-0250d18a7895', NULL, 'Trần Thị Bích', '0912345678', 'tranthbich.demo@gmail.com', '1985-08-20', '$2b$10$dummypasswordhash1234567890123456789012', '456 Lê Lợi, Q.3, TP.HCM', 'Khách hàng');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichhen`
--

DROP TABLE IF EXISTS `lichhen`;
CREATE TABLE IF NOT EXISTS `lichhen` (
  `MaLichHen` varchar(36) NOT NULL DEFAULT (uuid()),
  `GhiChu` varchar(200) DEFAULT NULL,
  `MaDichVu` varchar(36) NOT NULL,
  `MaBacSi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `GioHen` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '8:00 - 10:00',
  `NgayHen` date NOT NULL,
  `TinhTrang` enum('Chờ xác nhận','Đã xác nhận','Không đến','Hoàn thành','Đã hủy','Đang khám') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Chờ xác nhận',
  `MaKhachHang` varchar(36) NOT NULL,
  PRIMARY KEY (`MaLichHen`),
  KEY `MaKhachHang` (`MaKhachHang`),
  KEY `fk_lichhen_bacsi` (`MaBacSi`),
  KEY `fk_lichhen_dichvu` (`MaDichVu`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `lichhen`
--

INSERT INTO `lichhen` (`MaLichHen`, `GhiChu`, `MaDichVu`, `MaBacSi`, `GioHen`, `NgayHen`, `TinhTrang`, `MaKhachHang`) VALUES
('9aab7ccb-f384-11f0-820f-0250d18a7895', 'Tẩy trắng răng. Khách hàng hoãn lại', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', '9a6c3583-f384-11f0-820f-0250d18a7895', '09:00 - 10:00', '2026-01-14', 'Đã hủy', '9a554736-f384-11f0-820f-0250d18a7895'),
('9ac76dc1-f384-11f0-820f-0250d18a7895', 'Khách vãng lai - không đặt lịch trước', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a68875c-f384-11f0-820f-0250d18a7895', '10:00 - 10:30', '2026-01-15', '', '9a5b0d63-f384-11f0-820f-0250d18a7895'),
('9aab7ac6-f384-11f0-820f-0250d18a7895', 'Kiểm tra răng định kỳ', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a68875c-f384-11f0-820f-0250d18a7895', '08:30 - 09:00', '2026-01-22', 'Chờ xác nhận', '9a52c883-f384-11f0-820f-0250d18a7895'),
('9aab7b6e-f384-11f0-820f-0250d18a7895', 'Trám răng cửa bị sứt. Bị sứt do ngã', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32', '9a6ea003-f384-11f0-820f-0250d18a7895', '11:00 - 11:45', '2026-01-22', 'Chờ xác nhận', '9a580a1c-f384-11f0-820f-0250d18a7895'),
('9aab7941-f384-11f0-820f-0250d18a7895', 'Vệ sinh răng miệng định kỳ', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', '9a6ea003-f384-11f0-820f-0250d18a7895', '09:30 - 10:15', '2026-01-20', 'Đã xác nhận', '9a662268-f384-11f0-820f-0250d18a7895'),
('fc6371fe-efa2-11f0-af03-0250d18a7895', '', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '13:30 - 15:00', '2026-01-16', 'Hoàn thành', '438e098c-b873-11f0-ad15-0250d18a7895'),
('8d7559a6-e9e1-11f0-8bc3-0250d18a7895', '', 'p15ebc99-9c0b-4ef9-bb6d-6bb9bd380a16', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '09:00 - 11:00', '2026-01-10', 'Đang khám', 'add82e1c-c135-11f0-8b9c-0250d18a7895'),
('67782c29-e9e0-11f0-8bc3-0250d18a7895', '', 'n13ebc99-9c0b-4ef9-bb6d-6bb9bd380a14', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '08:30 - 10:00', '2026-01-08', 'Hoàn thành', 'add82e1c-c135-11f0-8b9c-0250d18a7895'),
('9aab7be1-f384-11f0-820f-0250d18a7895', 'Vệ sinh răng miệng. Khách hàng bận đột xuất', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', '9a68875c-f384-11f0-820f-0250d18a7895', '15:00 - 15:45', '2026-01-13', 'Đã hủy', '9a502a33-f384-11f0-820f-0250d18a7895'),
('9aab79ba-f384-11f0-820f-0250d18a7895', 'Tái khám niềng răng. Đã niềng được 3 tháng', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30', '9a6c3583-f384-11f0-820f-0250d18a7895', '10:00 - 11:00', '2026-01-21', 'Chờ xác nhận', '9a4d351d-f384-11f0-820f-0250d18a7895'),
('9aab76a2-f384-11f0-820f-0250d18a7895', 'Trám răng sâu. Răng hàm dưới bên trái', 'f31ebc99-9c0b-4ef9-bb6d-6bb9bd380a32', '9a6ea003-f384-11f0-820f-0250d18a7895', '10:30 - 11:15', '2026-01-18', 'Đã xác nhận', '9a5d86ac-f384-11f0-820f-0250d18a7895'),
('9aab77a5-f384-11f0-820f-0250d18a7895', 'Tư vấn tẩy trắng răng. Muốn biết giá và quy trình', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', '9a6c3583-f384-11f0-820f-0250d18a7895', '08:00 - 09:00', '2026-01-19', 'Đã xác nhận', '9a60830a-f384-11f0-820f-0250d18a7895'),
('9aab7811-f384-11f0-820f-0250d18a7895', 'Cấy ghép implant răng số 6. Tư vấn phương án điều trị', 'g32ebc99-9c0b-4ef9-bb6d-6bb9bd380a33', '9a68875c-f384-11f0-820f-0250d18a7895', '14:00 - 15:30', '2026-01-19', 'Đã xác nhận', '9a632480-f384-11f0-820f-0250d18a7895'),
('9aab755f-f384-11f0-820f-0250d18a7895', 'Đau răng cấp. Khách hàng đang dùng thuốc giảm đau', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a68875c-f384-11f0-820f-0250d18a7895', '09:00 - 09:30', '2026-01-18', 'Đã xác nhận', '9a5b0d63-f384-11f0-820f-0250d18a7895'),
('9aa04f5a-f384-11f0-820f-0250d18a7895', 'Nhổ răng khôn. Răng khôn bị mọc lệch', 'b27ebc99-9c0b-4ef9-bb6d-6bb9bd380a28', '9a6ea003-f384-11f0-820f-0250d18a7895', '14:00 - 15:00', '2026-01-11', '', '9a554736-f384-11f0-820f-0250d18a7895'),
('9aa402c8-f384-11f0-820f-0250d18a7895', 'Niềng răng tái khám. Kiểm tra tiến độ niềng', 'd29ebc99-9c0b-4ef9-bb6d-6bb9bd380a30', '9a6c3583-f384-11f0-820f-0250d18a7895', '08:30 - 09:30', '2026-01-12', '', '9a580a1c-f384-11f0-820f-0250d18a7895'),
('9a9dad0e-f384-11f0-820f-0250d18a7895', 'Lấy cao răng định kỳ', 'e30ebc99-9c0b-4ef9-bb6d-6bb9bd380a31', '9a68875c-f384-11f0-820f-0250d18a7895', '10:00 - 10:45', '2026-01-11', '', '9a52c883-f384-11f0-820f-0250d18a7895'),
('9a971b0d-f384-11f0-820f-0250d18a7895', 'Đau răng hàm trên bên phải. Khách hàng đã đến khám đúng giờ', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a68875c-f384-11f0-820f-0250d18a7895', '08:00 - 08:30', '2026-01-10', '', '9a4d351d-f384-11f0-820f-0250d18a7895'),
('9a9a08eb-f384-11f0-820f-0250d18a7895', 'Muốn tẩy trắng răng. Tư vấn quy trình tẩy trắng', 'c28ebc99-9c0b-4ef9-bb6d-6bb9bd380a29', '9a6c3583-f384-11f0-820f-0250d18a7895', '09:30 - 10:30', '2026-01-10', '', '9a502a33-f384-11f0-820f-0250d18a7895'),
('9aca33a4-f384-11f0-820f-0250d18a7895', 'Khách vãng lai - không đặt lịch trước', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a6ea003-f384-11f0-820f-0250d18a7895', '11:00 - 11:30', '2026-01-15', '', '9a5d86ac-f384-11f0-820f-0250d18a7895'),
('9accd558-f384-11f0-820f-0250d18a7895', 'Khách vãng lai - không đặt lịch trước', 'a26ebc99-9c0b-4ef9-bb6d-6bb9bd380a27', '9a6c3583-f384-11f0-820f-0250d18a7895', '15:00 - 15:30', '2026-01-16', '', '9a60830a-f384-11f0-820f-0250d18a7895');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichlamviec`
--

DROP TABLE IF EXISTS `lichlamviec`;
CREATE TABLE IF NOT EXISTS `lichlamviec` (
  `MaLichLamViec` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT (uuid()),
  `MaBacSi` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ThuTrongTuan` enum('Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy','Chủ Nhật') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MaLichLamViec`),
  UNIQUE KEY `Unique_BacSi_Thu` (`MaBacSi`,`ThuTrongTuan`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `lichlamviec`
--

INSERT INTO `lichlamviec` (`MaLichLamViec`, `MaBacSi`, `ThuTrongTuan`) VALUES
('cc33dd44-ee55-66ff-77aa-88bb99cc00dd', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Thứ Ba'),
('dd44ee55-ff66-77aa-88bb-99cc00dd11ee', '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e', 'Thứ Năm'),
('ee55ff66-aa77-88bb-99cc-00dd11ee22ff', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Thứ Hai'),
('ff66aa77-bb88-99cc-00dd-11ee22ff33aa', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', 'Thứ Sáu'),
('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6e', '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g', 'Thứ Bảy'),
('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7f', '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9g0h', 'Chủ Nhật'),
('95d65203-c901-11f0-a92b-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Thứ Hai'),
('9c9e3dec-c901-11f0-a92b-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Thứ Năm'),
('9df15199-c901-11f0-a92b-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Thứ Sáu'),
('9f2f42e8-c901-11f0-a92b-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'Thứ Bảy');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `lichnghiphongkham`
--

DROP TABLE IF EXISTS `lichnghiphongkham`;
CREATE TABLE IF NOT EXISTS `lichnghiphongkham` (
  `MaLichNghi` varchar(36) NOT NULL DEFAULT (uuid()),
  `TenNgayLe` varchar(100) NOT NULL COMMENT 'Tên ngày lễ, ví dụ: Tết Nguyên Đán, Quốc Khánh...',
  `NgayBatDau` date NOT NULL COMMENT 'Ngày bắt đầu nghỉ',
  `NgayKetThuc` date NOT NULL COMMENT 'Ngày kết thúc nghỉ',
  `GhiChu` varchar(200) DEFAULT NULL COMMENT 'Ghi chú thêm',
  `NamApDung` int NOT NULL COMMENT 'Năm áp dụng',
  PRIMARY KEY (`MaLichNghi`),
  KEY `idx_ngay` (`NgayBatDau`,`NgayKetThuc`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `lichnghiphongkham`
--

INSERT INTO `lichnghiphongkham` (`MaLichNghi`, `TenNgayLe`, `NgayBatDau`, `NgayKetThuc`, `GhiChu`, `NamApDung`) VALUES
('a3ee9c34-e951-11f0-8277-0250d18a7895', 'Tết Nguyên Đán 2026', '2026-02-14', '2026-02-22', 'Nghỉ Tết Âm lịch 9 ngày (từ 27 Tết đến mùng 7)', 2026),
('a3ee9fec-e951-11f0-8277-0250d18a7895', 'Giỗ Tổ Hùng Vương', '2026-04-28', '2026-04-28', 'Nghỉ 1 ngày', 2026),
('a3eea0b8-e951-11f0-8277-0250d18a7895', 'Ngày Giải phóng miền Nam & Quốc tế Lao động', '2026-04-30', '2026-05-03', 'Nghỉ 4 ngày (bù cuối tuần)', 2026),
('a3eea13e-e951-11f0-8277-0250d18a7895', 'Quốc Khánh 2/9', '2026-09-02', '2026-09-03', 'Nghỉ 2 ngày', 2026),
('a3eea1b2-e951-11f0-8277-0250d18a7895', 'Tết Dương lịch 2027', '2027-01-01', '2027-01-03', 'Nghỉ 3 ngày đón năm mới', 2027),
('a3f29734-e951-11f0-8277-0250d18a7895', 'Tết Dương lịch 2025', '2025-01-01', '2025-01-01', 'Nghỉ 1 ngày', 2025),
('a3f29939-e951-11f0-8277-0250d18a7895', 'Tết Nguyên Đán 2025', '2025-01-25', '2025-02-02', 'Nghỉ Tết Âm lịch 9 ngày', 2025),
('a3f29ee4-e951-11f0-8277-0250d18a7895', 'Giỗ Tổ Hùng Vương 2025', '2025-04-07', '2025-04-07', 'Nghỉ 1 ngày', 2025),
('a3f29f7e-e951-11f0-8277-0250d18a7895', 'Ngày Giải phóng & Quốc tế Lao động 2025', '2025-04-30', '2025-05-03', 'Nghỉ 4 ngày', 2025),
('a3f29fc0-e951-11f0-8277-0250d18a7895', 'Quốc Khánh 2/9/2025', '2025-09-01', '2025-09-03', 'Nghỉ 3 ngày', 2025),
('79234b17-efa9-11f0-af03-0250d18a7895', 'nghỉ cho vui', '2026-02-25', '2026-03-04', 'nghỉ đầu tháng', 2026);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `loaidichvu`
--

DROP TABLE IF EXISTS `loaidichvu`;
CREATE TABLE IF NOT EXISTS `loaidichvu` (
  `MaLoaiDV` varchar(36) NOT NULL DEFAULT (uuid()),
  `TenLoaiDV` varchar(100) NOT NULL,
  `Slug` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MoTa` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`MaLoaiDV`),
  UNIQUE KEY `TenLoaiDV` (`TenLoaiDV`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `loaidichvu`
--

INSERT INTO `loaidichvu` (`MaLoaiDV`, `TenLoaiDV`, `Slug`, `MoTa`) VALUES
('b1eebc99-9c0b-4ef9-bb6d-6bb9bd380a22', 'Nha khoa Tổng quát', 'nha-khoa-tong-quat', 'Các dịch vụ điều trị cơ bản như trám, nhổ, cạo vôi.'),
('c2eebc99-9c0b-4ef9-bb6d-6bb9bd380a33', 'Nha khoa Thẩm mỹ', 'nha-khoa-tham-my', 'Các dịch vụ cải thiện vẻ ngoài như tẩy trắng, veneer.'),
('d3eebc99-9c0b-4ef9-bb6d-6bb9bd380a44', 'Chỉnh nha', 'chinh-nha', 'Điều trị liên quan đến niềng răng và căn chỉnh khớp cắn.'),
('e4eebc99-9c0b-4ef9-bb6d-6bb9bd380a55', 'Cấy ghép Implant', 'cay-ghep-implant', 'Dịch vụ phục hình răng bằng cấy ghép trụ titanium.'),
('58c8f3aa-d5ca-11f0-8312-0250d18a7895', 'Nha khoa gia đình', 'nha-khoa-gia-dinh', 'Chăm sóc răng miệng toàn diện cho mọi lứa tuổi và gia đình.'),
('62324f25-d5ca-11f0-8312-0250d18a7895', 'Vệ sinh răng miệng', 've-sinh-rang-mieng', 'Làm sạch chuyên nghiệp và chăm sóc phòng ngừa để giữ răng khỏe mạnh\n');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ngaynghibacsi`
--

DROP TABLE IF EXISTS `ngaynghibacsi`;
CREATE TABLE IF NOT EXISTS `ngaynghibacsi` (
  `MaNgayNghiBS` varchar(36) NOT NULL DEFAULT (uuid()),
  `MaBacSi` varchar(50) NOT NULL,
  `NgayNghi` date NOT NULL,
  PRIMARY KEY (`MaNgayNghiBS`),
  KEY `MaBacSi` (`MaBacSi`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `ngaynghibacsi`
--

INSERT INTO `ngaynghibacsi` (`MaNgayNghiBS`, `MaBacSi`, `NgayNghi`) VALUES
('986aef08-e581-11f0-9ed5-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '2026-01-03'),
('b282a90f-e955-11f0-8277-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '2026-01-09');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE IF NOT EXISTS `nguoidung` (
  `MaNguoiDung` varchar(36) NOT NULL DEFAULT (uuid()),
  `AnhDaiDien` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `HoTen` varchar(100) NOT NULL,
  `NgaySinh` date NOT NULL,
  `SDT` varchar(15) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `MatKhau` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DiaChi` varchar(200) NOT NULL,
  `VaiTro` enum('Khách hàng','Bác sĩ','Lễ tân','Quản lý') NOT NULL,
  PRIMARY KEY (`MaNguoiDung`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `AnhDaiDien`, `HoTen`, `NgaySinh`, `SDT`, `Email`, `MatKhau`, `DiaChi`, `VaiTro`) VALUES
('184dd7fd-b7b2-11f0-ad15-0250d18a7895', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/nguoidung/avatar_184dd7fd-b7b2-11f0-ad15-0250d18a7895.jpg', 'Hoàng Quân', '2003-10-12', '0911341117', 'tnhq1210@gmail.com', '$2b$10$1Y37EpoSoo9kY43DBbxcIe/FX97qbugVPJhv6UHHyGdlujMZOrUsu', '10 Phan Chu Trinh, Q.1, TP.HCM', 'Quản lý'),
('076208d7-c4a7-11f0-a391-0250d18a7895', 'https://storage.googleapis.com/phongkhamnhakhoahoangquan.firebasestorage.app/avatars/nguoidung/avatar_076208d7-c4a7-11f0-a391-0250d18a7895.jpg', 'Nguyễn Huynh', '2025-11-07', '0811223344', 'tnhq121@gmail.com', '$2b$10$APlGT.XstPN/ghXMjIgJ.etQsokWBrPo1AS/numecQGmPYnRAd7Ty', '10 Phan Chu Trinh, Q.1, TP.HCM', 'Lễ tân');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieukham`
--

DROP TABLE IF EXISTS `phieukham`;
CREATE TABLE IF NOT EXISTS `phieukham` (
  `MaPhieuKham` varchar(36) NOT NULL DEFAULT (uuid()),
  `NgayKham` date NOT NULL,
  `ChuanDoan` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `GhiChu` varchar(200) DEFAULT NULL,
  `TrangThai` enum('Chưa khám','Đã khám','Đã hủy') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Chưa khám',
  `MaLichHen` varchar(36) NOT NULL,
  `MaBacSi` varchar(36) NOT NULL,
  `MaKhachHang` varchar(36) NOT NULL,
  PRIMARY KEY (`MaPhieuKham`),
  UNIQUE KEY `MaLichHen` (`MaLichHen`),
  KEY `MaKhachHang` (`MaKhachHang`) USING BTREE,
  KEY `MaBacSi` (`MaBacSi`) USING BTREE
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `phieukham`
--

INSERT INTO `phieukham` (`MaPhieuKham`, `NgayKham`, `ChuanDoan`, `GhiChu`, `TrangThai`, `MaLichHen`, `MaBacSi`, `MaKhachHang`) VALUES
('5357fd37-f384-11f0-820f-0250d18a7895', '2026-01-10', 'Sâu răng hàm 6 mức độ vừa. Đã trám răng bằng composite.', 'Hẹn tái khám sau 1 tháng. Tránh ăn cứng 24h.', 'Đã khám', '533c6399-f384-11f0-820f-0250d18a7895', '530a41a8-f384-11f0-820f-0250d18a7895', '52ebd808-f384-11f0-820f-0250d18a7895'),
('cffa7cdc-f14f-11f0-a030-0250d18a7895', '2026-01-12', NULL, NULL, 'Chưa khám', '0d486f73-efa3-11f0-af03-0250d18a7895', '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', '438e098c-b873-11f0-ad15-0250d18a7895'),
('fff6bb8b-f14f-11f0-a030-0250d18a7895', '2026-01-16', 'Viêm nướu nhẹ. Tư vấn vệ sinh răng miệng đúng cách.', 'Khách hàng cần đánh răng 2 lần/ngày và dùng nước súc.', 'Đã khám', 'fc6371fe-efa2-11f0-af03-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '438e098c-b873-11f0-ad15-0250d18a7895'),
('08f02d46-f150-11f0-a030-0250d18a7895', '2026-01-17', NULL, NULL, 'Chưa khám', '0445df8f-efa3-11f0-af03-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', '438e098c-b873-11f0-ad15-0250d18a7895'),
('93e5de1a-e9e1-11f0-8bc3-0250d18a7895', '2026-01-10', NULL, NULL, 'Chưa khám', '8d7559a6-e9e1-11f0-8bc3-0250d18a7895', '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'add82e1c-c135-11f0-8b9c-0250d18a7895'),
('9abddd2f-f384-11f0-820f-0250d18a7895', '2026-01-15', 'Viêm tủy răng hàm 7 trên phải. Đã làm sạch và đặt thuốc.', 'Hẹn lần 2 sau 3 ngày để điều trị tủy.', 'Đã khám', '9ac76dc1-f384-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', '9a5b0d63-f384-11f0-820f-0250d18a7895'),
('9abb1b0b-f384-11f0-820f-0250d18a7895', '2026-01-12', 'Tái khám niềng răng tháng 6. Răng di chuyển tốt.', 'Đã thay dây cung. Hẹn tái khám sau 1 tháng.', 'Đã khám', '9aa402c8-f384-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', '9a580a1c-f384-11f0-820f-0250d18a7895'),
('9ab8689a-f384-11f0-820f-0250d18a7895', '2026-01-11', 'Răng khôn hàm dưới mọc lệch. Đã nhổ thành công.', 'Tái khám sau 7 ngày để cắt chỉ. Tránh nóng.', 'Đã khám', '9aa04f5a-f384-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', '9a554736-f384-11f0-820f-0250d18a7895'),
('9ab5730f-f384-11f0-820f-0250d18a7895', '2026-01-11', 'Cao răng và mảng bám nhiều. Đã lấy cao răng toàn diện.', 'Nên vệ sinh răng miệng định kỳ 6 tháng/lần.', 'Đã khám', '9a9dad0e-f384-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', '9a52c883-f384-11f0-820f-0250d18a7895'),
('9ab2d501-f384-11f0-820f-0250d18a7895', '2026-01-10', 'Răng ố vàng do uống trà cà phê. Tư vấn tẩy trắng.', 'Khách đồng ý làm tẩy trắng răng tuần sau.', 'Đã khám', '9a9a08eb-f384-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', '9a502a33-f384-11f0-820f-0250d18a7895'),
('9aaea529-f384-11f0-820f-0250d18a7895', '2026-01-10', 'Sâu răng hàm 6. Đã trám composite, làm sạch kín.', 'Hẹn tái khám sau 1 tháng. Hạn chế ăn cứng.', 'Đã khám', '9a971b0d-f384-11f0-820f-0250d18a7895', '9a68875c-f384-11f0-820f-0250d18a7895', '9a4d351d-f384-11f0-820f-0250d18a7895'),
('9ac1ab0a-f384-11f0-820f-0250d18a7895', '2026-01-15', 'Khám tổng quát răng miệng. Răng khỏe mạnh, có chút cao răng.', 'Đề xuất lấy cao răng trong lần khám tiếp theo.', 'Đã khám', '9aca33a4-f384-11f0-820f-0250d18a7895', '9a6ea003-f384-11f0-820f-0250d18a7895', '9a5d86ac-f384-11f0-820f-0250d18a7895'),
('9ac41eef-f384-11f0-820f-0250d18a7895', '2026-01-16', 'Mòn men răng do nghiến răng về đêm. Đề xuất làm máng.', 'Đã lấy dấu hàm để làm máng chống nghiến.', 'Đã khám', '9accd558-f384-11f0-820f-0250d18a7895', '9a6c3583-f384-11f0-820f-0250d18a7895', '9a60830a-f384-11f0-820f-0250d18a7895');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
