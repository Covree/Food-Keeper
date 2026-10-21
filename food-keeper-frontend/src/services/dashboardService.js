import { api } from "./api";

export const dashboardService = {
  async getSummary() {
    const { data } = await api.get("/dashboard");
    return data;
  },
};
