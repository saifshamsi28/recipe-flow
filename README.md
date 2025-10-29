# 🍳 RecipeFlow - Premium Recipe Discovery App

A modern, interactive recipe discovery application built for busy professionals like Taylor who want to find inspiration in the kitchen quickly. Features intelligent multi-ingredient search, dark mode, favorites system, and beautiful animations.

---

## 🎥 Demo Video

▶️ [Watch the Full Project Demo on YouTube](https://youtu.be/BXwW_Fk1Klo?si=RNHlcjgAI4sGC_9Y)

---

## 🌐 Live Project

🔗 **Vercel Deployment:** [https://recipe-flow-bice.vercel.app/](https://recipe-flow-bice.vercel.app/)

---

## 📸 Project Snapshots

### 🏠 Home Page
<p align="center">
  <img src="./snapshots/home%20page%20light%20snapshot.png" width="48%" alt="Home Page Light" style="margin:5px;"/>
  <img src="./snapshots/homepage%20dark%20snapshot.png" width="48%" alt="Home Page Dark" style="margin:5px;"/>
</p>

---

### 🔎 Searching Recipes
<p align="center">
  <img src="./snapshots/search%20with%20ingredients%20.png" width="48%" alt="Search With Ingredients" style="margin:5px;"/>
  <img src="./snapshots/loading%20recipe.png" width="48%" alt="Loading Recipe" style="margin:5px;"/>
</p>

---

### 🍽️ Recipe Details
<p align="center">
  <img src="./snapshots/recipe%20detail.png" width="48%" alt="Recipe Detail" style="margin:5px;"/>
  <img src="./snapshots/recipe%20detail%20ingrdnt.png" width="48%" alt="Recipe Ingredients" style="margin:5px;"/>
</p>

---

### ❤️ Favourite Items
<p align="center">
  <img src="./snapshots/favourite%20items.png" width="48%" alt="Favourite Items" style="margin:5px;"/>
  <img src="./snapshots/home%20page%20light%20snapshot.png" width="48%" alt="Another Snapshot" style="margin:5px;"/>
</p>

---

### 📱 Mobile Views
<p align="center">
  <img src="./snapshots/mobile%20landing%20page.jpg" width="30%" alt="Mobile Landing Page" style="margin:5px;"/>
  <img src="./snapshots/mobile%20search%20page.jpg" width="30%" alt="Mobile Search Page" style="margin:5px;"/>
  <img src="./snapshots/mobile%20favourites.jpg" width="30%" alt="Mobile Favourites" style="margin:5px;"/>
</p>




## 🎯 Why This Project?

**User Need:** Taylor is a busy professional who wants to cook when coming home but needs quick inspiration. They might want to:
- Cook based on ingredients they have (single or multiple)
- Browse recipes by category
- Get random recipe suggestions
- Save favorite recipes for later
- See detailed instructions with YouTube tutorials
- Quick access to recent searches

**Solution:** RecipeFlow provides multiple discovery methods with a beautiful, responsive interface that makes finding recipes enjoyable and quick. The app includes smart features like multi-ingredient intersection logic and persistent favorites.

## 🔧 Technology Stack

- **Framework:** SvelteKit (Svelte 5 with runes)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **API:** TheMealDB API (free, no authentication required)
- **State Management:** Svelte stores and reactive variables ($state, $derived)
- **Animations:** Custom CSS keyframes and Tailwind transitions
- **Storage:** localStorage for theme, favorites, and search history
- **Icons:** Unicode emojis for visual hierarchy

## 📡 API Used

**TheMealDB API** - Free recipe database with no authentication:
- `GET /filter.php?i={ingredient}` - Search by ingredient
- `GET /filter.php?c={category}` - Search by category
- `GET /random.php` - Get random recipe
- `GET /lookup.php?i={mealId}` - Get full recipe details

### Smart Multi-Ingredient Search Logic

The app implements intelligent intersection logic that the API doesn't natively support:

**How it works:**
1. User enters: "chicken, onion, garlic"
2. App splits into array: ["chicken", "onion", "garlic"]
3. Fetches recipes for EACH ingredient separately
4. Counts how many ingredients each recipe contains
5. Filters to show only recipes with at least 50% ingredient match
6. Sorts by match count (recipes with more matching ingredients appear first)
7. Displays match count badge on each card (e.g., "2/3")

**Example:** Search for 5 ingredients → Shows recipes with 3+ matching ingredients first, then 2 matching, etc.

## 🎨 Features

### Core Functionality
- **Multi-Ingredient Search** - Find recipes with multiple ingredients using smart intersection logic
- **Single Ingredient Search** - Quick search for recipes with one ingredient
- **Browse by Category** - Explore different meal types (Seafood, Dessert, etc.)
- **Random Recipe** - Get inspired with AI-powered random suggestions
- **Detailed Recipe View** - Full ingredients, step-by-step instructions, and YouTube tutorials
- **Favorites System** - Save recipes with heart icon, persisted to localStorage
- **Search History** - Quick access to last 10 searches
 


### UI/UX Enhancements
- **Dark/Light Mode** - Toggle theme with system preference detection, persisted to localStorage  
- **Skeleton Loaders** - Beautiful shimmer loading states while fetching recipes  
- **Smooth Animations** - Staggered card animations, fade-ins, and hover effects  
- **Error Handling** - Friendly messages for no results or network errors  
- **Loading States** - Visual feedback during API calls  
- **Mobile Responsive** - Works perfectly on all screen sizes (mobile, tablet, desktop)  
- **Warm Color Palette** - Culinary-inspired design with orange/amber tones  
- **Cursor Feedback** - Hand cursor on all clickable elements

### Code Quality
- **Modular Components** - Separate components for search, grid, detail, favorites, and history
- **Meaningful Names** - Clear variable and function names throughout
- **Comments** - Inline comments explaining key logic
- **Error Boundaries** - Try-catch blocks for all API calls
- **Accessibility** - Semantic HTML, ARIA attributes, keyboard navigation
- **Performance** - Optimized re-renders with Svelte reactivity

## 🛠️ Edge Cases Handled

1. **No Results Found** - Shows friendly message suggesting alternative searches
2. **Network Errors** - Catches and displays error messages gracefully
3. **Missing Data** - Handles recipes with missing ingredients or instructions
4. **Empty Ingredients** - Filters out empty ingredient slots (API returns 20 slots)
5. **Long Instructions** - Splits by periods and numbers steps for readability
6. **Missing Images** - Uses fallback styling if image fails to load
7. **Disabled States** - Prevents multiple submissions while loading
8. **Multiple Ingredients** - Properly intersects results to show only relevant recipes
9. **Partial Matches** - Shows recipes with some (not all) searched ingredients
10. **localStorage Errors** - Gracefully handles storage quota exceeded
11. **YouTube URL Parsing** - Handles various YouTube URL formats
12. **Empty Search** - Prevents empty searches and shows helpful message

## 📱 Responsive Design

- **Mobile (< 640px)** - Single column grid, optimized touch targets, stacked layout
- **Tablet (640px - 1024px)** - Two column grid with adjusted spacing
- **Desktop (> 1024px)** - Three column grid with enhanced spacing and hover effects

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ and npm

### Installation
\`\`\`bash
# Clone the repository
git clone <repo-url>

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:5173
\`\`\`

### Build for Production
\`\`\`bash
npm run build
npm run preview
\`\`\`

## 📦 Project Structure

\`\`\`
src/  
├── routes/  
│   ├── +page.svelte              # Main page with state management    
│   └── +layout.svelte            # Root layout with theme provider  
├── lib/  
│   ├── stores/  
│   │   ├── theme.ts              # Dark/light mode store  
│   │   ├── favorites.ts          # Favorites management  
│   │   └── search-history.ts     # Search history store  
│   └── components/  
│       ├── recipe-search.svelte       # Search interface  
│       ├── recipe-grid.svelte         # Recipe cards grid  
│       ├── recipe-detail.svelte       # Recipe modal with details  
│       ├── recipe-skeleton.svelte     # Loading skeleton  
│       ├── favorite-button.svelte     # Heart icon for favorites  
│       ├── search-history.svelte      # Recent searches dropdown  
│       ├── theme-toggle.svelte        # Dark/light mode toggle  
│       ├── youtube-embed.svelte       # YouTube video embed  
│       ├── ai-suggestion-button.svelte # AI-powered suggestions  
│       └── recipe-suggestions.svelte  # Initial page suggestions  
└── app.css                       # Tailwind config + custom animations  
\`\`\`

## 🎨 Design Decisions

- **Warm Color Palette** - Orange (#FF8C42) and amber tones evoke cooking and warmth
- **Card-Based Layout** - Familiar pattern for recipe browsing
- **Modal for Details** - Keeps context while viewing full recipes
- **Emoji Icons** - Adds personality and visual hierarchy
- **Smooth Animations** - Fade-ins and hover effects feel premium
- **Dark Mode** - Reduces eye strain and provides modern aesthetic
- **Skeleton Loaders** - Better perceived performance than spinners
- **localStorage Persistence** - Remembers user preferences and favorites

## 🔄 State Flow

\`\`\`
User Input (Search/Category/Random/Favorites)
    ↓
handleSearch() - Fetch from API
    ↓
Multi-ingredient intersection logic (if multiple ingredients)
    ↓
Sort by ingredient match count
    ↓
Update recipes array
    ↓
Display RecipeGrid with skeleton loaders
    ↓
User clicks recipe
    ↓
handleSelectRecipe() - Fetch full details
    ↓
Display RecipeDetail modal with YouTube embed
    ↓
User can save to favorites (persisted to localStorage)
\`\`\`

## 🌟 "Wow" Details

- Animated loading spinner with gradient border and pulsing glow
- Staggered skeleton loaders with shimmer effect
- Smooth fade-in animations for recipe cards
- Image zoom and rotate on hover
- Numbered instruction steps with animations
- Gradient overlay on hover with "View Recipe" indicator
- Sticky header with backdrop blur
- Smooth modal transitions with scale animation
- Dark mode with smooth color transitions
- Heart icon animation when favoriting
- Search history with quick-access buttons
- AI-powered suggestion button with random ingredient selection
- YouTube video embeds with responsive sizing

## 📝 Implementation Notes

### Multi-Ingredient Search Algorithm
\`\`\`javascript
- Fetch recipes for each ingredient
- Create a map: mealId -> { meal, matchCount }
- Filter recipes with at least 50% ingredient match
- Sort by matchCount descending
- Display with match count badge
\`\`\`

### localStorage Keys
- `recipeflow-theme` - Current theme (light/dark)
- `recipeflow-favorites` - Array of favorite meal IDs
- `recipeflow-search-history` - Array of recent searches

### API Rate Limiting
- TheMealDB has no official rate limit but is free
- App batches requests efficiently
- Caches results in component state

## 🎓 Learning Outcomes

This project demonstrates:
- Advanced API integration with multi-fetch intersection logic
- Responsive design patterns with Tailwind CSS
- Component composition and reusability in Svelte
- State management with Svelte stores and reactivity
- CSS animations and transitions for polish
- localStorage for data persistence
- Error handling and edge case management
- Accessibility best practices
- Dark mode implementation
- User experience optimization

## 🚀 Deployment

Deploy to static host:
- **Vercel Deployed Link** : https://recipe-flow-bice.vercel.app/

Chatgpt discussion link:
- https://chatgpt.com/share/6901acd3-86b8-8001-962e-f6f8c49b10ca

## 🙏 Credits

- **API:** TheMealDB (https://www.themealdb.com/)
- **Framework:** SvelteKit (https://kit.svelte.dev/)
- **Styling:** Tailwind CSS (https://tailwindcss.com/)
