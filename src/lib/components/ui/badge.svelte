<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type BadgeVariant = 'default' | 'primary' | 'accent' | 'outline';
	type BadgeSize = 'sm' | 'md';

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: {
		variant?: BadgeVariant;
		size?: BadgeSize;
		class?: string;
		children?: Snippet;
	} & HTMLAttributes<HTMLSpanElement> = $props();

	const variantClasses: Record<BadgeVariant, string> = {
		default: 'border border-border bg-surface-muted text-foreground',
		primary:
			'border border-primary-hover bg-primary-subtle text-primary-subtle-foreground font-bold',
		accent: 'border border-accent-hover bg-accent-subtle text-accent-subtle-foreground font-bold',
		outline: 'border border-border bg-transparent text-foreground'
	};

	const sizeClasses: Record<BadgeSize, string> = {
		sm: 'px-2 py-0.5 text-[0.6875rem]',
		md: 'px-2.5 py-0.5 text-xs'
	};
</script>

<span
	{...restProps}
	class={[
		'inline-flex shrink-0 items-center gap-1.5 font-mono font-semibold tracking-wider uppercase select-none',
		variantClasses[variant],
		sizeClasses[size],
		className
	]}
>
	{@render children?.()}
</span>
