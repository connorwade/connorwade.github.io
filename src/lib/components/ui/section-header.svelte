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
		'flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-subtle pb-4',
		className
	]}
>
	<div class="space-y-1">
		{#if eyebrow}
			<span class="font-mono text-xs font-bold uppercase tracking-widest text-primary-hover block">
				{eyebrow}
			</span>
		{/if}
		<h2 class="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
			{title}
		</h2>
		{#if description}
			<p class="font-serif text-muted text-sm sm:text-base max-w-2xl leading-relaxed pt-1">
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
