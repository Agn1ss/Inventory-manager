import { t } from "i18next";

interface TableSkeletonProps {
  columns: string[];
  rows?: number;
}

export default function TablePlaceholder({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <table className="table table-striped w-100">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{t(col)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((_, colIdx) => (
              <td key={colIdx}>
                <span className="placeholder col-12"></span>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}