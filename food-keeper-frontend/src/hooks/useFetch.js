import { useCallback, useEffect, useState } from "react";

/**
 * Executa uma função assíncrona e expõe seu estado (dados, loading, erro).
 * `deps` dispara uma nova busca quando os valores mudam (ex.: página, filtro).
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err?.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
