<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from './nav-bar.svelte';
	import Footer from './footer.svelte';
	import { fly } from 'svelte/transition';
	import { page } from '$app/state';
	import Client, { setClient } from '$lib/client.svelte.js';

	let { children, data } = $props();

	const transitionIn = { delay: 100, duration: 150 };
	const transitionOut = { duration: 100 };

	const client = new Client();

	setClient(client);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{page.data.title || 'Coding Akita'}</title>
	<meta data-key="description" name="description" content={data.siteDescription} />
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200"
>
	<NavBar />

	{#key data.path}
		<main
			class="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8"
			in:fly|global={transitionIn}
			out:fly|global={transitionOut}
		>
			{@render children()}
		</main>
	{/key}

	<Footer />
</div>
