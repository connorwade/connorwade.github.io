<script lang="ts">
	import CustomIcon from './custom-icon.svelte';
	import { Button } from '$lib/components/ui';
</script>

<div class="flex items-center gap-2">
	<Button
		href="https://github.com/connorwade"
		target="_blank"
		rel="noreferrer"
		size="icon-sm"
		variant="default"
		title="GitHub Profile"
		aria-label="GitHub Profile"
	>
		<CustomIcon icon="github" class="size-4 fill-current" />
	</Button>
	<Button
		href="https://www.linkedin.com/in/connor-wade-2094681a0/"
		target="_blank"
		rel="noreferrer"
		size="icon-sm"
		variant="default"
		title="LinkedIn Profile"
		aria-label="LinkedIn Profile"
	>
		<CustomIcon icon="linkedin" class="size-4 fill-current" />
	</Button>
</div>
