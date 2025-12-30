
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

// Tạo instance riêng cho bác sĩ
const axiosDoctor = axios.create();
// Thêm accessTokenDoctor vào mọi request
axiosDoctor.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessTokenDoctor');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosDoctor.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (originalRequest.skipAuthRefresh) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosDoctor(originalRequest);
        }).catch(err => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshTokenDoctor');
      if (!refreshToken) {
        handleLogoutDoctor();
        return Promise.reject(error);
      }
      try {
        const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        if (response.ok) {
          const data = await response.json();
          const newAccessToken = data.accessToken;
          localStorage.setItem('accessTokenDoctor', newAccessToken);
          const userData = jwtDecode(newAccessToken);
          if (userData) {
            sessionStorage.setItem('doctor_info', JSON.stringify(userData));
          }
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosDoctor(originalRequest);
        } else {
          processQueue(error, null);
          handleLogoutDoctor();
          return Promise.reject(error);
        }
      } catch (err) {
        processQueue(err, null);
        handleLogoutDoctor();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response?.status === 403) {
      toast.error('Bạn không có quyền truy cập!');
    }
    return Promise.reject(error);
  }
);

const handleLogoutDoctor = () => {
  localStorage.removeItem('accessTokenDoctor');
  localStorage.removeItem('refreshTokenDoctor');
  sessionStorage.removeItem('doctor_info');
  toast.error('Phiên đăng nhập bác sĩ hết hạn. Vui lòng đăng nhập lại!');
  setTimeout(() => {
    window.location.href = '/DangNhap';
  }, 1500);
};

export default axiosDoctor;
