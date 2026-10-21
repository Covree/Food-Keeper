import { api } from "./api";

export const batchService = {
  async findById(id) {
    const { data } = await api.get(`/lotes/${id}`);
    return data;
  },

  async findExpiring(dias = 7) {
    const { data } = await api.get("/lotes/vencendo", { params: { dias } });
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/lotes", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/lotes/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/lotes/${id}`);
  },
};
