<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		pulse = true,
		class: className = '',
		children
	}: {
		pulse?: boolean;
		class?: string;
		children?: Snippet;
	} = $props();
</script>

<div
	class={[
		'inline-flex items-center gap-2 rounded-full border border-border bg-primary-subtle px-3 py-1 font-mono text-xs font-bold text-primary-subtle-foreground select-none',
		className
	]}
>
	{#if pulse}
		<span class="size-2 shrink-0 animate-pulse rounded-full bg-primary"></span>
	{/if}
	<span>
		{@render children?.()}
	</span>
</div>
