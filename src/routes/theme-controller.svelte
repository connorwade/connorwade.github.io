<script lang="ts">
	import { getClient } from '$lib/client.svelte';
	import { Button } from '$lib/components/ui';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import MonitorCog from '@lucide/svelte/icons/monitor-cog';

	const client = getClient();

	let label = $derived.by(() => {
		if (client.themeSettings.mode === 'light') {
			return 'Light mode (click for dark)';
		} else if (client.themeSettings.mode === 'dark') {
			return 'Dark mode (click for system)';
		} else {
			return 'System theme (click for light)';
		}
	});
</script>

<Button
	size="icon"
	variant="default"
	class="group relative"
	title={label}
	aria-label={label}
	onclick={() => client.toggleTheme()}
>
	{#if client.themeSettings.mode === 'dark'}
		<Moon class="size-4.5 transition-transform duration-200 group-hover:rotate-12" />
	{:else if client.themeSettings.mode === 'light'}
		<Sun class="size-4.5 transition-transform duration-200 group-hover:rotate-45" />
	{:else}
		<MonitorCog class="size-4.5 transition-transform duration-200 group-hover:scale-110" />
	{/if}
</Button>
