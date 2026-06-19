import './Table.css';

const Table = ({ 
  columns = [], 
  data = [], 
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  ...props 
}) => {
  if (loading) {
    return (
      <div className="ui-table-loading">
        <div className="ui-table-skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="ui-table-skeleton-row">
              {columns.map((_, j) => (
                <div key={j} className="ui-table-skeleton-cell"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="ui-table-empty">
        <i className="bi bi-inbox"></i>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`ui-table-container ${className}`} {...props}>
      <table className="ui-table">
        <thead className="ui-table-header">
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                className="ui-table-header-cell"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="ui-table-body">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="ui-table-row">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="ui-table-cell">
                  {column.render ? column.render(row) : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
