<script lang="ts">
	import Toast from './Toast.svelte';
	import { dismissToast, toasts } from '$lib/toastStore';
</script>

{#if $toasts.length > 0}
	<section class="fixed right-0 top-0 flex flex-col z-[1000] mt-4 mr-4 gap-1">
		{#each $toasts as toast (toast.id)}
			<Toast
				type={toast.type}
				dismissible={toast.dismissible}
				timeout={toast.timeout ?? 3500}
				on:dismiss={() => dismissToast(toast.id)}
			>{toast.message}</Toast>
		{/each}
	</section>
{/if}
