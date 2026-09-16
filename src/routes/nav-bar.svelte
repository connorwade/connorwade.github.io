<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Logo from '$lib/components/logo.svelte';
	import NavMenu from './nav-menu.svelte';
	import ThemeController from './theme-controller.svelte';
	import CustomIcon from '$lib/components/custom-icon.svelte';
	import { Button } from '$lib/components/ui';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import { slide } from 'svelte/transition';

	const SITE_TITLE = 'Coding Akita';

	let mobileMenuIsOpen = $state(false);

	// Close mobile menu whenever navigation occurs
	$effect(() => {
		// Track pathname changes
		page.url.pathname;
		mobileMenuIsOpen = false;
	});
</script>

<header
	class="sticky top-0 z-40 border-b-2 border-border bg-background/95 backdrop-blur-md transition-colors duration-200"
>
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-8">
		<!-- Brand / Logo -->
		<a
			href={resolve('/')}
			class="group flex items-center gap-3 text-foreground no-underline select-none"
			onclick={() => (mobileMenuIsOpen = false)}
		>
			<div
				class="flex size-9 items-center justify-center border-2 border-border bg-primary shadow-brutal-sm transition-transform duration-150 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:size-10 dark:bg-primary dark:shadow-primary-subtle"
			>
				<Logo class="size-6 fill-current text-primary-foreground dark:text-background" />
			</div>
			<span
				class="font-serif text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary-hover sm:text-2xl"
			>
				{SITE_TITLE}
			</span>
		</a>

		<!-- Right actions: Desktop Nav + Socials + Theme + Mobile Trigger -->
		<div class="flex items-center gap-2 sm:gap-4">
			<!-- Desktop Menu -->
			<NavMenu orientation="horizontal" class="hidden sm:flex" />

			<div class="mx-1 hidden h-5 w-0.5 bg-border-subtle sm:block"></div>

			<!-- GitHub Desktop Link -->
			<Button
				href="https://github.com/connorwade"
				target="_blank"
				rel="noreferrer"
				size="icon"
				variant="default"
				class="hidden sm:inline-flex"
				title="GitHub Profile"
				aria-label="GitHub Profile"
			>
				<CustomIcon icon="github" class="size-4 fill-current" />
			</Button>

			<!-- Theme Mode Toggle -->
			<ThemeController />

			<!-- Mobile Hamburger / Close Button -->
			<Button
				variant="default"
				size="icon"
				class="sm:hidden"
				aria-label={mobileMenuIsOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={mobileMenuIsOpen}
				onclick={() => {
					mobileMenuIsOpen = !mobileMenuIsOpen;
				}}
			>
				{#if mobileMenuIsOpen}
					<X class="size-4.5" />
				{:else}
					<Menu class="size-4.5" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Mobile Dropdown Panel -->
	{#if mobileMenuIsOpen}
		<div
			transition:slide={{ duration: 150 }}
			class="border-t-2 border-border bg-surface px-4 py-5 shadow-brutal sm:hidden"
		>
			<NavMenu orientation="vertical" onNavigate={() => (mobileMenuIsOpen = false)} />
		</div>
	{/if}
</header>
