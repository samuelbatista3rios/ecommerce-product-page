// hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue, ttl = 15 * 60 * 1000) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      
      const parsedItem = JSON.parse(item)
      if (Date.now() > parsedItem.expiry) {
        window.localStorage.removeItem(key)
        return initialValue
      }
      return parsedItem.value
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      const item = {
        value: valueToStore,
        expiry: Date.now() + ttl
      }
      window.localStorage.setItem(key, JSON.stringify(item))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key) {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null
          if (!newValue || Date.now() > newValue.expiry) {
            setStoredValue(initialValue)
          } else {
            setStoredValue(newValue.value)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, initialValue])

  return [storedValue, setValue]
}

export default useLocalStorage