<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		variant = 'body',
		size = 'md',
		as = 'p',
		class: className,
		children
	}: {
		variant?: 'display' | 'headline' | 'title' | 'body' | 'label';
		size?: 'lg' | 'md' | 'sm';
		as?: string;
		class?: ClassValue;
		children: Snippet;
	} = $props();
</script>

<svelte:element
	this={as}
	class={[
		{
			'font-serif text-display-lg font-normal tracking-tight': variant === 'display' && size === 'lg',
			'font-serif text-display font-normal tracking-tight': variant === 'display' && size === 'md',
			'font-serif text-display-sm font-normal tracking-tight': variant === 'display' && size === 'sm',

			'font-serif text-headline-lg font-normal': variant === 'headline' && size === 'lg',
			'font-serif text-headline font-normal': variant === 'headline' && size === 'md',
			'font-serif text-headline-sm font-normal': variant === 'headline' && size === 'sm',

			'font-serif text-title-lg font-bold': variant === 'title' && size === 'lg',
			'font-serif text-title font-semibold': variant === 'title' && size === 'md',
			'font-serif text-title-sm font-semibold': variant === 'title' && size === 'sm',

			'font-serif text-body-lg': variant === 'body' && size === 'lg',
			'font-serif text-body': variant === 'body' && size === 'md',
			'font-serif text-body-sm': variant === 'body' && size === 'sm',

			'font-mono text-label-lg uppercase tracking-wider': variant === 'label' && size === 'lg',
			'font-mono text-label uppercase tracking-wider': variant === 'label' && size === 'md',
			'font-mono text-label-sm uppercase tracking-wider': variant === 'label' && size === 'sm'
		},
		className
	]}
>
	{@render children()}
</svelte:element>
