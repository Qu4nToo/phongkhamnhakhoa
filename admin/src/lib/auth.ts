// Hàm giải mã token JWT (decode base64)
const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Hàm lưu access token và refresh token
export const saveAuthData = (accessToken: string, refreshToken: string) => {
  // Lưu access token
  localStorage.setItem('accessToken', accessToken);
  
  // Lưu refresh token
  localStorage.setItem('refreshToken', refreshToken);
  
  // Giải mã và cache thông tin user
  const userData = decodeToken(accessToken);
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
};

// Hàm đăng xuất
export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user_info');
  window.location.href = '/Login';
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
  if (!accessToken) return null;
  
  const userData = decodeToken(accessToken);
  
  // Cache lại cho lần sau
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
  
  return userData;
};

// Hàm lấy access token
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Hàm lấy refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};
