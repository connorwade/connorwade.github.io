<script lang="ts">
	import { page } from '$app/state';
	import Article from '$lib/components/article.svelte';
	import { domain } from '$lib/consts';
	import BlogHeader from './blog-header.svelte';
	import AuthorCard from './author-card.svelte';

	let { data } = $props();

	let title = $derived(data.metadata.title);
	let description = $derived(data.metadata.description);
	const canonicalURL = $derived.by(() => {
		const baseURL = domain;
		return `${baseURL}${page.url.pathname}`;
	});

	interface EnhancedImageObject {
		img?: { src?: string };
		sources?: Record<string, string>;
	}

	const ogImage = $derived.by(() => {
		if (!data.heroImageModule) return undefined;
		const img = data.heroImageModule as string | EnhancedImageObject;
		if (typeof img === 'string') return img;
		if (img?.img?.src) return img.img.src;
		if (img?.sources) {
			const firstSource = Object.values(img.sources)[0];
			if (typeof firstSource === 'string') return firstSource;
		}
		return undefined;
	});
</script>

<svelte:head>
	<!-- Canonical URL -->
	<link rel="canonical" href={canonicalURL} />

	<!-- Primary Meta Tags -->
	<title>{title} | Coding Akita</title>
	<meta name="title" content={title} />
	<meta name="description" content={description} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="article" />
	<meta property="og:url" content={canonicalURL} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
	{/if}

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalURL} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
	{#if ogImage}
		<meta property="twitter:image" content={ogImage} />
	{/if}
</svelte:head>

<div class="mx-auto max-w-4xl py-4 sm:py-6">
	<BlogHeader
		heroImage={data.heroImageModule}
		title={data.metadata.title}
		description={data.metadata.description}
		pubDate={data.metadata.pubDate}
		tags={data.metadata.tags}
	/>

	<Article>
		<data.PostContent />
	</Article>

	<AuthorCard />
</div>
