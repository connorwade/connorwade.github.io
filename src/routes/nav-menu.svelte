<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import HeaderLink from './header-link.svelte';
	import CustomIcon from '$lib/components/custom-icon.svelte';

	let {
		orientation = 'horizontal',
		onNavigate,
		class: className
	}: {
		orientation?: 'horizontal' | 'vertical';
		onNavigate?: () => void;
		class?: ClassValue;
	} = $props();

	const links = [
		{ link: '/', content: 'Home' },
		{ link: '/blog', content: 'Blog' }
	];
</script>

{#if orientation === 'horizontal'}
	<nav aria-label="Main Navigation" class={['flex items-center gap-2', className]}>
		{#each links as { link, content } (link)}
			<HeaderLink href={link} onclick={onNavigate}>{content}</HeaderLink>
		{/each}
	</nav>
{:else}
	<nav aria-label="Mobile Navigation" class={['flex w-full flex-col gap-2.5', className]}>
		{#each links as { link, content } (link)}
			<HeaderLink
				href={link}
				onclick={onNavigate}
				class="w-full justify-between px-4 py-2.5 text-sm"
			>
				<span>{content}</span>
				<span class="text-xs text-muted">→</span>
			</HeaderLink>
		{/each}

		<!-- Mobile Social Links Divider & Shortcuts -->
		<div class="mt-1 flex items-center justify-between border-t border-border-subtle pt-3">
			<span class="font-mono text-xs font-bold tracking-wider text-muted uppercase"> Social </span>
			<div class="flex items-center gap-2">
				<a
					href="https://github.com/connorwade"
					target="_blank"
					rel="noreferrer"
					class="border border-border bg-surface-muted p-2 text-foreground transition-colors hover:bg-surface"
					title="GitHub"
					aria-label="GitHub Profile"
					onclick={onNavigate}
				>
					<CustomIcon icon="github" class="size-4 fill-current" />
				</a>
				<a
					href="https://www.linkedin.com/in/connor-wade-2094681a0/"
					target="_blank"
					rel="noreferrer"
					class="border border-border bg-surface-muted p-2 text-foreground transition-colors hover:bg-surface"
					title="LinkedIn"
					aria-label="LinkedIn Profile"
					onclick={onNavigate}
				>
					<CustomIcon icon="linkedin" class="size-4 fill-current" />
				</a>
			</div>
		</div>
	</nav>
{/if}
