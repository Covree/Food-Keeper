import "./StateViews.css";

export function Loader({ label = "Carregando..." }) {
  return (
    <div className="state-view">
      <div className="state-view__spinner" />
      <p className="state-view__text">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="state-view">
      <p className="state-view__title">{title}</p>
      {description && <p className="state-view__text">{description}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state-view state-view--error">
      <p className="state-view__title">Algo deu errado</p>
      <p className="state-view__text">{message}</p>
      {onRetry && (
        <button className="state-view__retry" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
