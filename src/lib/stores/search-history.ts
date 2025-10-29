import { writable } from "svelte/store"

interface SearchHistoryItem {
  query: string
  type: "ingredient" | "category" | "random"
  timestamp: number
}

function createSearchHistoryStore() {
  const savedHistory = typeof window !== "undefined" ? localStorage.getItem("recipe-flow-history") : null
  const initialHistory = savedHistory ? JSON.parse(savedHistory) : []

  const { subscribe, set, update } = writable<SearchHistoryItem[]>(initialHistory)

  return {
    subscribe,
    addSearch: (query: string, type: "ingredient" | "category" | "random") => {
      update((history) => {
        // Remove duplicate if it exists
        const filtered = history.filter((item) => !(item.query === query && item.type === type))

        // Add new search to the beginning
        const updated = [{ query, type, timestamp: Date.now() }, ...filtered].slice(0, 10) // Keep only last 10 searches

        if (typeof window !== "undefined") {
          localStorage.setItem("recipe-flow-history", JSON.stringify(updated))
        }
        return updated
      })
    },
    clearHistory: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("recipe-flow-history")
      }
      set([])
    },
    removeSearch: (index: number) => {
      update((history) => {
        const updated = history.filter((_, i) => i !== index)
        if (typeof window !== "undefined") {
          localStorage.setItem("recipe-flow-history", JSON.stringify(updated))
        }
        return updated
      })
    },
  }
}

export const searchHistory = createSearchHistoryStore()
