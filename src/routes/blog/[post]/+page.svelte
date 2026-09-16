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

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={canonicalURL} />
	<meta property="twitter:title" content={title} />
	<meta property="twitter:description" content={description} />
</svelte:head>

<div class="py-4 sm:py-6 max-w-4xl mx-auto">
	<BlogHeader
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
