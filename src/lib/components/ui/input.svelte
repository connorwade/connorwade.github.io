<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import X from '@lucide/svelte/icons/x';

	let {
		value = $bindable(''),
		leadingIcon,
		allowClear = false,
		class: className = '',
		...restProps
	}: {
		value?: string;
		leadingIcon?: Snippet;
		allowClear?: boolean;
		class?: string;
	} & HTMLInputAttributes = $props();
</script>

<div class={['relative flex w-full items-center', className]}>
	{#if leadingIcon}
		<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted">
			{@render leadingIcon()}
		</div>
	{/if}

	<input
		{...restProps}
		bind:value
		class={[
			'w-full border-2 border-border bg-surface py-2 font-mono text-xs text-foreground shadow-brutal-sm transition-all placeholder:text-muted-foreground focus:shadow-brutal focus:ring-2 focus:ring-primary focus:outline-none sm:text-sm',
			leadingIcon ? 'pl-10' : 'pl-3',
			allowClear && value ? 'pr-9' : 'pr-3'
		]}
	/>

	{#if allowClear && value}
		<button
			type="button"
			aria-label="Clear input"
			class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-muted transition-colors hover:text-foreground"
			onclick={() => (value = '')}
		>
			<X class="size-4" />
		</button>
	{/if}
</div>
