import { useState } from "react";
import { categoryService } from "../services/categoryService";
import { useFetch } from "../hooks/useFetch";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { Loader, ErrorState, EmptyState } from "../components/common/StateViews";
import "../styles/forms.css";
import "./CategoriesPage.css";

export function CategoriesPage() {
  const { user } = useAuth();
  const { data: categories, loading, error, reload } = useFetch(() => categoryService.findAll(), []);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const canDelete = user?.role === "ADMIN";

  async function handleCreate(event) {
    event.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    setFormError(null);
    try {
      await categoryService.create(name.trim());
      setName("");
      await reload();
    } catch (err) {
      setFormError(err?.message || "Não foi possível criar a categoria.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    try {
      await categoryService.remove(category.id);
      await reload();
    } catch (err) {
      window.alert(err?.message || "Não foi possível excluir a categoria.");
    }
  }

  return (
    <div>
      <PageHeader title="Categorias" description="Organize os produtos por categoria." />

      <form className="toolbar" onSubmit={handleCreate}>
        <div className="toolbar__search">
          <Input
            placeholder="Nome da nova categoria"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <Button type="submit" loading={submitting}>
          Adicionar
        </Button>
      </form>
      {formError && <div className="entity-form__error" style={{ marginBottom: "var(--space-4)" }}>{formError}</div>}

      {loading && <Loader label="Carregando categorias..." />}
      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && (
        <>
          {categories.length === 0 ? (
            <EmptyState title="Nenhuma categoria cadastrada" description="Adicione a primeira categoria acima." />
          ) : (
            <ul className="category-list">
              {categories.map((category) => (
                <li key={category.id} className="category-list__item">
                  <span>{category.name}</span>
                  {canDelete && (
                    <button className="category-list__delete" onClick={() => handleDelete(category)}>
                      Excluir
                    </button>
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
