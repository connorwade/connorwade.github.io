<script lang="ts">
	import FormattedDate from '$lib/components/formatted-date.svelte';
	import { resolve } from '$app/paths';
	import { Badge, Card } from '$lib/components/ui';
	import ArrowLeft from '@lucide/svelte/icons/arrow-left';
	import Calendar from '@lucide/svelte/icons/calendar';

	let {
		title,
		description,
		pubDate,
		updatedDate,
		tags = []
	}: {
		heroImage?: string;
		title: string;
		description: string;
		pubDate: Date;
		updatedDate?: Date;
		tags?: string[];
	} = $props();
</script>

<Card class="mb-10 space-y-6 p-6 sm:p-10">
	<!-- Navigation & Category Tags -->
	<div
		class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-subtle pb-4"
	>
		<a
			href={resolve('/blog')}
			class="group inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-foreground uppercase no-underline hover:text-primary-hover"
		>
			<ArrowLeft class="size-3.5 transition-transform group-hover:-translate-x-1" />
			<span>All Articles</span>
		</a>

		<div class="flex items-center gap-2">
			{#each tags as tag (tag)}
				<Badge variant="primary">{tag}</Badge>
			{/each}
		</div>
	</div>

	<!-- Headline -->
	<h1
		class="font-serif text-3xl leading-[1.15] font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
	>
		{title}
	</h1>

	<!-- Description Subhead -->
	<p class="max-w-3xl font-serif text-base leading-relaxed text-muted sm:text-xl">
		{description}
	</p>

	<!-- Metadata Row -->
	<div class="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-muted">
		<div class="inline-flex items-center gap-1.5">
			<Calendar class="size-3.5" />
			<span>Published <FormattedDate date={pubDate} /></span>
		</div>

		{#if updatedDate}
			<span>•</span>
			<div>
				Updated <FormattedDate date={updatedDate} />
			</div>
		{/if}
	</div>
</Card>
