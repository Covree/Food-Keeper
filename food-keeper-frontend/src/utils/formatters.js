export function formatDate(isoDate) {
  if (!isoDate) return "—";
  const [year, month, day] = isoDate.split("-");
  if (!year) return isoDate;
  return `${day}/${month}/${year}`;
}

export function formatDateTime(isoDateTime) {
  if (!isoDateTime) return "—";
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatQuantity(value, unit) {
  if (value === null || value === undefined) return "—";
  const number = Number(value);
  const formatted = number.toLocaleString("pt-BR", {
    minimumFractionDigits: number % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 3,
  });
  return unit ? `${formatted} ${unit.toLowerCase()}` : formatted;
}

// Mapeia status/tipos para uma tonalidade semântica usada nos Badges
export function statusTone(status) {
  const map = {
    URGENTE: "danger",
    VENCIDO: "danger",
    PERDA: "danger",
    ATENCAO: "warning",
    A_VENCER: "warning",
    AVISO: "info",
    OK: "primary",
    ENTRADA: "primary",
    SAIDA: "info",
  };
  return map[status] || "neutral";
}
