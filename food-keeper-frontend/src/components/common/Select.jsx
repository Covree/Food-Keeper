import "./Field.css";

export function Select({ label, error, id, options, placeholder, ...selectProps }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select id={selectId} className={`field__control ${error ? "field__control--error" : ""}`} {...selectProps}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
