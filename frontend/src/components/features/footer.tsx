import React from 'react';
// Đã loại bỏ import từ 'react-icons/fa' và thay bằng SVG nội tuyến
// const { FaFacebookF, FaYoutube, FaEnvelope } = require('react-icons/fa'); 

// === SVG ICONS THAY THẾ CHO react-icons/fa ===

const IconFacebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V363.5h-55V256h55v-92.88c0-51.78 35.29-76.88 86.43-76.88 15.39 0 32.32 2.76 35.8 5.04v60.13h-34.6c-27.47 0-38.38 21.08-38.38 41.53V256h68.78l-10.97 107.5H301V501.38C413.31 482.38 504 379.78 504 256z"/>
  </svg>
);

const IconYoutube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-4 h-4">
    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.88C458.828 64 288 64 288 64S117.172 64 74.629 75.203c-23.497 6.604-42.003 25.23-48.284 48.88C16 160.118 16 256 16 256s0 95.882 8.345 131.917c6.281 23.65 24.787 42.276 48.284 48.88C117.172 448 288 448 288 448s170.828 0 213.371-11.203c23.497-6.604 42.003-25.23 48.284-48.88C560 351.882 560 256 560 256s0-95.882-10.345-131.917zM232 352V160l144 96-144 96z"/>
  </svg>
);

const IconEnvelope = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-4 h-4">
    <path d="M480 96H32c-17.6 0-32 14.4-32 32v256c0 17.6 14.4 32 32 32h448c17.6 0 32-14.4 32-32V128c0-17.6-14.4-32-32-32zM450.4 128L256 264.8 61.6 128H450.4zm0 256H61.6L256 230.2 450.4 384z"/>
  </svg>
);
// ==========================================


const footerLinks = {
  gioiThieu: [
    { name: "Về Chúng Tôi", href: "#" },
    { name: "Bảng Giá Dịch Vụ", href: "#" },
    { name: "Tin tức sự kiện", href: "#" },
    { name: "Kiến Thức Nha Khoa", href: "/kienthucnhakhoa" },
    { name: "Chính sách bảo mật", href: "#" },
    { name: "Tuyển dụng", href: "#" },
  ],
  heThong: [
    { name: "Tp. Hồ Chí Minh", href: "#" },
    { name: "Hà Nội", href: "#" },
    { name: "Các Tỉnh", href: "#" },
  ],
};

const Footer = () => {
  // Array chứa các Component SVG đã định nghĩa
  const SocialIcons = [IconFacebook, IconYoutube, IconEnvelope];

  return (
    // Container chính với màu nền Dark Blue (#3A3D62 hoặc tương tự)
    <footer className="bg-[#004576] text-white">
      {/* ĐIỀU CHỈNH LẦN 2: Giảm padding dọc từ py-8 lg:py-10 xuống py-6 lg:py-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Phần Nội dung chính - Chia làm 4 cột trên Desktop */}
        {/* Giữ nguyên gap để đảm bảo cấu trúc cột không bị ảnh hưởng */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* Cột 1: Thông tin Logo và Công ty */}
          {/* ĐIỀU CHỈNH LẦN 2: Giảm khoảng cách từ space-y-3 xuống space-y-2 */}
          <div className="space-y-2">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              {/* ĐIỀU CHỈNH LẦN 3: Thay thế div placeholder bằng thẻ img và chỉnh kích thước logo */}
              <img 
                src="/logo.png" 
                alt="Nha Khoa Parkway Logo"
                // Kích thước nhỏ hơn (w-16 h-16) để logo gọn hơn trong footer
                className="w-16 h-16 rounded-full object-cover" 
              />
              <p className="text-xl font-bold">NHA KHOA PARKWAY</p>
            </div>
            
            {/* DMCA Badge */}
            <div className="py-2">
              {/* Ảnh DMCA */}
              <p className="text-xs text-gray-300 border border-gray-300 p-1 inline-block">PROTECTED BY DMCA.COM</p>
            </div>

            {/* ĐIỀU CHỈNH LẦN 2: Giảm pt-3 xuống pt-2 */}
            <p className="text-sm font-semibold pt-2">Công ty chủ quản: CÔNG TY CỔ PHẦN Y TẾ PW</p>
            <p className="text-sm">Địa chỉ: 215 Nam Kỳ Khởi Nghĩa, Phường Võ Thị Sáu, Q3, thành phố Hồ Chí Minh.</p>
            <p className="text-sm">Email: it@nhakhoaparkway.com</p>
            
            {/* ĐIỀU CHỈNH LẦN 2: Giảm pt-3 xuống pt-2 */}
            <p className="text-xs pt-2">
              CMSDN: 0315575273 do Sở Kế hoạch và Đầu tư Thành phố Hồ Chí Minh cấp lần đầu 20/03/2019, sửa đổi lần thứ 7 ngày 09/06/2022.
            </p>
            {/* ĐIỀU CHỈNH LẦN 2: Giảm pt-1 xuống pt-0 (không cần padding trên) */}
            <p className="text-xs italic pt-0">Hiệu quả điều trị phụ thuộc vào cơ địa mỗi người (*)</p>
          </div>

          {/* Cột 2: Giới thiệu */}
          <div>
            <h3 className="text-lg font-bold mb-4">Giới thiệu</h3>
            {/* ĐIỀU CHỈNH LẦN 2: Giảm khoảng cách từ space-y-2 xuống space-y-1 */}
            <ul className="space-y-1">
              {footerLinks.gioiThieu.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-sm text-gray-300 hover:text-white transition duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hệ thống phòng khám */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hệ thống phòng khám</h3>
            {/* ĐIỀU CHỈNH LẦN 2: Giảm khoảng cách từ space-y-2 xuống space-y-1 */}
            <ul className="space-y-1">
              {footerLinks.heThong.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className="text-sm text-gray-300 hover:text-white transition duration-200"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Giờ làm việc */}
          {/* ĐIỀU CHỈNH LẦN 2: Giảm khoảng cách từ space-y-4 xuống space-y-3 */}
          <div className="space-y-3">
            
            {/* Liên hệ */}
            <div>
              <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
              <p className="text-sm font-semibold mb-3">HOTLINE: 1900 8059</p>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                {/* Thay thế [FaFacebookF, FaYoutube, FaEnvelope] bằng SocialIcons */}
                {SocialIcons.map((Icon, index) => (
                  <a 
                    key={index}
                    href="#" 
                    className="w-8 h-8 rounded-full border border-white flex items-center justify-center text-sm hover:bg-white hover:text-[#3A3D62] transition duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Giờ làm việc */}
            <div>
              <h3 className="text-lg font-bold mb-4">Giờ làm việc</h3>
              <p className="text-sm">
                TỪ 8:30 tới 18:30 tất cả các ngày trong tuần
              </p>
            </div>
          </div>

        </div>
        
      </div>
      
      {/* Footer đáy (Bottom Footer) */}
      {/* ĐIỀU CHỈNH LẦN 2: Giảm padding dọc từ py-3 xuống py-2 */}
      <div className="bg-[#02042c] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs">
          <p>
            Người chịu trách nhiệm nội dung Giám đốc Trần Nguyễn Hoàng Quân - SĐT: <span className="font-semibold">1900 8059</span>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
