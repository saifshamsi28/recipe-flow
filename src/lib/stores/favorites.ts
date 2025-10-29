import { writable } from "svelte/store"

interface FavoriteItem {
  mealId: string
  addedAt: number
}

function createFavoritesStore() {
  let initialFavorites: FavoriteItem[] = [];
  
  // Migrate old format or start fresh
  if (typeof window !== "undefined") {
    const savedFavorites = localStorage.getItem("recipe-flow-favorites");
    
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites);
        
        // Check if it's the old format (array of strings) or new format (array of objects)
        if (parsed.length > 0) {
          if (typeof parsed[0] === 'string') {
            // Old format detected - clear it
            console.log('[FavoritesStore] Old format detected. Clearing localStorage...');
            localStorage.removeItem("recipe-flow-favorites");
            console.log('[FavoritesStore] localStorage cleared. Starting fresh!');
            initialFavorites = [];
          } else if (parsed[0].mealId && typeof parsed[0].addedAt === 'number') {
            // New format - use it
            console.log('[FavoritesStore] New format detected. Loading favorites...');
            initialFavorites = parsed;
          } else {
            // Unknown format - clear it
            console.log('[FavoritesStore] Unknown format detected. Clearing localStorage...');
            localStorage.removeItem("recipe-flow-favorites");
            initialFavorites = [];
          }
        }
      } catch (error) {
        console.error('[FavoritesStore] Error parsing localStorage. Clearing...', error);
        localStorage.removeItem("recipe-flow-favorites");
        initialFavorites = [];
      }
    }
  }

  console.log('[FavoritesStore] Initialized with', initialFavorites.length, 'favorites');
  console.log('[FavoritesStore] Initial favorites:', initialFavorites);

  const { subscribe, set, update } = writable<FavoriteItem[]>(initialFavorites)

  return {
    subscribe,
    
    addFavorite: (mealId: string) => {
      console.log('[FavoritesStore] Adding favorite:', mealId);
      update((favorites) => {
        if (!favorites.some((fav) => fav.mealId === mealId)) {
          const newFavorite: FavoriteItem = { 
            mealId, 
            addedAt: Date.now() 
          };
          const updated = [...favorites, newFavorite];
          
          if (typeof window !== "undefined") {
            localStorage.setItem("recipe-flow-favorites", JSON.stringify(updated));
            console.log('[FavoritesStore] Saved to localStorage. Total:', updated.length);
          }
          
          console.log('[FavoritesStore] Added favorite successfully:', newFavorite);
          console.log('[FavoritesStore] All favorites:', updated.map(f => ({ id: f.mealId, addedAt: f.addedAt })));
          return updated;
        }
        console.log('[FavoritesStore] Recipe already in favorites:', mealId);
        return favorites;
      })
    },
    
    removeFavorite: (mealId: string) => {
      console.log('[FavoritesStore] Removing favorite:', mealId);
      update((favorites) => {
        const updated = favorites.filter((fav) => fav.mealId !== mealId);
        
        if (typeof window !== "undefined") {
          localStorage.setItem("recipe-flow-favorites", JSON.stringify(updated));
          console.log('[FavoritesStore] Removed from localStorage. Total:', updated.length);
        }
        
        console.log('[FavoritesStore] Removed favorite successfully');
        console.log('[FavoritesStore] Remaining favorites:', updated.map(f => ({ id: f.mealId, addedAt: f.addedAt })));
        return updated;
      })
    },
    
    toggleFavorite: (mealId: string) => {
      console.log('[FavoritesStore] Toggling favorite:', mealId);
      update((favorites) => {
        let updated: FavoriteItem[];
        
        if (favorites.some((fav) => fav.mealId === mealId)) {
          // Remove
          updated = favorites.filter((fav) => fav.mealId !== mealId);
          console.log('[FavoritesStore] Toggled OFF (removed)');
        } else {
          // Add
          const newFavorite: FavoriteItem = { 
            mealId, 
            addedAt: Date.now() 
          };
          updated = [...favorites, newFavorite];
          console.log('[FavoritesStore] Toggled ON (added):', newFavorite);
        }
        
        if (typeof window !== "undefined") {
          localStorage.setItem("recipe-flow-favorites", JSON.stringify(updated));
        }
        
        console.log('[FavoritesStore] After toggle, total favorites:', updated.length);
        console.log('[FavoritesStore] All favorites:', updated.map(f => ({ id: f.mealId, addedAt: f.addedAt })));
        return updated;
      })
    },
    
    isFavorite: (mealId: string): boolean => {
      let isFav = false;
      const unsubscribe = subscribe((favorites) => {
        isFav = favorites.some((fav) => fav.mealId === mealId);
      });
      unsubscribe();
      return isFav;
    },
  }
}

export const favorites = createFavoritesStore()