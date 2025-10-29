<script lang="ts">
	import RecipeSearch from '$lib/components/recipe-search.svelte';
	import RecipeGrid from '$lib/components/recipe-grid.svelte';
	import RecipeDetail from '$lib/components/recipe-detail.svelte';
	import RecipeSuggestions from '$lib/components/recipe-suggestions.svelte';
	import FavoritesView from '$lib/components/favorites-view.svelte';
	import ThemeToggle from '$lib/components/theme-toggle.svelte';
	import { onMount } from 'svelte';

	let recipes: any[] = $state([]);
	let suggestions: any[] = $state([]);
	let selectedRecipe: any = $state(null);
	let isLoading = $state(false);
	let isSuggestionsLoading = $state(false);
	let error = $state('');
	let searchType: 'ingredient' | 'category' | 'random' = $state('ingredient');
	let searchedIngredients: string[] = $state([]);
	let hasSearched = $state(false);
	let currentView: 'home' | 'favorites' = $state('home');

	const suggestedIngredients = [
		'chicken',
		'pasta',
		'beef',
		'fish',
		'tomato',
		'garlic',
		'onion',
		'cheese',
		'egg',
		'rice'
	];

	async function loadSuggestions() {
		isSuggestionsLoading = true;
		try {
			const shuffled = [...suggestedIngredients].sort(() => Math.random() - 0.5);
			let loadedSuggestions: any[] = [];
			let ingredientIndex = 0;

			// Keep trying until we have 4 suggestions or run out of ingredients
			while (loadedSuggestions.length < 4 && ingredientIndex < shuffled.length) {
				const ingredient = shuffled[ingredientIndex];
				ingredientIndex++;

				try {
					const response = await fetch(
						`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
					);
					const data = await response.json();
					
					if (data.meals && data.meals.length > 0) {
						const randomRecipe = data.meals[Math.floor(Math.random() * data.meals.length)];
						loadedSuggestions.push({
							...randomRecipe,
							suggestedIngredient: ingredient
						});
					}
				} catch (err) {
					console.error(`Error fetching suggestions for ${ingredient}:`, err);
				}
			}

			suggestions = loadedSuggestions;
		} catch (err) {
			console.error('Error loading suggestions:', err);
		} finally {
			isSuggestionsLoading = false;
		}
	}

	async function handleMultipleIngredients(query: string) {
		isLoading = true;
		error = '';
		recipes = [];

		try {
			// Split input by comma and clean up
			const ingredients = query
				.split(',')
				.map((ing) => ing.trim().toLowerCase())
				.filter((ing) => ing.length > 0);

			if (ingredients.length === 0) {
				error = 'Please enter at least one ingredient';
				isLoading = false;
				return;
			}

			searchedIngredients = ingredients;

			// Fetch recipes for each ingredient
			const allRecipes = await Promise.all(
				ingredients.map(async (ingredient) => {
					try {
						const response = await fetch(
							`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
						);
						const data = await response.json();
						return data.meals || [];
					} catch (err) {
						console.error(`Error fetching recipes for ${ingredient}:`, err);
						return [];
					}
				})
			);

			// Create a map of meal IDs to their matching ingredient count
			const mealMap = new Map<string, { meal: any; matchCount: number }>();

			allRecipes.forEach((mealList, ingredientIndex) => {
				mealList.forEach((meal: any) => {
					if (mealMap.has(meal.idMeal)) {
						// Increment match count if meal already exists
						const existing = mealMap.get(meal.idMeal)!;
						existing.matchCount += 1;
					} else {
						// Add new meal with match count of 1
						mealMap.set(meal.idMeal, { meal, matchCount: 1 });
					}
				});
			});

			// Convert map to array and filter to show only recipes with at least 50% of ingredients
			// This prevents showing recipes with just 1 matching ingredient when searching for 5
			const minMatchCount = Math.max(1, Math.ceil(ingredients.length * 0.5));
			const combinedRecipes = Array.from(mealMap.values())
				.filter((item) => item.matchCount >= minMatchCount)
				.sort((a, b) => b.matchCount - a.matchCount)
				.map((item) => ({
					...item.meal,
					matchCount: item.matchCount,
					totalIngredients: ingredients.length
				}));

			if (combinedRecipes.length === 0) {
				error = `No recipes found with ingredients: ${ingredients.join(', ')}. Try different ingredients!`;
				recipes = [];
			} else {
				recipes = combinedRecipes;
			}
		} catch (err) {
			error = 'Something went wrong. Please try again.';
			console.error('Error fetching recipes:', err);
		} finally {
			isLoading = false;
		}
	}

	// Fetch recipes based on search type
	async function handleSearch(query: string) {
		isLoading = true;
		error = '';
		recipes = [];
		searchedIngredients = [];
		hasSearched = true;

		try {
			let url = '';

			if (searchType === 'ingredient') {
				await handleMultipleIngredients(query);
				return;
			} else if (searchType === 'category') {
				url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(query)}`;
			} else if (searchType === 'random') {
				url = `https://www.themealdb.com/api/json/v1/1/random.php`;
			}

			const response = await fetch(url);
			if (!response.ok) throw new Error('Failed to fetch recipes');

			const data = await response.json();

			if (!data.meals || data.meals.length === 0) {
				error = `No recipes found for "${query}". Try another search!`;
				recipes = [];
			} else {
				recipes = data.meals;
			}
		} catch (err) {
			error = 'Something went wrong. Please try again.';
			console.error('Error fetching recipes:', err);
		} finally {
			isLoading = false;
		}
	}

	// Fetch full recipe details
	async function handleSelectRecipe(mealId: string) {
		try {
			const response = await fetch(
				`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
			);
			const data = await response.json();
			if (data.meals && data.meals.length > 0) {
				selectedRecipe = data.meals[0];
			}
		} catch (err) {
			console.error('Error fetching recipe details:', err);
		}
	}

	function closeDetail() {
		selectedRecipe = null;
	}

	function handleSearchTypeChange(type: 'ingredient' | 'category' | 'random') {
		searchType = type;
		recipes = [];
		error = '';
	}

	function handleSuggestedIngredientClick(ingredient: string) {
		handleSearch(ingredient);
	}

	function goHome() {
		currentView = 'home';
		selectedRecipe = null;
		recipes = [];
		error = '';
		searchedIngredients = [];
		searchType = 'ingredient';
		hasSearched = false;
		loadSuggestions();
	}

	function goToFavorites() {
		currentView = 'favorites';
		recipes = [];
		selectedRecipe = null;
		error = '';
		searchedIngredients = [];
		hasSearched = false;
	}

	onMount(() => {
		loadSuggestions();
	});
</script>

<div class="min-h-screen bg-gradient-to-br from-background via-background to-muted">
	<!-- Header -->
	<header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm animate-slide-in-down">
		<div class="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between gap-2 sm:gap-3">
				<button
					onclick={goHome}
					class="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-smooth cursor-pointer group"
				>
					<div class="text-2xl sm:text-3xl flex-shrink-0 animate-bounce-gentle group-hover:scale-110 transition-smooth leading-none">🍳</div>
					<div class="min-w-0 flex flex-col justify-center">
						<h1 class="text-xl sm:text-2xl font-bold text-foreground truncate group-hover:text-primary transition-smooth leading-tight">RecipeFlow</h1>
						<p class="text-xs sm:text-sm text-muted-foreground truncate leading-tight">Discover recipes for your mood</p>
					</div>
				</button>
				<div class="flex items-center gap-2 sm:gap-3">
					<button
						onclick={goToFavorites}
						class="px-3 sm:px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200 cursor-pointer font-medium text-sm sm:text-base"
					>
						❤️ Favorites
					</button>
					<ThemeToggle />
				</div>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="mx-auto w-full max-w-7xl px-3 py-6 sm:px-6 lg:px-8">
		{#if currentView === 'favorites'}
			<FavoritesView onNavigateHome={goHome} />
		{:else}
			<!-- Search Section -->
			<div class="animate-slide-in-up">
				<RecipeSearch
					{searchType}
					{isLoading}
					onSearch={handleSearch}
					onSearchTypeChange={handleSearchTypeChange}
				/>
			</div>

			<!-- Filters Section -->

			<!-- Error State -->
			{#if error}
				<div class="animate-slide-in-down my-4 sm:my-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 sm:p-4 transition-smooth">
					<p class="text-xs sm:text-sm font-medium text-destructive">⚠️ {error}</p>
				</div>
			{/if}

			<!-- Loading State with Enhanced Loader -->
			{#if isLoading}
				<div class="flex justify-center py-12 sm:py-16 animate-fade-in">
					<div class="flex flex-col items-center gap-3 sm:gap-4">
						<!-- Enhanced loader with multiple animation layers -->
						<div class="relative h-16 w-16 sm:h-20 sm:w-20">
							<!-- Outer rotating ring -->
							<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin-slow"></div>
							<!-- Middle pulsing ring -->
							<div class="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse-glow"></div>
							<!-- Inner rotating ring (opposite direction) -->
							<div class="absolute inset-4 rounded-full border-2 border-transparent border-b-secondary animate-spin-fast" style="animation-direction: reverse;"></div>
							<!-- Center dot -->
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="h-2 w-2 rounded-full bg-primary animate-bounce-gentle"></div>
							</div>
						</div>
						<p class="text-sm sm:text-base text-muted-foreground text-center">Finding delicious recipes...</p>
						<!-- Added loading progress indicator -->
						<div class="w-32 sm:w-40 h-1 bg-muted rounded-full overflow-hidden">
							<div class="h-full bg-gradient-to-r from-primary via-secondary to-primary shimmer-loading"></div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Show suggestions when no search has been performed -->
			{#if !hasSearched && !isLoading && suggestions.length > 0}
				<div class="animate-fade-in transition-smooth mt-6 sm:mt-8">
					<RecipeSuggestions
						{suggestions}
						isLoading={isSuggestionsLoading}
						onSelectRecipe={handleSelectRecipe}
						onSuggestedIngredientClick={handleSuggestedIngredientClick}
					/>
				</div>
			{/if}

			<!-- Recipe Grid -->
			{#if recipes.length > 0 && !isLoading}
				<div class="animate-fade-in transition-smooth">
					<!-- Hide search info box after results load - only show during loading -->
					{#if searchedIngredients.length > 0}
						<div class="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-primary/10 border border-primary/20">
							<p class="text-xs sm:text-sm text-foreground">
								<span class="font-semibold">Searched for:</span>
								<span class="ml-2">{searchedIngredients.join(', ')}</span>
							</p>
							<p class="text-xs sm:text-sm text-muted-foreground mt-1">
								Showing recipes sorted by ingredient matches (recipes with more matching ingredients appear first)
							</p>
						</div>
					{/if}
					<h2 class="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-foreground">
						Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
					</h2>
					<RecipeGrid {recipes} onSelectRecipe={handleSelectRecipe} />
				</div>
			{/if}

			{#if isLoading}
				<div class="animate-fade-in transition-smooth">
					<h2 class="mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-foreground">Loading recipes...</h2>
					<RecipeGrid recipes={[]} {isLoading} onSelectRecipe={handleSelectRecipe} />
				</div>
			{/if}

			<!-- Empty State -->
			{#if recipes.length === 0 && !isLoading && !error && hasSearched}
				<div class="flex flex-col items-center justify-center py-12 sm:py-16 animate-scale-in">
					<div class="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-float">👨‍🍳</div>
					<h3 class="text-lg sm:text-xl font-semibold text-foreground mb-2">No recipes found</h3>
					<p class="text-xs sm:text-sm text-muted-foreground text-center max-w-md px-2">
						Try searching with different ingredients or browse by category
					</p>
				</div>
			{/if}
		{/if}
	</main>

	<!-- Recipe Detail Modal -->
	{#if selectedRecipe}
		<RecipeDetail recipe={selectedRecipe} onClose={closeDetail} />
	{/if}
</div>