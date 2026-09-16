<script lang="ts">
	let {
		date,
		class: className = ''
	}: {
		date: Date;
		class?: string;
	} = $props();
</script>

<time
	datetime={date.toISOString()}
	class={['shrink-0 font-mono text-xs tracking-wider text-muted select-none', className]}
>
	{date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	})}
</time>
