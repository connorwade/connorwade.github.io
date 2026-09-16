<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Button, Card } from '$lib/components/ui';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import X from '@lucide/svelte/icons/x';

	let {
		children
	}: {
		children: Snippet;
	} = $props();

	let headingElements: HTMLHeadingElement[] = $state([]);
	let isOpen = $state(false);

	onMount(() => {
		headingElements = Array.from(document.querySelectorAll('article h1, article h2, article h3'));
	});

	let markdownHeadings: { text: string; slug: string }[] = $derived(
		Array.from(headingElements).map((el) => ({
			text: el.textContent || '',
			slug: el.id
		}))
	);

	const scrollToTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		isOpen = false;
	};
</script>

<article
	class="mx-auto prose max-w-3xl font-serif prose-neutral dark:prose-invert
		prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
		prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-border-subtle prose-h2:pb-2 prose-h2:text-2xl prose-h2:sm:text-3xl
		prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:sm:text-2xl
		prose-p:text-base prose-p:leading-relaxed prose-p:text-muted prose-p:sm:text-lg
		prose-a:font-semibold prose-a:text-primary-hover
		prose-a:underline hover:prose-a:text-primary prose-blockquote:border-l-4 prose-blockquote:border-primary
		prose-blockquote:bg-surface-muted/50
		prose-blockquote:p-4 prose-blockquote:italic prose-strong:text-foreground prose-code:border prose-code:border-border-subtle
		prose-code:bg-surface-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-xs prose-code:sm:text-sm prose-pre:rounded-none prose-pre:border-2
		prose-pre:border-border prose-pre:shadow-brutal prose-li:font-serif prose-li:text-muted
		prose-img:border-2 prose-img:border-border prose-img:shadow-brutal"
>
	<hr id="top" class="my-2 border-none" />
	{@render children()}
</article>

<!-- Floating Table of Contents / Quick Action Widget -->
{#if markdownHeadings.length > 0}
	<aside aria-label="Table of contents widget" class="fixed right-6 bottom-6 z-40">
		{#if isOpen}
			<Card
				variant="elevated"
				class="animate-in fade-in slide-in-from-bottom-2 mb-3 flex max-h-[70vh] w-72 flex-col overflow-hidden p-4 duration-150 sm:w-80"
			>
				<div class="mb-3 flex items-center justify-between border-b-2 border-border-subtle pb-2">
					<span
						class="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-foreground uppercase"
					>
						<ListOrdered class="size-3.5" />
						<span>Table of Contents</span>
					</span>
					<button
						type="button"
						aria-label="Close table of contents"
						class="cursor-pointer p-1 text-muted transition-colors hover:text-foreground"
						onclick={() => (isOpen = false)}
					>
						<X class="size-4" />
					</button>
				</div>

				<!-- Headings list -->
				<div class="max-h-64 flex-1 space-y-1.5 overflow-y-auto pr-1 font-serif text-sm">
					{#each markdownHeadings as heading (heading.slug)}
						<a
							href={`#${heading.slug}`}
							class="block truncate border-l-2 border-transparent px-2 py-1 text-muted transition-colors hover:border-primary hover:bg-surface-muted hover:text-foreground"
							onclick={() => (isOpen = false)}
						>
							{heading.text}
						</a>
					{/each}
				</div>

				<!-- Scroll to top button -->
				<div class="mt-3 border-t border-border-subtle pt-3">
					<Button variant="primary" size="sm" class="w-full justify-center" onclick={scrollToTop}>
						<ArrowUp class="size-3.5" />
						<span>Return to top</span>
					</Button>
				</div>
			</Card>
		{/if}

		<Button
			variant="primary"
			size="md"
			class="shadow-brutal"
			onclick={() => (isOpen = !isOpen)}
			aria-expanded={isOpen}
			aria-label="Toggle table of contents"
		>
			<ListOrdered class="size-4" />
			<span class="hidden sm:inline">Contents</span>
		</Button>
	</aside>
{/if}
