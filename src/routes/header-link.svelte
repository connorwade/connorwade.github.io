<script lang="ts">
	import { page } from '$app/state';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	const {
		children,
		class: className = '',
		...restProps
	}: { children: Snippet } & HTMLAnchorAttributes = $props();

	let href = $derived(restProps.href || '');
	let isActive = $derived.by(() => {
		if (!href) return false;
		if (href === '/' && page.url.pathname === '/') return true;
		if (href !== '/' && page.url.pathname.startsWith(href)) return true;
		return false;
	});
</script>

<a
	{...restProps}
	aria-current={isActive ? 'page' : undefined}
	class={[
		'inline-flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs font-medium tracking-wider uppercase no-underline transition-all duration-150 sm:text-sm',
		isActive
			? 'border-2 border-border bg-primary font-bold text-primary-foreground shadow-brutal-xs'
			: 'border border-transparent text-foreground hover:border-border hover:bg-surface-muted',
		className
	]}
>
	{@render children()}
</a>
