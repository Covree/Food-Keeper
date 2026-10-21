import "./DataTable.css";

/**
 * columns: [{ key, header, render?(row) }]
 * rows: array of objects with an `id` field
 */
export function DataTable({ columns, rows, actions }) {
  return (
    <div className="data-table__wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.header}</th>
            ))}
            {actions && <th className="data-table__actions-header">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
              ))}
              {actions && <td className="data-table__actions">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
