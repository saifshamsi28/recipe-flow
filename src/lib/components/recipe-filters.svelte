<script lang="ts">
	interface Props {
		onCookingTimeChange: (time: string) => void;
		onCategoryChange: (category: string) => void;
		selectedCookingTime: string;
		selectedCategory: string;
	}

	let { onCookingTimeChange, onCategoryChange, selectedCookingTime, selectedCategory } = $props();

	const cookingTimes = [
		{ label: 'All Times', value: 'all' },
		{ label: 'Under 15 min', value: '15' },
		{ label: '15-30 min', value: '30' },
		{ label: '30-60 min', value: '60' },
		{ label: 'Over 60 min', value: '120' }
	];

	const categories = [
		'All Categories',
		'Seafood',
		'Breakfast',
		'Dessert',
		'Vegetarian',
		'Pasta',
		'Chicken',
		'Beef',
		'Vegan'
	];
</script>

<div class="space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-lg bg-muted/50 border border-border animate-slide-in-up">
	<h3 class="text-sm font-semibold text-foreground">Filters</h3>
	
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
		<!-- Cooking Time Filter -->
		<div class="space-y-2">
			<label for="cooking-time" class="text-xs font-medium text-muted-foreground">Cooking Time</label>
			<div class="flex flex-wrap gap-2">
				{#each cookingTimes as time}
					<button
						id={`cooking-time-${time.value}`}
						onclick={() => onCookingTimeChange(time.value)}
						class="px-2 sm:px-3 py-1 text-xs rounded-lg transition-smooth cursor-pointer {selectedCookingTime === time.value
							? 'bg-primary text-primary-foreground'
							: 'bg-card border border-border text-foreground hover:border-primary'}"
					>
						{time.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Category Filter -->
		<div class="space-y-2">
			<label for="category" class="text-xs font-medium text-muted-foreground">Category</label>
			<select
				id="category"
				value={selectedCategory}
				onchange={(e) => onCategoryChange(e.currentTarget.value)}
				class="w-full px-2 sm:px-3 py-1 text-xs rounded-lg bg-card border border-border text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth-fast cursor-pointer"
			>
				{#each categories as category}
					<option value={category}>{category}</option>
				{/each}
			</select>
		</div>
	</div>
</div>
