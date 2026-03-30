import axiosInstance from './axiosInstance';

export const employeesAPI = {
  list: (params) => axiosInstance.get('/employees/', { params }),
  create: (data) => axiosInstance.post('/employees/', data),
  getById: (id) => axiosInstance.get(`/employees/${id}/`),
  update: (id, data) => axiosInstance.put(`/employees/${id}/`, data),
  partialUpdate: (id, data) => axiosInstance.patch(`/employees/${id}/`, data),
  terminate: (id) => axiosInstance.delete(`/employees/${id}/`),
  getProfile: (id) => axiosInstance.get(`/employees/${id}/profile/`),
  search: (params) => axiosInstance.get('/employees/search/', { params }),
};