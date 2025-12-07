import axios from 'axios';
import { toast } from 'sonner';
import { jwtDecode } from 'jwt-decode';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Cấu hình axios toàn cục - Tự động thêm access token vào mọi request
axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý response lỗi - Auto refresh token khi hết hạn
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Bỏ qua interceptor cho các request login/register
    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đợi trong queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        // Không có refresh token, logout
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Gọi API refresh token
        const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (response.ok) {
          const data = await response.json();
          const newAccessToken = data.accessToken;

          // Lưu access token mới
          localStorage.setItem('accessToken', newAccessToken);
          
          // Cập nhật cache user info
          const userData = jwtDecode(newAccessToken);
          if (userData) {
            sessionStorage.setItem('user_info', JSON.stringify(userData));
          }

          // Xử lý queue
          processQueue(null, newAccessToken);

          // Retry request ban đầu
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        } else {
          // Refresh token hết hạn hoặc invalid
          processQueue(error, null);
          handleLogout();
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        handleLogout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Lỗi 403 hoặc lỗi khác
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập!');
    }

    return Promise.reject(error);
  }
);

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user_info');
  toast.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!');
  setTimeout(() => {
    window.location.href = '/DangNhap';
  }, 1500);
};

export default axios;
