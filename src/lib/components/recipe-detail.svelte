<script lang="ts">
	import FavoriteButton from './favorite-button.svelte';
	import YoutubeEmbed from './youtube-embed.svelte';

	interface Props {
		recipe: any;
		onClose: () => void;
	}

	let { recipe, onClose } = $props();

	// Extract ingredients and measurements
	function getIngredients() {
		const ingredients = [];
		for (let i = 1; i <= 20; i++) {
			const ingredient = recipe[`strIngredient${i}`];
			const measure = recipe[`strMeasure${i}`];
			if (ingredient && ingredient.trim()) {
				ingredients.push({ ingredient, measure });
			}
		}
		return ingredients;
	}

	const ingredients = getIngredients();

	function handleBackdropClick(e: MouseEvent) {
		// Only close if clicking the backdrop itself, not any child elements
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}
</script>

<!-- Enhanced modal with backdrop blur and smooth animations -->
<div
	onclick={handleBackdropClick}
	onkeydown={handleKeyDown}
	role="dialog"
	tabindex="0"
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 backdrop-blur-md animate-fade-in"
>
	<!-- Modal Content -->
	<div class="animate-scale-in max-h-[95vh] sm:max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-card shadow-2xl">
		<!-- Close Button -->
		<button
			onclick={onClose}
			class="sticky top-0 right-0 z-10 float-right m-2 sm:m-4 rounded-lg bg-muted p-2 text-foreground hover:bg-muted/80 transition-smooth text-lg sm:text-xl hover:scale-110 hover:rotate-90"
		>
			✕
		</button>

		<!-- Recipe Image -->
		<div class="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-muted">
			<img
				src={recipe.strMealThumb || "/placeholder.svg"}
				alt={recipe.strMeal}
				class="h-full w-full object-cover transition-smooth duration-700 hover:scale-110"
			/>
			<!-- Add favorite button overlay on recipe image -->
			<div class="absolute top-4 left-4 sm:top-6 sm:left-6">
				<FavoriteButton mealId={recipe.idMeal} size="lg" />
			</div>
		</div>

		<!-- Recipe Content -->
		<div class="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
			<!-- Title -->
			<div class="animate-slide-in-up">
				<h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">{recipe.strMeal}</h1>
				<div class="flex flex-wrap gap-2">
					{#if recipe.strCategory}
						<span class="inline-block rounded-full bg-primary/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-primary animate-scale-in">
							{recipe.strCategory}
						</span>
					{/if}
					{#if recipe.strArea}
						<span class="inline-block rounded-full bg-secondary/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-secondary animate-scale-in" style="animation-delay: 50ms">
							🌍 {recipe.strArea}
						</span>
					{/if}
				</div>
			</div>

			<!-- YouTube Video Embed -->
			{#if recipe.strYoutube}
				<YoutubeEmbed youtubeUrl={recipe.strYoutube} />
			{/if}

			<!-- Ingredients Section -->
			<div class="animate-slide-in-up" style="animation-delay: 100ms">
				<h2 class="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">📋 Ingredients</h2>
				<div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
					{#each ingredients as item, index}
						<div class="flex items-start gap-2 sm:gap-3 rounded-lg bg-muted/50 p-2 sm:p-3 animate-fade-in transition-smooth hover:bg-muted/80 hover:scale-102" style="animation-delay: {index * 30}ms">
							<span class="text-lg flex-shrink-0">✓</span>
							<div class="min-w-0">
								<p class="font-medium text-sm sm:text-base text-foreground break-words">{item.ingredient}</p>
								<p class="text-xs sm:text-sm text-muted-foreground">{item.measure}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Instructions Section -->
			<div class="animate-slide-in-up" style="animation-delay: 150ms">
				<h2 class="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">👨‍🍳 Instructions</h2>
				<div class="space-y-3 sm:space-y-4">
					{#each recipe.strInstructions.split('.').filter((s: string) => s.trim()) as instruction, index}
						<div class="flex gap-2 sm:gap-4 animate-fade-in" style="animation-delay: {index * 50}ms">
							<div class="flex-shrink-0">
								<div class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-xs sm:text-sm transition-smooth hover:scale-110 hover:shadow-lg">
									{index + 1}
								</div>
							</div>
							<p class="text-sm sm:text-base text-foreground pt-0.5 sm:pt-1">{instruction.trim()}.</p>
						</div>
					{/each}
				</div>
			</div>

			<!-- Close Button -->
			<button
				onclick={onClose}
				class="w-full rounded-lg bg-muted px-3 sm:px-4 py-2 sm:py-3 font-medium text-sm sm:text-base text-foreground hover:bg-muted/80 transition-smooth hover:shadow-lg animate-slide-in-up"
				style="animation-delay: 250ms"
			>
				Close Recipe
			</button>
		</div>
	</div>
</div>