<script lang="ts">
	import type { PostMetadata } from '$lib/posts/index';
	import { resolve } from '$app/paths';
	import FormattedDate from '$lib/components/formatted-date.svelte';
	import { Card, Badge } from '$lib/components/ui';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';

	let {
		postMetadata
	}: {
		postMetadata: PostMetadata;
	} = $props();

	const primaryTag = $derived(postMetadata.tags?.[0] || 'Article');
</script>

<Card
	href={resolve('/blog/[post]', { post: postMetadata.slug })}
	interactive
	class="group flex flex-col justify-between p-6 sm:p-7"
>
	<div>
		<!-- Card Meta Header -->
		<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
			<Badge variant="primary">
				{primaryTag}
			</Badge>
			<FormattedDate date={postMetadata.pubDate} />
		</div>

		<!-- Title -->
		<h3
			class="mb-3 font-serif text-xl leading-snug font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-hover sm:text-2xl"
		>
			{postMetadata.title}
		</h3>

		<!-- Description Snippet -->
		<p class="mb-6 line-clamp-3 font-serif text-sm leading-relaxed text-muted sm:text-base">
			{postMetadata.description}
		</p>
	</div>

	<!-- Card Footer CTA -->
	<div class="mt-auto flex items-center justify-between border-t-2 border-border-subtle pt-4">
		<span
			class="font-mono text-xs font-bold tracking-wider text-foreground uppercase transition-colors group-hover:text-primary-hover"
		>
			Read Article
		</span>
		<div
			class="flex size-7 items-center justify-center border border-border bg-surface-muted transition-transform duration-150 group-hover:translate-x-1"
		>
			<ArrowRight class="size-3.5 text-foreground" />
		</div>
	</div>
</Card>
