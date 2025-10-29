import { writable } from "svelte/store"

function createThemeStore() {
  // Check localStorage for saved theme preference
  const savedTheme = typeof window !== "undefined" ? localStorage.getItem("recipe-flow-theme") : null
  const prefersDark = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false

  // Initialize with saved theme or system preference
  const initialTheme = (savedTheme as "light" | "dark" | null) || (prefersDark ? "dark" : "light")
  const { subscribe, set, update } = writable<"light" | "dark">(initialTheme)

  return {
    subscribe,
    toggle: () => {
      update((currentTheme) => {
        const newTheme = currentTheme === "light" ? "dark" : "light"

        // Apply theme to DOM and save to localStorage
        if (typeof window !== "undefined") {
          const html = document.documentElement
          if (newTheme === "dark") {
            html.classList.add("dark")
          } else {
            html.classList.remove("dark")
          }
          localStorage.setItem("recipe-flow-theme", newTheme)
        }

        return newTheme
      })
    },
    set: (theme: "light" | "dark") => {
      if (typeof window !== "undefined") {
        const html = document.documentElement
        if (theme === "dark") {
          html.classList.add("dark")
        } else {
          html.classList.remove("dark")
        }
        localStorage.setItem("recipe-flow-theme", theme)
      }
      set(theme)
    },
  }
}

export const theme = createThemeStore()
