import { api } from "./api";

export const productService = {
  async findAll({ nome = "", page = 0, size = 20 } = {}) {
    const { data } = await api.get("/produtos", { params: { nome: nome || undefined, page, size } });
    return data; // Page<ProductResponse>
  },

  async findById(id) {
    const { data } = await api.get(`/produtos/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/produtos", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.put(`/produtos/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/produtos/${id}`);
  },
};
