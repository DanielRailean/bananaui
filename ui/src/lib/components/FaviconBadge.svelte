<script lang="ts">
	import { toastList } from '$lib/toastStore';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let originalFavicon = '';

	onMount(() => {
		const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
		if (link) originalFavicon = link.href;

		const interval = setInterval(updateBadge, 2000);
		return () => clearInterval(interval);
	});

	function updateBadge() {
		const errorCount = toastList.filter((t) => t.type === 'error').length;
		const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
		if (!link) return;

		if (errorCount === 0) {
			if (originalFavicon) link.href = originalFavicon;
			return;
		}

		if (!canvas) {
			canvas = document.createElement('canvas');
			canvas.width = 32;
			canvas.height = 32;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => {
			ctx.clearRect(0, 0, 32, 32);
			ctx.drawImage(img, 0, 0, 32, 32);
			// Red dot
			ctx.fillStyle = '#ef4444';
			ctx.beginPath();
			ctx.arc(26, 6, 6, 0, Math.PI * 2);
			ctx.fill();
			link.href = canvas.toDataURL();
		};
		img.src = originalFavicon || link.href;
	}
</script>
