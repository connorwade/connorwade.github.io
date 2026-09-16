<script lang="ts">
	import ArticleCard from './article-card.svelte';
	import { getPostsMetadata } from '../lib/posts/posts.remote';
	import { resolve } from '$app/paths';
	import { Button, Badge, Card, StatusPill, SectionHeader } from '$lib/components/ui';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Sparkles from '@lucide/svelte/icons/sparkles';
</script>

<div class="space-y-16 py-4 sm:py-8">
	<!-- Hero Section Card -->
	<Card class="relative overflow-hidden p-6 sm:p-12">
		<!-- Decorative Sage Ambient Glow -->
		<div
			class="pointer-events-none absolute -top-12 -right-12 size-40 rounded-full bg-primary/20 blur-3xl"
		></div>

		<div class="relative z-10 max-w-3xl space-y-6">
			<!-- Live Status Indicator -->
			<StatusPill>Available for engineering & writing</StatusPill>

			<!-- Main Display Headline -->
			<h1
				class="font-serif text-3xl leading-[1.15] font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
			>
				Crafting resilient web apps with precision & simplicity.
			</h1>

			<!-- Intro Description -->
			<p class="max-w-2xl font-serif text-base leading-relaxed text-muted sm:text-xl">
				Hi, I'm <strong class="font-bold text-foreground">Connor Wade</strong>. I write in-depth
				essays on frontend performance, state management, Svelte, and modern engineering
				architecture.
			</p>

			<!-- Skill Highlight Badges -->
			<div class="flex flex-wrap gap-2 pt-2">
				<Badge variant="primary">SvelteKit 5</Badge>
				<Badge variant="default">TypeScript</Badge>
				<Badge variant="accent">UI Architecture</Badge>
				<Badge variant="default">Performance</Badge>
			</div>

			<!-- Action Buttons -->
			<div class="flex flex-wrap items-center gap-3 pt-4">
				<Button href={resolve('/blog')} variant="primary">
					<BookOpen class="size-4" />
					<span>Explore Blog</span>
				</Button>
				<Button
					href="https://github.com/connorwade"
					target="_blank"
					rel="noreferrer"
					variant="default"
				>
					<Sparkles class="size-4" />
					<span>GitHub Works</span>
				</Button>
			</div>
		</div>
	</Card>

	<!-- Latest Articles Section -->
	<section class="space-y-6">
		<SectionHeader eyebrow="From The Archive" title="Featured & Recent Articles">
			{#snippet action()}
				<a
					href={resolve('/blog')}
					class="group inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-foreground uppercase transition-colors hover:text-primary-hover sm:text-sm"
				>
					<span>View All</span>
					<ArrowRight class="size-4 transition-transform group-hover:translate-x-1" />
				</a>
			{/snippet}
		</SectionHeader>

		<!-- Articles Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			{#each await getPostsMetadata() as postMetadata (postMetadata.slug)}
				<ArticleCard {postMetadata} />
			{/each}
		</div>
	</section>
</div>
