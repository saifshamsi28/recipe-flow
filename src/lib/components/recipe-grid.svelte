<script lang="ts">
	import RecipeSkeleton from './recipe-skeleton.svelte';

	interface Props {
		recipes: any[];
		onSelectRecipe: (mealId: string) => void;
		isLoading?: boolean;
	}

	let { recipes, onSelectRecipe, isLoading = false } = $props();
</script>

<!-- Enhanced grid with staggered animations and improved hover effects -->
<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
	{#if isLoading}
		<!-- Show skeleton loaders while loading -->
		{#each Array(8) as _, index}
			<div class="animate-fade-in" style="animation-delay: {index * 50}ms">
				<RecipeSkeleton />
			</div>
		{/each}
	{:else}
		{#each recipes as recipe, index (recipe.idMeal)}
			<button
				onclick={() => onSelectRecipe(recipe.idMeal)}
				class="group cursor-pointer animate-fade-in overflow-hidden rounded-lg border border-border bg-card transition-smooth hover:shadow-xl hover:border-primary hover:scale-105 h-full relative"
				style="animation-delay: {index * 50}ms"
			>
				<!-- Add match count badge for multiple ingredient searches -->
				{#if recipe.matchCount && recipe.totalIngredients}
					<div class="absolute top-2 right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
						{recipe.matchCount}/{recipe.totalIngredients}
					</div>
				{/if}

				<div class="relative overflow-hidden bg-muted h-40 sm:h-48">
					<img
						src={recipe.strMealThumb || "/placeholder.svg"}
						alt={recipe.strMeal}
						class="h-full w-full object-cover transition-smooth duration-500 group-hover:scale-125 group-hover:rotate-1"
					/>
					<!-- Added gradient overlay on hover -->
					<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-smooth group-hover:opacity-100"></div>
					<!-- Added "View Recipe" indicator -->
					<div class="absolute inset-0 flex items-center justify-center opacity-0 transition-smooth group-hover:opacity-100">
						<span class="text-white font-semibold text-sm sm:text-base bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">View Recipe</span>
					</div>
				</div>
				<div class="p-3 sm:p-4">
					<h3 class="font-semibold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
						{recipe.strMeal}
					</h3>
					<p class="mt-2 text-xs sm:text-sm text-muted-foreground group-hover:text-foreground transition-smooth">Click to view recipe</p>
				</div>
			</button>
		{/each}
	{/if}
</div>
