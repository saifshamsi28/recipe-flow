<script lang="ts">
	interface Props {
		suggestions: any[];
		isLoading: boolean;
		onSelectRecipe: (mealId: string) => void;
		onSuggestedIngredientClick: (ingredient: string) => void;
	}

	let { suggestions, isLoading, onSelectRecipe, onSuggestedIngredientClick } = $props();
</script>

<!-- Suggested Recipes Section -->
<div class="mb-8 sm:mb-12 animate-fade-in">
	<div class="mb-4 sm:mb-6">
		<h2 class="text-lg sm:text-2xl font-bold text-foreground mb-1">Suggested Recipes</h2>
		<p class="text-xs sm:text-sm text-muted-foreground">
			Get inspired! Click on any recipe or ingredient to explore
		</p>
	</div>

	{#if isLoading}
		<div class="flex justify-center py-8 sm:py-12">
			<div class="flex flex-col items-center gap-3 sm:gap-4">
				<div class="relative h-12 w-12 sm:h-16 sm:w-16">
					<div class="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary animate-spin-slow"></div>
					<div class="absolute inset-2 rounded-full border-2 border-primary/30 animate-pulse-glow"></div>
				</div>
				<p class="text-xs sm:text-sm text-muted-foreground">Loading suggestions...</p>
			</div>
		</div>
	{:else if suggestions.length > 0}
		<div class="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each suggestions as recipe, index (recipe.idMeal)}
				<div
					class="group animate-fade-in overflow-hidden rounded-lg border border-border bg-card transition-smooth hover:shadow-xl hover:border-primary hover:scale-105 h-full relative cursor-pointer"
					style="animation-delay: {index * 50}ms"
					onclick={() => onSelectRecipe(recipe.idMeal)}
					role="button"
					tabindex="0"
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							onSelectRecipe(recipe.idMeal);
						}
					}}
				>
					<!-- Ingredient badge -->
					{#if recipe.suggestedIngredient}
						<div class="absolute top-2 left-2 z-10 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full shadow-lg">
							{recipe.suggestedIngredient}
						</div>
					{/if}

					<div class="relative overflow-hidden bg-muted h-40 sm:h-48">
						<img
							src={recipe.strMealThumb || "/placeholder.svg"}
							alt={recipe.strMeal}
							class="h-full w-full object-cover transition-smooth duration-500 group-hover:scale-125 group-hover:rotate-1"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-smooth group-hover:opacity-100"></div>
						<div class="absolute inset-0 flex items-center justify-center opacity-0 transition-smooth group-hover:opacity-100">
							<span class="text-white font-semibold text-sm sm:text-base bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">View Recipe</span>
						</div>
					</div>
					<div class="p-3 sm:p-4">
						<h3 class="font-semibold text-sm sm:text-base text-foreground line-clamp-2 group-hover:text-primary transition-smooth">
							{recipe.strMeal}
						</h3>
						<div class="mt-2">
							{#if recipe.suggestedIngredient}
								<button
									onclick={(e) => {
										e.stopPropagation();
										onSuggestedIngredientClick(recipe.suggestedIngredient);
									}}
									class="text-xs sm:text-sm text-secondary hover:text-secondary-foreground transition-smooth font-medium cursor-pointer"
								>
									Search "{recipe.suggestedIngredient}"
								</button>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex justify-center py-8 sm:py-12">
			<p class="text-xs sm:text-sm text-muted-foreground">No suggestions available.</p>
		</div>
	{/if}
</div>
