<script lang="ts">
  import Toast from "./Toast.svelte";

  import { dismissToast, toasts } from "$lib/stores";
</script>

{#if $toasts}
    <section class="absolute right-0 flex flex-col z-[1000] mt-5 mr-10">
      {#each $toasts as toast (toast.id)}
        <Toast
          type={toast.type}
          dismissible={toast.dismissible}
          on:dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast
        >
      {/each}
    </section>
{/if}
