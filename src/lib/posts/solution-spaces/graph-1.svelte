<script lang="ts">
	import Range from '$lib/components/ui/range.svelte';

	let param1 = $state(0);
</script>

<Range value={param1}>Param 1</Range>
