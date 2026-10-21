import { useEffect, useState } from "react";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { PageHeader } from "../../components/common/PageHeader";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { DataTable } from "../../components/common/DataTable";
import { Pagination } from "../../components/common/Pagination";
import { Loader, ErrorState, EmptyState } from "../../components/common/StateViews";
import { Badge } from "../../components/common/Badge";
import { ProductForm } from "./ProductForm";
import { STORAGE_SECTOR, UNIT_OF_MEASURE } from "../../utils/constants";
import "../../styles/forms.css";

export function ProductsPage() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const [productPage, categoryList] = await Promise.all([
        productService.findAll({ nome: search, page, size: 10 }),
        categoryService.findAll(),
      ]);
      setProducts(productPage);
      setCategories(categoryList);
    } catch (err) {
      setError(err?.message || "Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleSearchSubmit(event) {
    event.preventDefault();
    setPage(0);
    loadProducts();
  }

  function openCreateModal() {
    setEditingProduct(null);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(form) {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = { ...form, categoryIds: form.categoryIds };
      if (editingProduct) {
        await productService.update(editingProduct.id, payload);
      } else {
        await productService.create(payload);
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err) {
      setFormError(err?.message || "Não foi possível salvar o produto.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Excluir o produto "${product.name}"?`)) return;
    try {
      await productService.remove(product.id);
      await loadProducts();
    } catch (err) {
      window.alert(err?.message || "Não foi possível excluir o produto.");
    }
  }

  const columns = [
    { key: "name", header: "Produto" },
    {
      key: "unitOfMeasure",
      header: "Unidade",
      render: (row) => UNIT_OF_MEASURE[row.unitOfMeasure]?.label || row.unitOfMeasure,
    },
    {
      key: "storageSector",
      header: "Setor",
      render: (row) => STORAGE_SECTOR[row.storageSector]?.label || row.storageSector,
    },
    {
      key: "categoryNames",
      header: "Categorias",
      render: (row) =>
        row.categoryNames?.length ? (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Array.from(row.categoryNames).map((name) => (
              <Badge key={name} label={name} tone="neutral" />
            ))}
          </div>
        ) : (
          "—"
        ),
    },
    {
      key: "active",
      header: "Status",
      render: (row) => <Badge label={row.active ? "Ativo" : "Inativo"} tone={row.active ? "primary" : "neutral"} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Produtos"
        description="Cadastro dos itens controlados pelo estoque."
        actions={<Button onClick={openCreateModal}>Novo produto</Button>}
      />

      <form className="toolbar" onSubmit={handleSearchSubmit}>
        <div className="toolbar__search">
          <Input
            placeholder="Buscar por nome..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary">
          Buscar
        </Button>
      </form>

      {loading && <Loader label="Carregando produtos..." />}
      {!loading && error && <ErrorState message={error} onRetry={loadProducts} />}

      {!loading && !error && products && (
        <>
          {products.content.length === 0 ? (
            <EmptyState
              title="Nenhum produto encontrado"
              description="Ajuste a busca ou cadastre um novo produto."
            />
          ) : (
            <DataTable
              columns={columns}
              rows={products.content}
              actions={(row) => (
                <>
                  <Button size="sm" variant="ghost" onClick={() => openEditModal(row)}>
                    Editar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(row)}>
                    Excluir
                  </Button>
                </>
              )}
            />
          )}
          <Pagination page={page} totalPages={products.totalPages} onChange={setPage} />
        </>
      )}

      {modalOpen && (
        <Modal title={editingProduct ? "Editar produto" : "Novo produto"} onClose={() => setModalOpen(false)}>
          {formError && <div className="entity-form__error">{formError}</div>}
          <ProductForm
            initialData={editingProduct}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setModalOpen(false)}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}
