<script lang="ts">
	interface Props {
		onSuggest: () => void;
		isLoading: boolean;
	}

	let { onSuggest, isLoading } = $props();
	let showTooltip = $state(false);

</script>

<div class="relative group">
	<button
		onclick={onSuggest}
		disabled={isLoading}
		class="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground font-medium text-xs sm:text-sm transition-smooth hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer animate-pulse-gentle"
		title="Get AI-powered recipe suggestion"
	>
		<span class="text-lg">{isLoading ? '⏳' : '✨'}</span>
		<span class="hidden sm:inline">AI Suggestion</span>
		<span class="sm:hidden">AI</span>
	</button>
	
	<!-- Tooltip -->
	<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap">
		Get a smart recipe suggestion
	</div>
</div>

<style>
	@keyframes pulse-gentle {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.8;
		}
	}

	.animate-pulse-gentle {
		animation: pulse-gentle 2s ease-in-out infinite;
	}
</style>
