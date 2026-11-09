import { useState } from "react";
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

  const [selectedMetric, setSelectedMetric] = useState("stock");

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

      <section className="dashboard__insights" aria-label="Resumo visual do estoque">
        <div className="insight-card insight-card--chart">
          <div className="insight-card__heading"><div><span className="eyebrow">VISÃO GERAL</span><h2>Seu estoque em números</h2><p>Selecione uma métrica para explorar os indicadores.</p></div><span className="insight-card__symbol" aria-hidden="true">↗</span></div>
          <div className="metric-tabs" role="group" aria-label="Selecionar indicador">
            {[{id:"stock",label:"Estoque"},{id:"batches",label:"Lotes"},{id:"alerts",label:"Alertas"}].map(item => <button type="button" key={item.id} className={selectedMetric === item.id ? "metric-tab metric-tab--active" : "metric-tab"} aria-pressed={selectedMetric === item.id} onClick={() => setSelectedMetric(item.id)}>{item.label}</button>)}
          </div>
          {(() => {
            const values = selectedMetric === "stock" ? [{label:"Itens em estoque",value:data.totalStockItems ?? 0},{label:"Produtos",value:data.totalProducts ?? 0},{label:"Lotes ativos",value:data.activeBatches ?? 0}] : selectedMetric === "batches" ? [{label:"Lotes ativos",value:data.activeBatches ?? 0},{label:"Próximos do vencimento",value:data.expiringBatches?.length ?? 0}] : [{label:"Urgentes",value:data.urgentAlerts ?? 0},{label:"Atenção",value:data.attentionAlerts ?? 0}];
            const max = Math.max(1,...values.map(item => Number(item.value) || 0));
            return <div className="metric-chart" role="img" aria-label={values.map(item => `${item.label}: ${item.value}`).join(', ')}>{values.map((item,index) => <div className="metric-chart__column" key={item.label}><strong>{item.value}</strong><div className="metric-chart__track"><div className={`metric-chart__bar metric-chart__bar--${index}`} style={{height:`${Math.max(4, (Number(item.value) || 0) / max * 100)}%`}} title={`${item.label}: ${item.value}`}/></div><span>{item.label}</span></div>)}</div>;
          })()}
        </div>
        <div className="insight-card insight-card--health">
          <span className="eyebrow">STATUS DO ESTOQUE</span><h2>Atenção aos alimentos</h2><p>Um panorama simples dos alertas que precisam de acompanhamento.</p>
          <div className="health-ring" style={{"--ring-value":`${Math.round((Number(data.urgentAlerts || 0) + Number(data.attentionAlerts || 0)) / Math.max(1,Number(data.activeBatches || 0)) * 100)}%`}}><div><strong>{(Number(data.urgentAlerts || 0) + Number(data.attentionAlerts || 0))}</strong><span>alertas</span></div></div>
          <div className="health-legend"><span><i className="legend-dot legend-dot--danger"/>Urgentes <b>{data.urgentAlerts ?? 0}</b></span><span><i className="legend-dot legend-dot--warning"/>Atenção <b>{data.attentionAlerts ?? 0}</b></span></div>
        </div>
      </section>
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
