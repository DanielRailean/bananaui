<script lang="ts">
	import spinner from '$lib/assets/spinner.gif';

	export let height = 400;
	export let text = '';
	export let uppercased = true;
</script>

<div class="relative">
	<p class="z-10 absolute top-44 left-60">{uppercased ? text.toUpperCase() : text}</p>
	<img {height} src={spinner} alt="loading" class="rounded-xl" />
</div>
