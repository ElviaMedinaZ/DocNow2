import '../../styles/admin/tabla-generica.css';

export default function TablaGenerica({ columns, data, emptyMsg, footer }) {
  return (
    <div className="tabla-wrapper">
      <table className="tabla-generica">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}> {typeof col.accessor === 'function' ? col.accessor(row): row[col.accessor]}</td>))}
              </tr>))) : (
                <tr>
                    <td colSpan={columns.length} style={{ textAlign: 'center', padding: '1rem' }}>
                        {emptyMsg}
                    </td>
                </tr>
            )}
            </tbody>
        </table>

      {footer && <p className="tabla-footer">{footer}</p>}
    </div>
  );
}
