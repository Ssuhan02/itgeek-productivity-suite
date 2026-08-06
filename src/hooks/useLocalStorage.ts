import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T, migrate?: (value: T) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (!stored) return initialValue
      const parsed = JSON.parse(stored) as T
      return migrate ? migrate(parsed) : parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore write errors (e.g. storage full or unavailable)
    }
  }, [key, value])

  return [value, setValue] as const
}
