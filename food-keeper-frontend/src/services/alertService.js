import { api } from "./api";

export const alertService = {
  async findAll() {
    const { data } = await api.get("/alertas");
    return data;
  },

  async findUnread() {
    const { data } = await api.get("/alertas/nao-lidos");
    return data;
  },

  async markAsRead(id) {
    await api.patch(`/alertas/${id}/ler`);
  },

  async generateNow() {
    await api.post("/alertas/gerar");
  },
};
