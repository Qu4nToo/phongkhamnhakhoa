const jwt = require("jsonwebtoken");

const AuthController = {
  // API refresh access token
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
      }

      // Verify JWT refresh token
      jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, 
        (err, decoded) => {
          if (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
          }

          // Kiểm tra type để đảm bảo đây là refresh token
          if (decoded.type !== 'refresh') {
            return res.status(403).json({ message: "Invalid token type" });
          }

          // Tạo access token mới từ thông tin trong refresh token
          const { type, iat, exp, ...payload } = decoded;
          const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

          // Trả về access token mới
          res.status(200).json({
            accessToken: newAccessToken,
            message: "Token refreshed successfully"
          });
        }
      );

    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
};

module.exports = AuthController;
