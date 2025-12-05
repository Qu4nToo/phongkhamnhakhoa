import { jwtDecode } from 'jwt-decode';

// Hàm lưu access token và refresh token
export const saveAuthData = (accessToken: string, refreshToken: string) => {
  // Lưu access token
  localStorage.setItem('accessToken', accessToken);
  
  // Lưu refresh token
  localStorage.setItem('refreshToken', refreshToken);
  
  // Giải mã và cache thông tin user
  const userData = jwtDecode(accessToken);
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user_info');
  window.location.href = '/';
};

// Hàm kiểm tra user đã đăng nhập chưa
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Hàm lấy thông tin user (từ cache hoặc giải mã token)
export const getCurrentUser = () => {
  // Thử lấy từ cache trước
  const cachedUser = sessionStorage.getItem('user_info');
  if (cachedUser) {
    try {
      return JSON.parse(cachedUser);
    } catch (error) {
      console.error('Error parsing cached user:', error);
    }
  }
  
  // Nếu không có cache, giải mã access token
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      sessionStorage.setItem('user_info', JSON.stringify(decoded));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  return null;
};

// Hàm lấy access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Hàm lấy refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};
