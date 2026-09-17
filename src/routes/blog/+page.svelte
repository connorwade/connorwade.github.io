<script lang="ts">
	import ArticleCard from '../article-card.svelte';
	import { Input, Button, SectionHeader, Card } from '$lib/components/ui';
	import Search from '@lucide/svelte/icons/search';
	import { SvelteSet } from 'svelte/reactivity';
	import { blogEyebrow } from '$lib/consts.js';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedTag = $state('all');

	// Extract unique tags
	let allTags = $derived.by(() => {
		const tagsSet = new SvelteSet<string>();
		data.posts.forEach((post) => {
			post.tags?.forEach((t) => tagsSet.add(t));
		});
		return ['all', ...Array.from(tagsSet)];
	});

	// Filter posts based on search and tag
	let filteredPosts = $derived.by(() => {
		return data.posts.filter((post) => {
			const matchesTag =
				selectedTag === 'all' ||
				post.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

			const query = searchQuery.trim().toLowerCase();
			const matchesSearch =
				!query ||
				post.title.toLowerCase().includes(query) ||
				post.description.toLowerCase().includes(query);

			return matchesTag && matchesSearch;
		});
	});
</script>

<div class="space-y-10 py-4 sm:py-8">
	<!-- Page Header -->
	<SectionHeader
		eyebrow={blogEyebrow}
		title="Essays & Notes"
		description="Deep dives into software architecture, AI, and practical engineering solutions"
	/>

	<!-- Search & Filters Toolbar -->
	<div class="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
		<!-- Search Input Component -->
		<div class="w-full max-w-md">
			<Input bind:value={searchQuery} placeholder="Search essays by title or topic..." allowClear>
				{#snippet leadingIcon()}
					<Search class="size-4" />
				{/snippet}
			</Input>
		</div>

		<!-- Category Filter Pills -->
		<div class="flex flex-wrap items-center gap-2">
			{#each allTags as tag (tag)}
				{@const isActive = selectedTag === tag}
				<button
					type="button"
					class={[
						'cursor-pointer border px-3 py-1.5 font-mono text-xs tracking-wider uppercase transition-all select-none',
						isActive
							? 'border-2 border-border bg-primary font-bold text-primary-foreground shadow-brutal-sm'
							: 'border-border-subtle bg-surface text-muted hover:border-border hover:text-foreground'
					]}
					onclick={() => (selectedTag = tag)}
				>
					{tag}
				</button>
			{/each}
		</div>
	</div>

	<!-- Articles Listing -->
	{#if filteredPosts.length > 0}
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each filteredPosts as postMetadata (postMetadata.slug)}
				<ArticleCard {postMetadata} />
			{/each}
		</div>
	{:else}
		<!-- Empty State Card -->
		<Card variant="muted" class="space-y-3 border-dashed p-12 text-center">
			<div class="font-serif text-2xl font-bold text-foreground">No matching articles found</div>
			<p class="mx-auto max-w-sm font-serif text-sm text-muted">
				Try adjusting your search terms or clearing the category filter.
			</p>
			<Button
				variant="primary"
				size="sm"
				class="mt-2"
				onclick={() => {
					searchQuery = '';
					selectedTag = 'all';
				}}
			>
				Reset Filters
			</Button>
		</Card>
	{/if}
</div>
