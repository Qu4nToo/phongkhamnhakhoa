'use client';

import { useEffect, useCallback } from 'react';
import { getAccessToken, getRefreshToken } from './auth';

// Tracking user activity
let lastActivity = Date.now();
let refreshTimer: NodeJS.Timeout | null = null;

const updateActivity = () => {
  lastActivity = Date.now();
};

// Check if user is still active (within last 5 minutes)
const isUserActive = (): boolean => {
  const inactiveTime = Date.now() - lastActivity;
  return inactiveTime < 5 * 60 * 1000; // 5 minutes
};

// Decode JWT to get expiry time
const getTokenExpiry = (token: string): number | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Refresh access token
const refreshAccessToken = async (): Promise<boolean> => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    const response = await fetch('http://localhost:5000/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (response.ok) {
      const data = await response.json();
      const newAccessToken = data.accessToken;

      // Save new access token
      localStorage.setItem('accessToken', newAccessToken);

      // Update cached user info
      const base64Url = newAccessToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const userData = JSON.parse(jsonPayload);
      sessionStorage.setItem('user_info', JSON.stringify(userData));

      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

// Setup proactive token refresh
const setupTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }

  const accessToken = getAccessToken();
  if (!accessToken) return;

  const expiry = getTokenExpiry(accessToken);
  if (!expiry) return;

  const now = Date.now();
  const timeUntilExpiry = expiry - now;

  // Refresh 2 minutes before expiry (15m - 2m = 13m)
  const refreshTime = timeUntilExpiry - 2 * 60 * 1000;

  if (refreshTime > 0) {
    refreshTimer = setTimeout(async () => {
      // Only refresh if user is active
      if (isUserActive()) {
        const success = await refreshAccessToken();
        if (success) {
          // Setup next refresh
          setupTokenRefresh();
        }
      }
    }, refreshTime);
  }
};

// Hook to use in layout
export const useTokenRefresh = () => {
  const handleActivity = useCallback(() => {
    updateActivity();
  }, []);

  useEffect(() => {
    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Setup token refresh
    setupTokenRefresh();

    // Auto-check token expiry mỗi 30 giây
    const checkTokenExpiry = setInterval(() => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      
      if (!accessToken || !refreshToken) {
        return;
      }

      const refreshExpiry = getTokenExpiry(refreshToken);
      const now = Date.now();

      if (refreshExpiry && refreshExpiry < now) {
        import('sonner').then(({ toast }) => {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!', {
            duration: 3000,
            position: 'top-center',
          });
        });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('user_info');
        setTimeout(() => {
          window.location.href = '/Login';
        }, 1500);
      }
    }, 30000); // Check every 30 seconds

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      clearInterval(checkTokenExpiry);
    };
  }, [handleActivity]);
};
