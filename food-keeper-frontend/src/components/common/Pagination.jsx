import "./Pagination.css";

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button className="pagination__btn" onClick={() => onChange(page - 1)} disabled={page === 0}>
        Anterior
      </button>
      <span className="pagination__status">
        Página {page + 1} de {totalPages}
      </span>
      <button
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page + 1 >= totalPages}
      >
        Próxima
      </button>
    </div>
  );
}
