import "./Field.css";

export function Input({ label, error, id, ...inputProps }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={`field__control ${error ? "field__control--error" : ""}`} {...inputProps} />
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}
