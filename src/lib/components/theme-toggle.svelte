<script lang="ts">
	import { theme } from '$lib/stores/theme';

</script>

<button
	onclick={() => theme.toggle()}
	class="p-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-smooth cursor-pointer hover:scale-110 flex items-center justify-center"
	title="Toggle dark/light mode"
	aria-label="Toggle dark/light mode"
>
	{#if $theme === 'light'}
		<span class="text-lg">🌙</span>
	{:else}
		<span class="text-lg">☀️</span>
	{/if}
</button>
