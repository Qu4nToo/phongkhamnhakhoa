
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

export const saveAuthData = (accessToken: string, refreshToken: string) => {

  localStorage.setItem('accessToken', accessToken);
  

  localStorage.setItem('refreshToken', refreshToken);
  
  const userData = decodeToken(accessToken);
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('user_info');
  window.location.href = '/Login';
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
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
  if (!accessToken) return null;
  
  const userData = decodeToken(accessToken);
  
  if (userData) {
    sessionStorage.setItem('user_info', JSON.stringify(userData));
  }
  
  return userData;
};

export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};
