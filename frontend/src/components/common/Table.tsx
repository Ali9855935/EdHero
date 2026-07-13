import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  pageSize?: number;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  pageSize = 5,
  emptyMessage = 'No records found',
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const shouldReduceMotion = useReducedMotion();

  // Handle header click sorting
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;
    
    if (sortKey === column.key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortKey(null);
      }
    } else {
      setSortKey(column.key);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Sort data inside useMemo
  const sortedData = useMemo(() => {
    if (!sortKey) return data;

    const sorted = [...data].sort((a, b) => {
      const aVal = a[sortKey as string];
      const bVal = b[sortKey as string];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const compareVal = typeof aVal === 'string' 
        ? aVal.localeCompare(bVal)
        : aVal - bVal;

      return sortDirection === 'asc' ? compareVal : -compareVal;
    });

    return sorted;
  }, [data, sortKey, sortDirection]);

  // Paginate sorted data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, sortedData.length);

  return (
    <div className="w-full bg-neutralDark-900 border border-neutralDark-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Desktop/Tablet Table layout */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutralDark-950/50 border-b border-neutralDark-800/85 text-xs uppercase tracking-wider text-neutralDark-400">
              {columns.map((col) => {
                const alignClass = 
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                return (
                  <th
                    key={col.key as string}
                    onClick={() => handleSort(col)}
                    className={`px-6 py-4 font-semibold select-none ${alignClass} ${
                      col.sortable ? 'cursor-pointer hover:text-white transition-colors' : ''
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1 ${
                      col.align === 'right' ? 'justify-end w-full' : col.align === 'center' ? 'justify-center w-full' : ''
                    }`}>
                      {col.header}
                      {col.sortable && sortKey === col.key && (
                        sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-neutralDark-800/60 text-sm">
            <AnimatePresence mode="popLayout">
              {paginatedData.length === 0 ? (
                <motion.tr
                  initial={shouldReduceMotion ? {} : { opacity: 0 }}
                  animate={shouldReduceMotion ? {} : { opacity: 1 }}
                  exit={shouldReduceMotion ? {} : { opacity: 0 }}
                  key="empty"
                >
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-neutralDark-500">
                    {emptyMessage}
                  </td>
                </motion.tr>
              ) : (
                paginatedData.map((row, index) => (
                  <motion.tr
                    layout={!shouldReduceMotion}
                    initial={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
                    animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
                    transition={shouldReduceMotion ? {} : { duration: 0.15, delay: Math.min(index, 5) * 0.03 }}
                    key={row.id || index}
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors duration-150 ease-out ${
                      onRowClick ? 'cursor-pointer hover:bg-brand-500/5' : 'hover:bg-neutralDark-800/40'
                    }`}
                  >
                    {columns.map((col) => {
                      const alignClass = 
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left';
                      const cellValue = row[col.key as string];
                      return (
                        <td key={col.key as string} className={`px-6 py-4 text-neutralDark-300 ${alignClass}`}>
                          {col.render ? col.render(cellValue, row) : cellValue}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="sm:hidden divide-y divide-neutralDark-800/40 bg-neutralDark-900">
        <AnimatePresence mode="popLayout">
          {paginatedData.length === 0 ? (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 1 }}
              exit={shouldReduceMotion ? {} : { opacity: 0 }}
              key="mobile-empty"
              className="px-6 py-12 text-center text-neutralDark-500 text-sm"
            >
              {emptyMessage}
            </motion.div>
          ) : (
            paginatedData.map((row, rowIndex) => (
              <motion.div
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 4 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, y: -4 }}
                transition={shouldReduceMotion ? {} : { duration: 0.15, delay: Math.min(rowIndex, 5) * 0.03 }}
                key={row.id || rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`p-4 space-y-3 transition-colors duration-150 ease-out ${
                  onRowClick ? 'cursor-pointer active:bg-neutralDark-850 hover:bg-neutralDark-850/20' : ''
                }`}
              >
                {columns.map((col) => {
                  const cellValue = row[col.key as string];
                  const isActionColumn = col.key === 'actions' || col.key === 'update' || col.key === 'link';
                  
                  if (isActionColumn) {
                    return (
                      <div 
                        key={col.key as string} 
                        className="flex justify-end pt-2 border-t border-neutralDark-800/60"
                      >
                        {col.render ? col.render(cellValue, row) : cellValue}
                      </div>
                    );
                  }

                  return (
                    <div key={col.key as string} className="flex justify-between items-start text-xs gap-4">
                      <span className="font-semibold text-neutralDark-500 uppercase tracking-wider">{col.header}</span>
                      <span className="text-neutralDark-200 text-right">
                        {col.render ? col.render(cellValue, row) : cellValue}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-neutralDark-950/20 border-t border-neutralDark-800/60 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-neutralDark-400 font-medium">
            Showing <span className="text-white font-semibold">{startIndex}</span> to{' '}
            <span className="text-white font-semibold">{endIndex}</span> of{' '}
            <span className="text-white font-semibold">{data.length}</span> items
          </span>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-neutralDark-800 bg-neutralDark-950/40 hover:bg-neutralDark-850 hover:border-neutralDark-700 text-neutralDark-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs text-neutralDark-400 font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-neutralDark-800 bg-neutralDark-950/40 hover:bg-neutralDark-850 hover:border-neutralDark-700 text-neutralDark-400 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
