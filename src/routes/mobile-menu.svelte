<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */

	let {
		links,
		hidden
	}: {
		links: {
			href: string;
			content: string;
		}[];
		hidden: boolean;
	} = $props();
</script>

<div
	class={[
		'border-sand-900 dark:border-sand-300 bg-sand-100 dark:bg-sand-900 hidden space-y-3 border-t-2 px-6 py-4 font-sans font-bold md:hidden',
		hidden && 'hidden'
	]}
>
	{#each links as { href, content } (href)}
		<a {href} class="border-sand-300 dark:border-sand-800 block border-b py-2">
			{content}
		</a>
	{/each}
</div>
