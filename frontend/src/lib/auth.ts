import { jwtDecode } from 'jwt-decode';


export const saveAuthData = (accessToken: string, refreshToken: string) => {

  localStorage.setItem('accessToken', accessToken);
  

  localStorage.setItem('refreshToken', refreshToken);
  

  const userData = jwtDecode(accessToken);
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
};
export const saveAuthDataDoctor = (accessToken: string, refreshToken: string) => {

  localStorage.setItem('accessTokenDoctor', accessToken);
  

  localStorage.setItem('refreshTokenDoctor', refreshToken);
  
  const userData = jwtDecode(accessToken);
  if (userData) {
    sessionStorage.setItem('doctor_info', JSON.stringify(userData));
  }
};


export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user_info');
  window.location.href = '/';
};

export const logoutDoctor = () => {
  localStorage.removeItem('accessTokenDoctor');
  localStorage.removeItem('refreshTokenDoctor');
  sessionStorage.removeItem('doctor_info');
  window.location.href = '/';
};


export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};
export const isAuthenticatedDoctor = (): boolean => {
  return !!localStorage.getItem('accessTokenDoctor');
};


export const getCurrentUser = () => {

  const cachedUser = sessionStorage.getItem('user_info');
  if (cachedUser) {
    try {
      return JSON.parse(cachedUser);
    } catch (error) {
      console.error('Error parsing cached user:', error);
    }
  }
  

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

export const getCurrentDoctor = () => {

  const cachedUser = sessionStorage.getItem('doctor_info');
  if (cachedUser) {
    try {
      return JSON.parse(cachedUser);
    } catch (error) {
      console.error('Error parsing cached doctor:', error);
    }
  }
  

  const accessToken = localStorage.getItem('accessTokenDoctor');
  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);
      sessionStorage.setItem('doctor_info', JSON.stringify(decoded));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  
  return null;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};


export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};
