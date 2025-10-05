// utils/env.ts
export const ENV = {
  NODE_ENV: process.env.NODE_ENV,
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/login',
    SIGNUP: '/signup',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
  },
  USER: {
    CREATE: '/create-user',
    LIST: '/users',
    SINGLE: (id: string) => `/user/${id}`,
    PROFILE: '/profile',
    UPDATE: (id: string) => `/update-user/${id}`,
  },
  SHOES: {
    LIST: '/shoes',
    CREATE: '/shoes',
    UPDATE: (id: string) => `/shoes/${id}`,
    DELETE: (id: string) => `/shoes/${id}`,
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Example usage:
// getApiUrl(API_ENDPOINTS.AUTH.LOGIN) 
// => "https://fanstock-backend.onrender.com/api/v1/fanstock/auth/login"

// Environment-specific configuration
export const getConfig = () => ({
  apiUrl: API_BASE_URL,
  environment: ENV.NODE_ENV,
  isDevelopment: ENV.IS_DEVELOPMENT,
  enableLogging: ENV.IS_DEVELOPMENT,
});
