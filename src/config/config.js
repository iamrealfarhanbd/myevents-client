// Centralized configuration for the application
const config = {
  // API URLs
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  publicUrl: import.meta.env.VITE_PUBLIC_URL || 'http://localhost:5173',
  
  // App Info
  appName: import.meta.env.VITE_APP_NAME || 'EventPro',
  appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Event Management & Booking System',
  
  // API Endpoints
  endpoints: {
    auth: {
      register: '/auth/register',
      login: '/auth/login',
    },
    polls: {
      list: '/polls',
      create: '/polls',
      get: (id) => `/polls/${id}`,
      update: (id) => `/polls/${id}`,
      delete: (id) => `/polls/${id}`,
    },
    public: {
      getPoll: (id) => `/public/poll/${id}`,
      submit: (id) => `/public/submit/${id}`,
    },
    results: {
      get: (id) => `/results/${id}`,
    },
  },
};

export default config;
