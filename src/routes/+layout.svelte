<script lang="ts">
	import '../app.css';
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		theme.subscribe((currentTheme) => {
			if (typeof window !== 'undefined') {
				const html = document.documentElement;
				if (currentTheme === 'dark') {
					html.classList.add('dark');
				} else {
					html.classList.remove('dark');
				}
			}
		});
	});
</script>

{@render children()}
