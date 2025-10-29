<script lang="ts">
	import { favorites } from '$lib/stores/favorites';

	const sizeClasses = {
		sm: 'text-lg',
		md: 'text-2xl',
		lg: 'text-3xl'
	} as const;

	export let mealId: string;
	export let size: keyof typeof sizeClasses = 'md';

	let isFavorite = false;
	$: isFavorite = $favorites.some((fav) => fav.mealId === mealId);
</script>

<button
	on:click={() => favorites.toggleFavorite(mealId)}
	class="transition-smooth hover:scale-125 cursor-pointer"
	title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
	aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
>
	<span class={sizeClasses[size]}>
		{isFavorite ? '❤️' : '🤍'}
	</span>
</button>
