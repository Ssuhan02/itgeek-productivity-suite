interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Generic page-number control: "‹ Previous  1 2 3 4  Next ›". Takes no
 * domain data — just the current position — so any paginated list in the
 * app (todos today, notes/habits/etc. tomorrow) can reuse it as-is by
 * pairing it with usePagination.
 *
 * When there's only one page, it stays mounted but invisible (`visibility:
 * hidden`, not unmounted) instead of disappearing — so the space it
 * reserves stays constant and the list panel's height never has a one-time
 * jump at the pagination threshold, on top of never growing past it.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isSinglePage = totalPages <= 1
  const pages = Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1)

  return (
    <nav
      className={`pagination${isSinglePage ? ' pagination--hidden' : ''}`}
      aria-label="Task list pages"
      aria-hidden={isSinglePage || undefined}
    >
      <button
        type="button"
        className="pagination-nav"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹ Previous
      </button>
      <div className="pagination-pages">
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-page${page === currentPage ? ' active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="pagination-nav"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next ›
      </button>
    </nav>
  )
}
