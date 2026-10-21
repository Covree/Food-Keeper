import { useEffect, useState } from "react";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { UNIT_OF_MEASURE, STORAGE_SECTOR, toOptions } from "../../utils/constants";

const EMPTY_FORM = { name: "", unitOfMeasure: "", storageSector: "", barcode: "", categoryIds: [] };

export function ProductForm({ initialData, categories, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        unitOfMeasure: initialData.unitOfMeasure || "",
        storageSector: initialData.storageSector || "",
        barcode: initialData.barcode || "",
        categoryIds: initialData.categoryIds ? Array.from(initialData.categoryIds) : [],
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initialData]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function toggleCategory(categoryId) {
    setForm((prev) => {
      const exists = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <Input label="Nome do produto" name="name" value={form.name} onChange={handleChange} required />

      <Select
        label="Unidade de medida"
        name="unitOfMeasure"
        placeholder="Selecione"
        options={toOptions(UNIT_OF_MEASURE)}
        value={form.unitOfMeasure}
        onChange={handleChange}
        required
      />

      <Select
        label="Setor de armazenamento"
        name="storageSector"
        placeholder="Selecione"
        options={toOptions(STORAGE_SECTOR)}
        value={form.storageSector}
        onChange={handleChange}
        required
      />

      <Input
        label="Código de barras (opcional)"
        name="barcode"
        value={form.barcode}
        onChange={handleChange}
      />

      <div className="entity-form__field">
        <span className="entity-form__label">Categorias</span>
        <div className="entity-form__checkbox-group">
          {categories.map((category) => (
            <label key={category.id} className="entity-form__checkbox">
              <input
                type="checkbox"
                checked={form.categoryIds.includes(category.id)}
                onChange={() => toggleCategory(category.id)}
              />
              {category.name}
            </label>
          ))}
          {categories.length === 0 && (
            <span className="entity-form__hint">Cadastre uma categoria antes de continuar.</span>
          )}
        </div>
      </div>

      <div className="entity-form__actions">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
