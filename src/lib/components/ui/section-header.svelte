<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		eyebrow,
		title,
		description,
		action,
		class: className = ''
	}: {
		eyebrow?: string;
		title: string;
		description?: string;
		action?: Snippet;
		class?: string;
	} = $props();
</script>

<div
	class={[
		'flex flex-col justify-between gap-4 border-b-2 border-border-subtle pb-4 md:flex-row md:items-end',
		className
	]}
>
	<div class="space-y-1">
		{#if eyebrow}
			<span class="block font-mono text-xs font-bold tracking-widest text-primary-hover uppercase">
				{eyebrow}
			</span>
		{/if}
		<h2 class="font-serif text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
			{title}
		</h2>
		{#if description}
			<p class="max-w-2xl pt-1 font-serif text-sm leading-relaxed text-muted sm:text-base">
				{description}
			</p>
		{/if}
	</div>

	{#if action}
		<div class="shrink-0">
			{@render action()}
		</div>
	{/if}
</div>
