import { useState } from "react";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";

export function BatchForm({ products, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ productId: "", quantity: "", expirationDate: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      productId: Number(form.productId),
      quantity: Number(form.quantity),
      expirationDate: form.expirationDate,
    });
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <Select
        label="Produto"
        name="productId"
        placeholder="Selecione o produto"
        options={products.map((p) => ({ value: p.id, label: p.name }))}
        value={form.productId}
        onChange={handleChange}
        required
      />
      <Input
        label="Quantidade"
        name="quantity"
        type="number"
        step="0.001"
        min="0.001"
        value={form.quantity}
        onChange={handleChange}
        required
      />
      <Input
        label="Data de validade"
        name="expirationDate"
        type="date"
        value={form.expirationDate}
        onChange={handleChange}
        required
      />
      <div className="entity-form__actions">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Salvar
        </Button>
      </div>
    </form>
  );
}
