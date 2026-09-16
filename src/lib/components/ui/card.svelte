<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';

	type CardVariant = 'default' | 'muted' | 'elevated';

	type BaseProps = {
		variant?: CardVariant;
		interactive?: boolean;
		class?: string;
		children?: Snippet;
	};

	type AnchorProps = BaseProps &
		HTMLAnchorAttributes & {
			href: string;
		};

	type DivProps = BaseProps &
		HTMLAttributes<HTMLDivElement> & {
			href?: never;
		};

	let {
		variant = 'default',
		interactive = false,
		class: className = '',
		children,
		...restProps
	}: AnchorProps | DivProps = $props();

	const variantClasses: Record<CardVariant, string> = {
		default: 'border-2 border-border bg-surface text-foreground shadow-brutal',
		muted: 'border-2 border-border bg-surface-muted text-foreground shadow-brutal-sm',
		elevated: 'border-2 border-border bg-surface text-foreground shadow-brutal-lg'
	};

	const interactiveClass =
		'transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-lg cursor-pointer no-underline';
</script>

{#if 'href' in restProps && restProps.href}
	<a
		{...restProps as HTMLAnchorAttributes}
		class={['block', variantClasses[variant], interactive && interactiveClass, className]}
	>
		{@render children?.()}
	</a>
{:else}
	<div
		{...restProps as HTMLAttributes<HTMLDivElement>}
		class={[variantClasses[variant], interactive && interactiveClass, className]}
	>
		{@render children?.()}
	</div>
{/if}
