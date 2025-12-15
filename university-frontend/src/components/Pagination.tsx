import React from "react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="flex justify-between items-center px-8 pt-4 pb-6">
      <div>
        Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
      </div>
      <div className="flex gap-2 items-center">
        <button
          className="px-3 py-1 rounded border bg-stone-100 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          className="px-3 py-1 rounded border bg-stone-100 disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
        
      </div>
      <select
          className="ml-2 border rounded p-1"
          value={pageSize}
          onChange={e => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
    </div>
  );
};

export default Pagination;
