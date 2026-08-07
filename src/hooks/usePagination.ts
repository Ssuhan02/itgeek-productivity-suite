import { useEffect, useState } from 'react'

export interface UsePaginationResult<T> {
  /** Just the current page's slice of `items` — render this, not `items`. */
  pageItems: T[]
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

/**
 * Generic client-side pagination over an already filtered-and-sorted array.
 * Purely data-driven — no knowledge of todos, notes, or any other domain —
 * so any list feature can reuse it by pairing it with <Pagination>.
 *
 * `currentPage` only ever moves when the caller asks it to (goToPage/next/
 * previous) or when it's now out of range — e.g. a filter shrank the list,
 * or the last item on the last page was deleted — in which case it's
 * clamped down to the new last page. It never resets to page 1 on its own,
 * so changing pages never has side effects on filtering, sorting, or the
 * source data, and routine list edits don't surprise-reset the page.
 */
export function usePagination<T>(items: T[], pageSize: number): UsePaginationResult<T> {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const safePage = Math.min(currentPage, totalPages)
  const start = (safePage - 1) * pageSize
  const pageItems = items.slice(start, start + pageSize)

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages))
  }

  return {
    pageItems,
    currentPage: safePage,
    totalPages,
    goToPage,
    nextPage: () => goToPage(safePage + 1),
    previousPage: () => goToPage(safePage - 1),
    canGoNext: safePage < totalPages,
    canGoPrevious: safePage > 1,
  }
}
