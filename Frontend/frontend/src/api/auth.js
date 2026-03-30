import axiosInstance from './axiosInstance';

export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register/', data),
  login: (data) => axiosInstance.post('/auth/login/', data),
  logout: () => axiosInstance.post('/auth/logout/'),
  refreshToken: (data) => axiosInstance.post('/auth/token/refresh/', data),
  changePassword: (data) => axiosInstance.post('/auth/change-password/', data),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password/', data),
};