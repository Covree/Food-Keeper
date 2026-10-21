import { useState } from "react";
import { alertService } from "../services/alertService";
import { useAuth } from "../hooks/useAuth";
import { useFetch } from "../hooks/useFetch";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Loader, ErrorState, EmptyState } from "../components/common/StateViews";
import { Badge } from "../components/common/Badge";
import { formatDate, formatDateTime } from "../utils/formatters";
import "./AlertsPage.css";

export function AlertsPage() {
  const { user } = useAuth();
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { data: alerts, loading, error, reload, setData } = useFetch(
    () => (onlyUnread ? alertService.findUnread() : alertService.findAll()),
    [onlyUnread]
  );

  const canGenerate = user?.role === "ADMIN" || user?.role === "GESTOR";

  async function handleMarkAsRead(alert) {
    try {
      await alertService.markAsRead(alert.id);
      setData((prev) => prev.map((item) => (item.id === alert.id ? { ...item, read: true } : item)));
    } catch (err) {
      window.alert(err?.message || "Não foi possível marcar o alerta como lido.");
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    try {
      await alertService.generateNow();
      await reload();
    } catch (err) {
      window.alert(err?.message || "Não foi possível gerar os alertas.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Alertas"
        description="Avisos de validade gerados automaticamente para os lotes em estoque."
        actions={
          canGenerate && (
            <Button variant="secondary" loading={generating} onClick={handleGenerate}>
              Gerar alertas agora
            </Button>
          )
        }
      />

      <div className="toolbar">
        <label className="alerts-filter">
          <input
            type="checkbox"
            checked={onlyUnread}
            onChange={(event) => setOnlyUnread(event.target.checked)}
          />
          Mostrar apenas não lidos
        </label>
      </div>

      {loading && <Loader label="Carregando alertas..." />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          {alerts.length === 0 ? (
            <EmptyState title="Nenhum alerta encontrado" />
          ) : (
            <ul className="alert-list">
              {alerts.map((alert) => (
                <li key={alert.id} className={`alert-item ${alert.read ? "alert-item--read" : ""}`}>
                  <div className="alert-item__main">
                    <div className="alert-item__title-row">
                      <span className="alert-item__product">{alert.productName}</span>
                      <Badge label={alert.type} />
                    </div>
                    <p className="alert-item__message">{alert.message}</p>
                    <span className="alert-item__meta">
                      Validade: {formatDate(alert.expirationDate)} · Criado em {formatDateTime(alert.createdAt)}
                    </span>
                  </div>
                  {!alert.read && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkAsRead(alert)}>
                      Marcar como lido
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
