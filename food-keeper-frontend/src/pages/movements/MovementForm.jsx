import { useState } from "react";
import { Input } from "../../components/common/Input";
import { Select } from "../../components/common/Select";
import { Button } from "../../components/common/Button";
import { MOVEMENT_TYPE, toOptions } from "../../utils/constants";

export function MovementForm({ batches, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState({ batchId: "", type: "", quantity: "", reason: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      batchId: Number(form.batchId),
      type: form.type,
      quantity: Number(form.quantity),
      reason: form.reason || undefined,
    });
  }

  return (
    <form className="entity-form" onSubmit={handleSubmit}>
      <Select
        label="Lote"
        name="batchId"
        placeholder="Selecione o lote"
        options={batches.map((b) => ({ value: b.id, label: `${b.productName} — vence ${b.expirationDate}` }))}
        value={form.batchId}
        onChange={handleChange}
        required
      />
      <Select
        label="Tipo de movimentação"
        name="type"
        placeholder="Selecione"
        options={toOptions(MOVEMENT_TYPE)}
        value={form.type}
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
        label="Motivo (opcional)"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        maxLength={255}
      />
      <div className="entity-form__actions">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Registrar
        </Button>
      </div>
    </form>
  );
}
