<script lang="ts">
	import { searchHistory } from '$lib/stores/search-history';

	interface Props {
		onSelectHistory: (query: string, type: 'ingredient' | 'category' | 'random') => void;
	}

	let { onSelectHistory } = $props();

</script>

{#if $searchHistory.length > 0}
	<div class="mt-3 space-y-2 animate-slide-in-up">
		<div class="flex items-center justify-between px-1">
			<p class="text-xs font-semibold text-muted-foreground">Recent Searches</p>
			<button
				onclick={() => searchHistory.clearHistory()}
				class="text-xs text-muted-foreground hover:text-foreground transition-smooth cursor-pointer"
			>
				Clear
			</button>
		</div>
		<div class="flex flex-wrap gap-2">
			{#each $searchHistory as item, index}
				<div
					class="group relative inline-flex items-center gap-1 rounded-lg bg-muted px-2 sm:px-3 py-1 text-xs sm:text-sm text-foreground hover:bg-primary/20 transition-smooth cursor-pointer"
					role="button"
					tabindex="0"
					onclick={() => onSelectHistory(item.query, item.type)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							onSelectHistory(item.query, item.type);
						}
					}}
				>
					<span>
						{#if item.type === 'ingredient'}
							🥕
						{:else if item.type === 'category'}
							🍽️
						{:else}
							🎲
						{/if}
					</span>
					<span class="truncate max-w-[100px]">{item.query}</span>
					<button
						onclick={(e) => {
							e.stopPropagation();
							searchHistory.removeSearch(index);
						}}
						class="opacity-0 group-hover:opacity-100 transition-smooth text-xs hover:text-destructive"
					>
						✕
					</button>
				</div>
			{/each}
		</div>
	</div>
{/if}
