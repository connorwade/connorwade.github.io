<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		children,
		value = $bindable(0),
		...props
	}: { children: Snippet; value: number } & HTMLInputAttributes = $props();
</script>

<label class="flex flex-col">
	{@render children()}
	<input class={['accent-primary', props.class]} {...props} bind:value type="range" />
</label>

<style>
	input[type='range'] {
		&::-webkit-slider-runnable-track,
		&::-ms-track {
			height: 8px;
			background-color: var(--color-muted-foreground);
			border-radius: 4px;
			border: 0px solid var(--border);
			box-shadow: var(--shadow-brutal);
		}

		&::-webkit-slider-thumb,
		&::-ms-thumb {
			-webkit-appearance: none;
			height: 22px;
			width: 22px;
			background: var(--primary);
		}
	}
</style>
