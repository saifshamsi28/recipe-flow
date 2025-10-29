<script lang="ts">
	import SearchHistory from './search-history.svelte';
	import AISuggestionButton from './ai-suggestion-button.svelte';
	import { searchHistory } from '$lib/stores/search-history';

	interface Props {
		searchType: 'ingredient' | 'category' | 'random';
		isLoading: boolean;
		onSearch: (query: string) => void;
		onSearchTypeChange: (type: 'ingredient' | 'category' | 'random') => void;
	}

	let { searchType, isLoading, onSearch, onSearchTypeChange } = $props();
	let searchQuery = $state('');

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
		'rice',
		'shrimp',
		'salmon',
		'mushroom',
		'spinach',
		'broccoli'
	];

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (searchQuery.trim() || searchType === 'random') {
			searchHistory.addSearch(searchQuery || 'random', searchType);
			onSearch(searchQuery);
			searchQuery = '';
		}
	}

	function handleRandomClick() {
		onSearchTypeChange('random');
		searchHistory.addSearch('random', 'random');
		onSearch('');
	}

	function handleHistorySelect(query: string, type: 'ingredient' | 'category' | 'random') {
		onSearchTypeChange(type);
		searchQuery = query;
		setTimeout(() => {
			onSearch(query);
			searchQuery = '';
		}, 0);
	}

	function handleAISuggestion() {
		const randomIngredients = suggestedIngredients
			.sort(() => Math.random() - 0.5)
			.slice(0, Math.floor(Math.random() * 3) + 1);
		
		const query = randomIngredients.join(', ');
		onSearchTypeChange('ingredient');
		searchHistory.addSearch(query, 'ingredient');
		onSearch(query);
		searchQuery = '';
	}
</script>

<div class="space-y-3 sm:space-y-4">
	<!-- Enhanced button styling with smooth transitions and hover effects -->
	<!-- Added cursor-pointer to all buttons for better UX -->
	<div class="flex flex-wrap gap-2 sm:gap-3 items-center">
		<button
			onclick={() => onSearchTypeChange('ingredient')}
			class="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-smooth whitespace-nowrap cursor-pointer {searchType === 'ingredient'
				? 'bg-primary text-primary-foreground shadow-lg scale-105'
				: 'bg-muted text-foreground hover:bg-muted/80 hover:scale-102'}"
		>
			🥕 By Ingredient
		</button>
		<button
			onclick={() => onSearchTypeChange('category')}
			class="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-smooth whitespace-nowrap cursor-pointer {searchType === 'category'
				? 'bg-primary text-primary-foreground shadow-lg scale-105'
				: 'bg-muted text-foreground hover:bg-muted/80 hover:scale-102'}"
		>
			🍽️ By Category
		</button>
		<button
			onclick={handleRandomClick}
			disabled={isLoading}
			class="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-smooth whitespace-nowrap cursor-pointer {searchType === 'random'
				? 'bg-primary text-primary-foreground shadow-lg scale-105'
				: 'bg-muted text-foreground hover:bg-muted/80 hover:scale-102'} disabled:opacity-50 disabled:cursor-not-allowed"
		>
			🎲 Random Recipe
		</button>
		
		<!-- AI Suggestion Button -->
		<div class="ml-auto">
			<AISuggestionButton onSuggest={handleAISuggestion} {isLoading} />
		</div>
	</div>

	<!-- Search Input -->
	{#if searchType !== 'random'}
		<form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-2 animate-slide-in-up">
			<input
				type="text"
				bind:value={searchQuery}
				placeholder={searchType === 'ingredient' ? 'e.g., chicken, pasta, garlic...' : 'e.g., seafood, dessert...'}
				class="flex-1 rounded-lg border border-border bg-card px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-smooth-fast"
				disabled={isLoading}
			/>
			<button
				type="submit"
				disabled={isLoading || !searchQuery.trim()}
				class="rounded-lg bg-primary px-4 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm text-primary-foreground transition-smooth hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
			>
				{isLoading ? '⏳' : '🔍'} Search
			</button>
		</form>
		<p class="text-xs text-muted-foreground px-1">
			💡 Tip: Enter multiple ingredients separated by commas (e.g., "chicken, garlic, onion") to find recipes with all or some of them!
		</p>
	{/if}

	<!-- Search History Component -->
	<SearchHistory onSelectHistory={handleHistorySelect} />
</div>
