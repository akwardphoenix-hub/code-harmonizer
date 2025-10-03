import { useState, useCallback } from 'react'

/**
 * A development-friendly hook that mimics useKV behavior but falls back to localStorage
 * when Spark KV is not available or authentication fails.
 */
export function useLocalKV<T = string>(
  key: string,
  initialValue?: T
): readonly [T | undefined, (newValue: T | ((oldValue?: T) => T)) => void, () => void] {
  // Try to load from localStorage on mount
  const getStoredValue = useCallback((): T | undefined => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Failed to load ${key} from localStorage:`, error)
      return initialValue
    }
  }, [key, initialValue])

  const [storedValue, setStoredValue] = useState<T | undefined>(getStoredValue)

  // Save to localStorage whenever value changes
  const setValue = useCallback(
    (value: T | ((oldValue?: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error)
      }
    },
    [key, storedValue]
  )

  // Delete from localStorage
  const deleteValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Failed to delete ${key} from localStorage:`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, deleteValue] as const
}
