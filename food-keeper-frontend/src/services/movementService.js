import { api } from "./api";

const ENDPOINT_BY_TYPE = {
  ENTRADA: "/movimentacoes/entrada",
  SAIDA: "/movimentacoes/saida",
  PERDA: "/movimentacoes/perda",
};

export const movementService = {
  async findAll({ page = 0, size = 20 } = {}) {
    const { data } = await api.get("/movimentacoes", { params: { page, size } });
    return data; // Page<MovementResponse>
  },

  async create(payload) {
    const endpoint = ENDPOINT_BY_TYPE[payload.type] || "/movimentacoes";
    const { data } = await api.post(endpoint, payload);
    return data;
  },
};
