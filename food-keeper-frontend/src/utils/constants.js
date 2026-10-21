// Espelha os enums do back-end (br.com.foodkeeper.enums.*)
// Manter em sincronia caso o back-end mude.

export const UNIT_OF_MEASURE = {
  KG: { value: "KG", label: "Quilos (kg)" },
  L: { value: "L", label: "Litros (L)" },
  UN: { value: "UN", label: "Unidades" },
};

export const STORAGE_SECTOR = {
  FREEZER: { value: "FREEZER", label: "Freezer" },
  GELADEIRA: { value: "GELADEIRA", label: "Geladeira" },
  DESPENSA: { value: "DESPENSA", label: "Despensa" },
};

export const MOVEMENT_TYPE = {
  ENTRADA: { value: "ENTRADA", label: "Entrada" },
  SAIDA: { value: "SAIDA", label: "Saída" },
  PERDA: { value: "PERDA", label: "Perda" },
};

export const ALERT_TYPE = {
  URGENTE: { value: "URGENTE", label: "Urgente" },
  ATENCAO: { value: "ATENCAO", label: "Atenção" },
  AVISO: { value: "AVISO", label: "Aviso" },
};

export const ROLE = {
  ADMIN: { value: "ADMIN", label: "Administrador" },
  GESTOR: { value: "GESTOR", label: "Gestor" },
  FUNCIONARIO: { value: "FUNCIONARIO", label: "Funcionário" },
};

export const toOptions = (enumObj) => Object.values(enumObj);
