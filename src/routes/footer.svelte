<script lang="ts">
	import { resolve } from '$app/paths';
	import Logo from '$lib/components/logo.svelte';
	import { Button } from '$lib/components/ui';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';

	let copied = $state(false);
	const EMAIL = 'connor@codingakita.dev';

	const copyEmail = async () => {
		try {
			await navigator.clipboard.writeText(EMAIL);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (_) {}
	};
</script>

<footer class="mt-auto border-t-2 border-border bg-surface-muted/60 px-4 pt-12 pb-8 sm:px-8">
	<div class="mx-auto max-w-6xl">
		<div class="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
			<!-- Brand / Bio Column -->
			<div class="space-y-4 md:col-span-2">
				<div class="flex items-center gap-3">
					<div
						class="flex size-8 items-center justify-center border-2 border-border bg-primary shadow-brutal-xs"
					>
						<Logo class="size-5 fill-current text-primary-foreground" />
					</div>
					<span class="font-serif text-xl font-bold tracking-tight text-foreground">
						Coding Akita
					</span>
				</div>
				<p class="max-w-md font-serif text-base leading-relaxed text-muted">
					Exploring web engineering, reactive UI architectures, and modern software craftsmanship
					with a Japandi neo-brutalist aesthetic.
				</p>

				<!-- Quick Email Copy -->
				<!-- <div class="flex flex-wrap items-center gap-2 pt-2">
					<div
						class="border border-border-subtle bg-surface px-3 py-1.5 font-mono text-xs text-foreground select-all"
					>
						{EMAIL}
					</div>
					<Button variant="primary" size="sm" onclick={copyEmail}>
						{#if copied}
							<Check class="size-3.5" />
							<span>Copied</span>
						{:else}
							<Copy class="size-3.5" />
							<span>Copy Email</span>
						{/if}
					</Button>
				</div> -->
			</div>

			<!-- Navigation & Links -->
			<div class="space-y-3">
				<span
					class="mb-2 block font-mono text-xs font-bold tracking-widest text-foreground uppercase"
				>
					Navigation
				</span>
				<ul class="space-y-2 font-mono text-sm">
					<li>
						<a href={resolve('/')} class="text-muted hover:text-primary-hover hover:underline">
							→ Home
						</a>
					</li>
					<li>
						<a href={resolve('/blog')} class="text-muted hover:text-primary-hover hover:underline">
							→ Blog Archive
						</a>
					</li>
					<li>
						<a
							href="https://github.com/connorwade"
							target="_blank"
							rel="noreferrer"
							class="text-muted hover:text-primary-hover hover:underline"
						>
							→ GitHub
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/connor-wade-2094681a0/"
							target="_blank"
							rel="noreferrer"
							class="text-muted hover:text-primary-hover hover:underline"
						>
							→ LinkedIn
						</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom copyright bar -->
		<div
			class="flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 font-mono text-xs text-muted sm:flex-row"
		>
			<span>© {new Date().getFullYear()} Connor Wade. All rights reserved.</span>
			<span class="text-xs">Built with SvelteKit & Tailwind CSS</span>
		</div>
	</div>
</footer>
