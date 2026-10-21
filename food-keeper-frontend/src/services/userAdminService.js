// src/services/userAdminService.js
import { api } from "./api";

export const userAdminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  changeUserRole: async (userId, role) => {
    const response = await api.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/status`);
    return response.data;
  }
};