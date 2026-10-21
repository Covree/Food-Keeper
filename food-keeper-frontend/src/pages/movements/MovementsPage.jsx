import { useEffect, useState } from "react";
import { movementService } from "../../services/movementService";
import { batchService } from "../../services/batchService";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { DataTable } from "../../components/common/DataTable";
import { Pagination } from "../../components/common/Pagination";
import { Loader, ErrorState, EmptyState } from "../../components/common/StateViews";
import { Badge } from "../../components/common/Badge";
import { MovementForm } from "./MovementForm";
import { formatDateTime, formatQuantity, statusTone } from "../../utils/formatters";
import { MOVEMENT_TYPE } from "../../utils/constants";
import "../../styles/forms.css";

export function MovementsPage() {
  const [page, setPage] = useState(0);
  const [movements, setMovements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [batches, setBatches] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  async function loadMovements() {
    setLoading(true);
    setError(null);
    try {
      const data = await movementService.findAll({ page, size: 10 });
      setMovements(data);
    } catch (err) {
      setError(err?.message || "Erro ao carregar movimentações.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function openCreateModal() {
    setFormError(null);
    try {
      const expiringBatches = await batchService.findExpiring(365);
      setBatches(expiringBatches);
      setModalOpen(true);
    } catch (err) {
      window.alert(err?.message || "Não foi possível carregar os lotes.");
    }
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormError(null);
    try {
      await movementService.create(payload);
      setModalOpen(false);
      setPage(0);
      await loadMovements();
    } catch (err) {
      setFormError(err?.message || "Não foi possível registrar a movimentação.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
    { key: "productName", header: "Produto" },
    {
      key: "type",
      header: "Tipo",
      render: (row) => <Badge label={MOVEMENT_TYPE[row.type]?.label || row.type} tone={statusTone(row.type)} />,
    },
    { key: "quantity", header: "Quantidade", render: (row) => formatQuantity(row.quantity) },
    { key: "userName", header: "Responsável" },
    { key: "reason", header: "Motivo", render: (row) => row.reason || "—" },
    { key: "createdAt", header: "Data", render: (row) => formatDateTime(row.createdAt) },
  ];

  return (
    <div>
      <PageHeader
        title="Movimentações"
        description="Histórico de entradas, saídas e perdas de estoque."
        actions={<Button onClick={openCreateModal}>Registrar movimentação</Button>}
      />

      {loading && <Loader label="Carregando movimentações..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadMovements} />}

      {!loading && !error && movements && (
        <>
          {movements.content.length === 0 ? (
            <EmptyState title="Nenhuma movimentação registrada ainda" />
          ) : (
            <DataTable columns={columns} rows={movements.content} />
          )}
          <Pagination page={page} totalPages={movements.totalPages} onChange={setPage} />
        </>
      )}

      {modalOpen && (
        <Modal title="Registrar movimentação" onClose={() => setModalOpen(false)}>
          {formError && <div className="entity-form__error">{formError}</div>}
          <MovementForm
            batches={batches}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
