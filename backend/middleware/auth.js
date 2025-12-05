const jwt = require("jsonwebtoken");

// Middleware xác thực token - Kiểm tra user đã đăng nhập chưa
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Vui lòng đăng nhập để tiếp tục!" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
      }
      req.user = user; // Lưu thông tin user vào request
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server khi xác thực!" });
  }
};

// Middleware kiểm tra vai trò - Kiểm tra user có quyền truy cập không
const authenticateRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Kiểm tra user đã được xác thực chưa (phải chạy sau authenticateToken)
      if (!req.user) {
        return res.status(401).json({ 
          message: "Vui lòng đăng nhập để tiếp tục!" 
        });
      }

      // Kiểm tra role của user có trong danh sách cho phép không
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: "Bạn không có quyền truy cập chức năng này!" 
        });
      }

      next(); // User có quyền, cho phép tiếp tục
    } catch (error) {
      return res.status(500).json({ 
        message: "Lỗi server khi kiểm tra quyền!" 
      });
    }
  };
};

module.exports = { authenticateToken, authenticateRole };
