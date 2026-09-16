<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant = 'default' | 'primary' | 'accent' | 'outline' | 'ghost';
	type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

	type BaseProps = {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
		children?: Snippet;
	};

	type AnchorProps = BaseProps &
		HTMLAnchorAttributes & {
			href: string;
		};

	type NativeButtonProps = BaseProps &
		HTMLButtonAttributes & {
			href?: never;
		};

	let {
		variant = 'default',
		size = 'md',
		class: className = '',
		children,
		...restProps
	}: AnchorProps | NativeButtonProps = $props();

	const variantClasses: Record<ButtonVariant, string> = {
		default:
			'border-2 border-border bg-surface text-foreground shadow-brutal hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none',
		primary:
			'border-2 border-border bg-primary text-primary-foreground shadow-brutal hover:bg-primary-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none',
		accent:
			'border-2 border-border bg-accent text-accent-foreground shadow-brutal hover:bg-accent-hover hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-lg active:translate-x-0 active:translate-y-0 active:shadow-none',
		outline:
			'border-2 border-border bg-transparent text-foreground hover:bg-surface-muted shadow-brutal-sm hover:shadow-brutal active:translate-x-0 active:translate-y-0 active:shadow-none',
		ghost:
			'border border-transparent text-foreground hover:border-border hover:bg-surface-muted'
	};

	const sizeClasses: Record<ButtonSize, string> = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-4 py-2 text-xs sm:text-sm',
		lg: 'px-6 py-3 text-sm sm:text-base',
		icon: 'size-9 sm:size-10 p-2 justify-center shrink-0',
		'icon-sm': 'size-7 p-1 justify-center shrink-0'
	};

	const baseClass =
		'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer select-none no-underline disabled:opacity-50 disabled:pointer-events-none';
</script>

{#if 'href' in restProps && restProps.href}
	<a
		{...restProps as HTMLAnchorAttributes}
		class={[baseClass, variantClasses[variant], sizeClasses[size], className]}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		type={(restProps as HTMLButtonAttributes).type || 'button'}
		{...restProps as HTMLButtonAttributes}
		class={[baseClass, variantClasses[variant], sizeClasses[size], className]}
	>
		{@render children?.()}
	</button>
{/if}
