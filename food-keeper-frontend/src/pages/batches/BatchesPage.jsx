import { useEffect, useState } from "react";
import { batchService } from "../../services/batchService";
import { productService } from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/common/Button";
import { Select } from "../../components/common/Select";
import { Modal } from "../../components/common/Modal";
import { DataTable } from "../../components/common/DataTable";
import { Loader, ErrorState, EmptyState } from "../../components/common/StateViews";
import { Badge } from "../../components/common/Badge";
import { BatchForm } from "./BatchForm";
import { formatDate, formatQuantity } from "../../utils/formatters";
import "../../styles/forms.css";

const DAY_OPTIONS = [
  { value: "3", label: "Próximos 3 dias" },
  { value: "7", label: "Próximos 7 dias" },
  { value: "15", label: "Próximos 15 dias" },
  { value: "30", label: "Próximos 30 dias" },
];

export function BatchesPage() {
  const { user } = useAuth();
  const [dias, setDias] = useState("7");
  const [batches, setBatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  async function loadBatches(currentDias = dias) {
    setLoading(true);
    setError(null);
    try {
      const data = await batchService.findExpiring(Number(currentDias));
      setBatches(data);
    } catch (err) {
      setError(err?.message || "Erro ao carregar lotes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openCreateModal() {
    setFormError(null);
    try {
      const productPage = await productService.findAll({ size: 100 });
      setProducts(productPage.content);
      setModalOpen(true);
    } catch (err) {
      window.alert(err?.message || "Não foi possível carregar os produtos.");
    }
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormError(null);
    try {
      await batchService.create(payload);
      setModalOpen(false);
      await loadBatches();
    } catch (err) {
      setFormError(err?.message || "Não foi possível salvar o lote.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(batch) {
    if (!window.confirm(`Excluir o lote de "${batch.productName}"?`)) return;
    try {
      await batchService.remove(batch.id);
      await loadBatches();
    } catch (err) {
      window.alert(err?.message || "Não foi possível excluir o lote.");
    }
  }

  const canDelete = user?.role === "ADMIN" || user?.role === "GESTOR";

  const columns = [
    { key: "productName", header: "Produto" },
    { key: "quantity", header: "Quantidade", render: (row) => formatQuantity(row.quantity) },
    { key: "entryDate", header: "Entrada", render: (row) => formatDate(row.entryDate) },
    { key: "expirationDate", header: "Validade", render: (row) => formatDate(row.expirationDate) },
    { key: "daysToExpire", header: "Dias restantes" },
    { key: "status", header: "Status", render: (row) => <Badge label={row.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title="Lotes e validade"
        description="Acompanhe os lotes próximos do vencimento."
        actions={<Button onClick={openCreateModal}>Novo lote</Button>}
      />

      <div className="toolbar">
        <div className="toolbar__search">
          <Select
            options={DAY_OPTIONS}
            value={dias}
            onChange={(event) => {
              setDias(event.target.value);
              loadBatches(event.target.value);
            }}
          />
        </div>
      </div>

      {loading && <Loader label="Carregando lotes..." />}
      {!loading && error && <ErrorState message={error} onRetry={() => loadBatches()} />}

      {!loading && !error && batches && (
        <>
          {batches.length === 0 ? (
            <EmptyState title="Nenhum lote vencendo nesse período" />
          ) : (
            <DataTable
              columns={columns}
              rows={batches}
              actions={
                canDelete
                  ? (row) => (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(row)}>
                        Excluir
                      </Button>
                    )
                  : undefined
              }
            />
          )}
        </>
      )}

      {modalOpen && (
        <Modal title="Novo lote" onClose={() => setModalOpen(false)}>
          {formError && <div className="entity-form__error">{formError}</div>}
          <BatchForm
            products={products}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
