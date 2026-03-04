'use client';

import { useState, useEffect } from 'react';

export function usePagination<T>(items: T[], itemsPerPage: number, resetTrigger?: any) {
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => { setCurrentPage(1); }, [resetTrigger]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const start = (currentPage - 1) * itemsPerPage;

  const pagedItems = items.slice(start, start + itemsPerPage);

  return { currentPage, setCurrentPage, totalPages, pagedItems };
}