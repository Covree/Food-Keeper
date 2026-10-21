import { dashboardService } from "../services/dashboardService";
import { useFetch } from "../hooks/useFetch";
import { PageHeader } from "../components/common/PageHeader";
import { StatCard } from "../components/common/StatCard";
import { Loader, ErrorState, EmptyState } from "../components/common/StateViews";
import { Badge } from "../components/common/Badge";
import { formatDate } from "../utils/formatters";
import "./DashboardPage.css";

export function DashboardPage() {
  const { data, loading, error, reload } = useFetch(() => dashboardService.getSummary(), []);

  if (loading) return <Loader label="Carregando painel..." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div>
      <PageHeader title="Painel" description="Visão geral do estoque e da validade dos alimentos." />

      <div className="dashboard__stats">
        <StatCard label="Produtos cadastrados" value={data.totalProducts} />
        <StatCard label="Lotes ativos" value={data.activeBatches} />
        <StatCard label="Itens em estoque" value={data.totalStockItems} tone="info" />
        <StatCard label="Alertas urgentes" value={data.urgentAlerts} tone="danger" />
        <StatCard label="Alertas de atenção" value={data.attentionAlerts} tone="warning" />
      </div>

      <div className="dashboard__panels">
        <div className="panel">
          <h2 className="panel__title">Lotes próximos do vencimento</h2>
          {data.expiringBatches?.length ? (
            <div className="panel__list">
              {data.expiringBatches.map((batch) => (
                <div className="panel__row" key={batch.id}>
                  <div className="panel__row-main">
                    <span className="panel__row-title">{batch.productName}</span>
                    <span className="panel__row-meta">
                      Vence em {formatDate(batch.expirationDate)} · {batch.daysToExpire} dia(s)
                    </span>
                  </div>
                  <Badge label={batch.status} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Nenhum lote próximo do vencimento" />
          )}
        </div>

        <div className="panel">
          <h2 className="panel__title">Alertas recentes</h2>
          {data.alerts?.length ? (
            <div className="panel__list">
              {data.alerts.map((alert) => (
                <div className="panel__row" key={alert.id}>
                  <div className="panel__row-main">
                    <span className="panel__row-title">{alert.productName}</span>
                    <span className="panel__row-meta">{alert.message}</span>
                  </div>
                  <Badge label={alert.type} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Sem alertas no momento" />
          )}
        </div>
      </div>
    </div>
  );
}
