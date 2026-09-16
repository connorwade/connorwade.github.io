<script lang="ts">
	import headshot from '$lib/assets/good_enough2.png?enhanced';
	import SocialBar from '$lib/components/social-bar.svelte';
	import { Card } from '$lib/components/ui';
</script>

<Card class="mt-12 flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:p-8">
	<div class="flex shrink-0 flex-col items-center gap-3">
		<div
			class="size-28 overflow-hidden border-2 border-border bg-surface-muted shadow-brutal-sm sm:size-32"
		>
			<enhanced:img
				class="h-full w-full object-cover"
				src={headshot}
				alt="Headshot of Connor Wade"
			/>
		</div>
		<SocialBar />
	</div>

	<div class="space-y-3 text-center sm:text-left">
		<div class="inline-block">
			<span class="block font-mono text-xs font-bold tracking-widest text-primary-hover uppercase">
				Written by
			</span>
			<h3 class="font-serif text-2xl font-bold tracking-tight text-foreground">Connor Wade</h3>
		</div>
		<p class="font-serif text-sm leading-relaxed text-muted sm:text-base">
			Connor is an engineering lead and writer focused on reactive systems, performance
			architecture, and modern web applications. When not crafting software, he enjoys composing
			music, lifting weights, and exploring design systems.
		</p>
	</div>
</Card>
