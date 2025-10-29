<script lang="ts">
	import { favorites } from '$lib/stores/favorites.ts';
	import RecipeDetail from './recipe-detail.svelte';
	import { onMount } from 'svelte';

	interface Props {
		onNavigateHome?: () => void;
	}

	let { onNavigateHome }: Props = $props();

	let favoriteRecipes: any[] = $state([]);
	let selectedRecipe: any = $state(null);
	let isLoading = $state(false);
	let error = $state('');
	let favoriteItems: any[] = $state([]);

	onMount(() => {
		console.log('[FavoritesView] Component mounted');
		const unsubscribe = favorites.subscribe((items) => {
			favoriteItems = items;
			console.log('[FavoritesView] Favorites items updated:', items);
			console.log('[FavoritesView] Items with timestamps:', items.map(i => ({ id: i.mealId, addedAt: i.addedAt })));
			loadFavoriteRecipes(items);
		});

		return unsubscribe;
	});

	async function loadFavoriteRecipes(favoriteItemsToLoad: any[]) {
		console.log('[FavoritesView] Loading favorite recipes. Count:', favoriteItemsToLoad.length);
		
		if (favoriteItemsToLoad.length === 0) {
			favoriteRecipes = [];
			isLoading = false;
			error = '';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const recipePromises = favoriteItemsToLoad.map(async (item) => {
				try {
					const controller = new AbortController();
					const timeoutId = setTimeout(() => controller.abort(), 10000);

					console.log(`[FavoritesView] Fetching recipe: ${item.mealId}`);
					const response = await fetch(
						`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.mealId}`,
						{ signal: controller.signal }
					);
					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(`HTTP error! status: ${response.status}`);
					}

					const data = await response.json();
					const meal = data.meals ? data.meals[0] : null;
					
					if (meal) {
						console.log(`[FavoritesView] Loaded recipe: ${meal.strMeal}, addedAt: ${item.addedAt}`);
						return { ...meal, addedAt: item.addedAt };
					}
					return null;
				} catch (err) {
					console.error(`[FavoritesView] Error fetching recipe ${item.mealId}:`, err);
					return null;
				}
			});

			const recipes = await Promise.all(recipePromises);
			const validRecipes = recipes.filter((r) => r !== null);

			console.log('[FavoritesView] Valid recipes loaded:', validRecipes.length);
			console.log('[FavoritesView] Recipe timestamps before sort:', validRecipes.map(r => ({ name: r.strMeal, addedAt: r.addedAt })));

			if (validRecipes.length === 0 && favoriteItemsToLoad.length > 0) {
				error = 'Unable to load recipes. Please check your internet connection and try again.';
			}

			// Sort by addedAt timestamp in descending order (most recent first)
			favoriteRecipes = validRecipes.sort((a, b) => {
				const timeA = a.addedAt || 0;
				const timeB = b.addedAt || 0;
				return timeB - timeA;
			});
			
			console.log('[FavoritesView] Sorted recipes:', favoriteRecipes.map(r => ({ name: r.strMeal, addedAt: r.addedAt })));
		} catch (err) {
			error = 'Failed to load favorite recipes. Please check your internet connection.';
			console.error('[FavoritesView] Error loading favorites:', err);
			favoriteRecipes = [];
		} finally {
			isLoading = false;
			console.log('[FavoritesView] Loading complete. Total recipes:', favoriteRecipes.length);
		}
	}

	function retryLoad() {
		console.log('[FavoritesView] Retrying load...');
		loadFavoriteRecipes(favoriteItems);
	}

	async function handleSelectRecipe(mealId: string) {
		console.log('[FavoritesView] Selecting recipe:', mealId);
		try {
			const response = await fetch(
				`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
			);
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			if (data.meals && data.meals.length > 0) {
				selectedRecipe = data.meals[0];
				console.log('[FavoritesView] Recipe selected:', selectedRecipe.strMeal);
			}
		} catch (err) {
			console.error('[FavoritesView] Error fetching recipe details:', err);
			error = 'Failed to load recipe details. Please try again.';
		}
	}

	function closeDetail() {
		console.log('[FavoritesView] Closing recipe detail');
		selectedRecipe = null;
	}

	function removeFavorite(mealId: string) {
		console.log('[FavoritesView] Removing favorite:', mealId);
		favorites.removeFavorite(mealId);
	}
</script>

<div class="animate-fade-in">
	<div class="mb-6 sm:mb-8">
		<h2 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">❤️ My Favorites</h2>
		<p class="text-sm sm:text-base text-muted-foreground">
			{favoriteRecipes.length} recipe{favoriteRecipes.length !== 1 ? 's' : ''} saved
		</p>
	</div>

	<!-- Enhanced error display with retry button -->
	{#if error}
		<div class="rounded-lg border border-destructive/30 bg-destructive/10 p-4 mb-6 animate-slide-in-down">
			<div class="flex items-start gap-3">
				<span class="text-lg">⚠️</span>
				<div class="flex-1">
					<p class="text-sm font-medium text-destructive mb-2">{error}</p>
					<button
						onclick={retryLoad}
						class="text-xs font-medium text-destructive hover:underline cursor-pointer"
					>
						Try Again
					</button>
				</div>
			</div>
		</div>
	{/if}

	{#if isLoading}
		<div class="flex justify-center py-12 sm:py-16 animate-fade-in">
			<div class="flex flex-col items-center gap-3 sm:gap-4">
				<div class="relative h-16 w-16 sm:h-20 sm:w-20">
					<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin-slow"></div>
					<div class="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse-glow"></div>
					<div class="absolute inset-4 rounded-full border-2 border-transparent border-b-secondary animate-spin-fast" style="animation-direction: reverse;"></div>
					<div class="absolute inset-0 flex items-center justify-center">
						<div class="h-2 w-2 rounded-full bg-primary animate-bounce-gentle"></div>
					</div>
				</div>
				<p class="text-sm sm:text-base text-muted-foreground">Loading your favorites...</p>
			</div>
		</div>
	{:else if favoriteRecipes.length === 0}
		<div class="flex flex-col items-center justify-center py-12 sm:py-16 rounded-lg border-2 border-dashed border-border bg-muted/30 animate-scale-in">
			<div class="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-float">🍽️</div>
			<h3 class="text-lg sm:text-xl font-semibold text-foreground mb-2">No favorites yet</h3>
			<p class="text-sm sm:text-base text-muted-foreground text-center max-w-md mb-4 px-4">
				Start exploring recipes and click the heart icon to save your favorites!
			</p>
			{#if onNavigateHome}
				<button
					onclick={onNavigateHome}
					class="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 cursor-pointer font-medium text-sm sm:text-base"
				>
					🔍 Explore Recipes
				</button>
			{/if}
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
			{#each favoriteRecipes as recipe, index (recipe.idMeal)}
				<div
					class="group relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-primary cursor-pointer animate-scale-in"
					style="animation-delay: {index * 50}ms"
					onclick={() => handleSelectRecipe(recipe.idMeal)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							handleSelectRecipe(recipe.idMeal);
						}
					}}
					role="button"
					tabindex="0"
				>
					<div class="relative h-40 sm:h-48 overflow-hidden bg-muted">
						<img
							src={recipe.strMealThumb || "/placeholder.svg"}
							alt={recipe.strMeal}
							class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-1"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
							<span class="text-white text-sm font-semibold">View Recipe</span>
						</div>
						<!-- Badge showing it's a favorite -->
						<div class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 shadow-lg">
							<span class="text-xs">❤️</span>
						</div>
					</div>

					<div class="p-3 sm:p-4">
						<h3 class="font-semibold text-foreground line-clamp-2 text-sm sm:text-base mb-2 group-hover:text-primary transition-colors">
							{recipe.strMeal}
						</h3>
						<p class="text-xs sm:text-sm text-muted-foreground mb-3">
							{recipe.strCategory || 'Recipe'} • {recipe.strArea || 'International'}
						</p>

						<button
							onclick={(e) => {
								e.stopPropagation();
								removeFavorite(recipe.idMeal);
							}}
							class="w-full px-3 py-2 text-xs sm:text-sm rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors duration-200 cursor-pointer font-medium"
						>
							💔 Remove from Favorites
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

{#if selectedRecipe}
	<RecipeDetail recipe={selectedRecipe} onClose={closeDetail} />
{/if}