import { useRef } from 'react'
import type { ChangeEvent } from 'react'
import { SearchIcon } from './icons/SearchIcon'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClear = () => {
    onChange('')
    inputRef.current?.focus()
  }

  return (
    <div className="search-bar">
      <SearchIcon size={16} />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="Search tasks..."
        aria-label="Search tasks by title, project, or priority"
      />
      {value && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Clear search"
          title="Clear search"
        >
          ×
        </button>
      )}
    </div>
  )
}
