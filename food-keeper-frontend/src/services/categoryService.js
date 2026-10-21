import { api } from "./api";

export const categoryService = {
  async findAll() {
    const { data } = await api.get("/categorias");
    return data;
  },

  async create(name) {
    const { data } = await api.post("/categorias", { name });
    return data;
  },

  async remove(id) {
    await api.delete(`/categorias/${id}`);
  },
};
