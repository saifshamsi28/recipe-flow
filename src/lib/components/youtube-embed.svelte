<script lang="ts">
	interface Props {
		youtubeUrl: string;
	}

	let { youtubeUrl } = $props();

	function getYoutubeVideoId(url: string): string | null {
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
			/youtube\.com\/embed\/([^&\n?#]+)/,
			/youtube\.com\/v\/([^&\n?#]+)/,
			/youtu\.be\/([^&\n?#]+)/
		];

		for (const pattern of patterns) {
			const match = url.match(pattern);
			if (match && match[1]) {
				return match[1];
			}
		}
		return null;
	}

	const videoId = getYoutubeVideoId(youtubeUrl);
	const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
</script>

{#if embedUrl}
	<div class="animate-slide-in-up space-y-2 sm:space-y-3">
		<h3 class="text-lg sm:text-xl font-semibold text-foreground">🎥 Video Tutorial</h3>
		<div class="relative w-full overflow-hidden rounded-lg bg-muted" style="padding-bottom: 56.25%;">
			<iframe
				src={embedUrl}
				title="Recipe Video Tutorial"
				class="absolute inset-0 h-full w-full border-0 rounded-lg"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	</div>
{:else if youtubeUrl}
	<div class="animate-slide-in-up space-y-2 sm:space-y-3">
		<p class="text-sm text-muted-foreground">Video tutorial link available but could not be embedded</p>
	</div>
{/if}
