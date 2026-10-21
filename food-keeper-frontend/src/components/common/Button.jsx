import "./Button.css";

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Enviando..." : children}
    </button>
  );
}
