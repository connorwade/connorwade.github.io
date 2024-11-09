---
title: "Svelte Component Inheritance"
description: "Using Svelte 5 to create extendable base components."
pubDate: "November 1 2024"
draft: true
---

Svelte 5 is finally released. It's been a long time coming. I'm sure a lot of svelte bloggers are happily rechurning Svelte 5 documentation. Telling you what runes are while not
providing any examples beyond what the Svelte team has already given us. Making 5 minute videos about how runes ruin Svelte while only providing examples found in the documentation. (Yeah, we know you're not actually using Svelte.)

Well, I'd like to do something a little different, and actually show off some of the new ways we can compose Svelte components.

Having a base component that is extendable is a pretty normal use case for a lot of frontend work. You may have dashboard cards that may share a lot of the same functions and layout, but require different parameters and contents. Svelte 5 takes these concepts and turns it up much higher than any other framework out there. In fact, dare I say it, the Svelte team may have given us too many options. Component composition in Svelte 5 has entered an entirely new world of possibilities. I'm going to cover some of the most powerful tools for extending components in Svelte that I've seen. However, there are probably even more patterns than what I'll write about here.

## Basic Wrappers

Let's say that we have a couple of components that are all functionally the same, but have different contents we want to display. This would be a good use case for wrappers. Let's take a step back and setup a classic inheritance example:

```svelte
<!-- Animal.svelte -->
<script>
	let {src, alt, children, sound} = $props();

    let makingNoise = $state(false)

    $effect(() => {
        if(makingNoise) {
            console.log(sound)
        }
    })
</script>

<button onclick={() => {makingNoise = true}} aria-label="animal sound">
<img {src} {alt} />
	<p>{@render children()}</p>
</button>
```

Here we have a basic animal card we are going to use that when clicked will make the sound of the animal. In order to use the Animal component, we might make a dog component that inherits Animal and standardizes the reuse of it across the app:

```svelte
<!-- Dog.svelte -->
<script>
	import Animal from './Animal.svelte'
</script>

<Animal
    src="https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	alt="dog"
    sound="woof"
>
	    Photo by <a href="https://unsplash.com/@baptiststandaert?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Baptist Standaert</a> on
    <a href="https://unsplash.com/photos/long-coated-black-and-white-dog-during-daytime-mx0DEnfYxic?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
        Unsplash
    </a>
</Animal>
```

This is a pretty common way of composing components in modern frontend frameworks. Nothing particularly earth-shattering here. What makes Svelte 5 actually interesting, is that we can also inherit the state of the component. For instance, if we rewrote Animal like:

```svelte
<!-- Animal.svelte -->
<script module>
	let makingNoise = $state(false)

	export function getMakingNoise() {
		return makingNoise
	}

	export function toggleMakingNoise() {
		makingNoise = !makingNoise;
	}
</script>

<script>
	let {src, alt, children} = $props();
</script>

<button onclick={() => {makingNoise = true}} aria-label="animal sound">
<img {src} {alt} />
	<p>{@render children()}</p>
</button>
```

Then we could rewrite Dog like:

```svelte
<!-- Dog.svelte -->
<script>
	import {getMakingNoise, toggleMakingNoise} from './Animal.svelte'
	import Animal from './Animal.svelte'

	let dialog;

	$effect(() => {
		if(getMakingNoise()) {
			dialog.showModal();
		}
	})
</script>

<Animal
    src="https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	alt="dog">
	    Photo by     <a href="https://unsplash.com/@baptiststandaert?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Baptist Standaert</a> on
    <a href="https://unsplash.com/photos/long-coated-black-and-white-dog-during-daytime-mx0DEnfYxic?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">
        Unsplash
    </a>
</Animal>
<dialog bind:this={dialog} onclose={() => {
	toggleMakingNoise();
}}>
	Woof
	<form method="dialog"><button>close</button></form>
</dialog>
```

In this way, we can define state where it is _descriptive_ and use it where it is _functional_.

If you want to play around with this example, here is the REPL: [Svelte 5 REPL for animal inheritance](https://svelte.dev/playground/004f8f9799ea4115a8ef022a2a514d11?version=5.1.9).

## Promise Wrappers

Svelte has a slightly unique way of using
