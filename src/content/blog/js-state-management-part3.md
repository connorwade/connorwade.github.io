---
title: "How to: JavaScript State Management Without Libraries - Part 3"
description: "How to use signal state management on static websites"
pubDate: "April 18 2024"
draft: false
tags: ["coding"]
---

In the first two parts of this series I showed how we could create common state management hooks such as `useState` and `useStore`. In this part, I want to review one of the most in vogue state management patterns: the signal. Signals have received a lot of attention in the frontend framework community. The basic promise is simple enough: signals are a type of state that only update what has actually changed.

This is groundbreaking for the React community who put up with subpar rendering strategies like `useMemo` and `useCallback` to manage when state changes _shouldn't_ rerender a component. For other frameworks, it's a little more shaky. For instance, before doing a deeper dive into the concept, Rich Harris was fairly dismissive of signals for Svelte as it already had a way of updating only what was changed by state. However, future updates of Svelte will include the signal pattern that will fine-tune the state experience even more.

As for static websites, why should we care? Since we directly control the rendering of components, does it really matter to have such a robust state manager? I don't necessarily think so. However, the ability to have a derived state can be a valuable pattern. This post really won't cover a full implementation of signal. It will give an idea of what we could use for a signal-like experience. However, we won't be on par with really robust signal packages. If you want to see an example of a fully-featured vanilla signal structure, you can check out this proposal for a JavaScript signal API: https://github.com/tc39/proposal-signals/tree/main.

We are going to focus on the main features of the signal:

- a parent state,
- child states that are computed based on the parent state,
- and only updating the child states when needed and only when the value of the state is accessed.

## Writing the useSignal function

Let's open the `/scripts/state.ts` file again. Add the following code to it:

```ts
// /scripts/state.ts
//...

export function useSignal<T>(initialState: T, effect: () => void) {
  const initialNode = {
    value: initialState,
  };

  function set(newState: T) {
    if (initialNode.value === newState) return;
    initialNode.value = newState;
    effect();
  }

  function get() {
    return initialNode.value;
  }

  function derive(deriveCallback: <U>() => U) {
    const derivedNode = {
      value: deriveCallback(),
      derivedFrom: initialNode.value,
    };

    function get() {
      // Check obvious case where the derived value is not up to date
      if (initialNode.value !== derivedNode.derivedFrom) {
        derivedNode.derivedFrom = initialNode.value;
        const nextVal = deriveCallback();
        // Check if the derived Value has actually changed
        if (derivedNode.value !== nextVal) {
          derivedNode.value = nextVal;
        }
      }
      return derivedNode.value;
    }

    return { get };
  }

  return { set, get, derive };
}
```

Let's talk about what this code has got going on. First, it takes in an initial state and an effect callback. Pretty standard for what we've been writing so far. Why call the state object that's created a "node"? Because in real signals, you think of the state being a graph structure. We are kind of doing that here, but the edges are little fuzzily defined. We wouldn't really be able to walk this node.

We have one function called `set`. This function is pretty straightforward. Much like our earlier state functions this one sets the state value and performs the side-effect. Usually signals are supposed to be side-effect free until the value is retrieved, but with our simplified setup, it just isn't possible. For the most part, our base signal functions like `setState`. And just like our `setState` function you can fine-tune that side-effect however you'd like.

The most interesting part is the `derive` function. It takes in a callback that computes the derived state from the signal state. The derived node also tracks the signal value that last updated it's state.

As the derived state is meant to be read-only, we do not give a `set` function. The `get` function is quite a bit more robust though. As discussed above, we only want to compute the value of the derived state when we retrieve the value. We also only want to update it when the value is actually changed.

As you can see from my comments, we use two conditions to check that this true. We check first that the value of the initial node state is actually different from what the derived state was calculated from. If that's true, then we need to compute the value. However, before committing it, we actually check if the value is different from the previous value. If that is true we reassign the derived state value.

## Example use

Let's create a new component in our Astro project. I called this component "tabber". It's a dumb name that doesn't really describe it, but hey, naming things is the hardest part of programming. (Or that's what all the hot-takes on x-itter tell me.)

Anyways create a new Astro file `/components/tabber.astro`. Then add the following code:

```astro
<div class="tabber">
  <h3>Red</h3>
  <ul>
    <li><button>Red</button></li>
    <li><button>Orange</button></li>
    <li><button>Yellow</button></li>
    <li><button>Green</button></li>
    <li><button>Blue</button></li>
    <li><button>Indigo</button></li>
    <li><button>Violet</button></li>
  </ul>
</div>

<style>
  h3 {
    color: white;
  }

  .red {
    background-color: red;
  }

  .orange {
    background-color: orange;
  }

  .yellow {
    background-color: yellow;
  }

  .green {
    background-color: green;
  }

  .blue {
    background-color: blue;
  }

  .indigo {
    background-color: indigo;
  }

  .violet {
    background-color: violet;
  }
</style>

<script>
  import { useSignal } from "../scripts/state";

  const tabbers = [...document.querySelectorAll(".tabber")] as HTMLDivElement[];

  tabbers.forEach(hydrateTabber);

  function hydrateTabber(tabber: HTMLDivElement) {
    const buttons = tabber.querySelectorAll("button");
    const title = tabber.querySelector("h3");

    const activeBtn = useSignal(buttons.item(0));
    const activeText = activeBtn.derive(() => activeBtn.get().textContent);
    const activeClass = activeBtn.derive(() => {
      return activeText.get().toLowerCase();
    });

    const signalEvent = new CustomEvent("btn-signal-change");

    buttons.forEach((button) => {
      const isActive = activeBtn.derive(() => button === activeBtn.get());

      button.addEventListener("btn-signal-change", () => {
        if (isActive.get()) {
          button.className = activeClass.get();
        } else {
          button.className = "";
        }
      });

      button.addEventListener("click", () => {
        activeBtn.set(button);
        title!.textContent = activeText.get();
        buttons.forEach((btn) => btn.dispatchEvent(signalEvent));
      });
    });
  }
</script>
```

Here we have a component that tracks which button is active on the page, rewrites classes, and sets content of a header. We do this by creating an active button signal that tracks which button is active. We then derive two states from that: the text content of the active button and the class of the active button (which is really derived from the active text).

From there we hydrate each button with two events and another derived state. The derived state checks whether the button is the active button. The first event is a custom event that is setup as a way we can inform the other buttons of a change in the signal (because there are no inherent side-effects in a signal on a static website). The second event is our "click" event. It sets a new active button and renders the DOM to it's next state.

## Side effects for static sites

Now this way of using signals is cool and all, but it sure does seem like we're wasting potential here. We are doing a lot of work twice and we're kind of trapped using loops. It really doesn't seem like a very good solution. So what if we instead added another feature to our signals? A feature that allows us to run a callback when derived state changes due to the signal state changing.

Here's how we might implement that feature:

```ts
export function useSignal<T>(initialState: T) {
  const initialNode: {
    value: T;
  } = {
    value: initialState,
  };

  const sideEffects: {
    effect: () => void;
    dependencies: any[];
  }[] = [];

  function set(newState: T) {
    if (initialNode.value === newState) return;
    initialNode.value = newState;

    for (let { effect, dependencies } of sideEffects) {
      if (
        dependencies.length === 0 ||
        dependencies.some((d) => {
          d.__node.update();
          return d.__node.dirty;
        })
      ) {
        effect();
      }
    }
  }

  function get() {
    return initialNode.value;
  }

  function derive(deriveCallback: () => any) {
    const derivedNode = {
      value: deriveCallback(),
      derivedFrom: initialNode.value,
      dirty: false,
      update: () => {
        if (initialNode.value !== derivedNode.derivedFrom) {
          derivedNode.derivedFrom = initialNode.value;
          const nextVal = deriveCallback();
          if (derivedNode.value !== nextVal) {
            derivedNode.value = nextVal;
            derivedNode.dirty = true;
          }
        }
      },
    };

    function get() {
      derivedNode.update();
      derivedNode.dirty = false;
      return derivedNode.value;
    }

    return { get, __node: derivedNode };
  }

  function useEffect(effect: () => void, dependencies: any[]) {
    sideEffects.push({ effect, dependencies });
  }

  return { set, get, derive, useEffect };
}
```

With this updated function, we remove the effect dependency and replace it with a `useEffect` hook that's returned from the function. The hook works very much like the one in React. It takes a callback and an array of dependencies. It adds both of those to an array of side-effects that run when the signal state is updated. However, the effect will only run if the derived state dependency is "dirty". For state to be dirty, it means that when the signal state updated the derived state also updated, but the effects of that state change have not yet been resolved.

To do this, we add two properties to the derived node objects. One is a flag specifying whether the node is dirty or not. The other is an update function that encapsulates the updating logic we used for the `get` function previously. In order to get the derived state to work properly we have to have access to the derived node. Therefore, we return it in the `derive` function. But, since we don't want users necessarily accessing it, we add some underscores just to indicate to the end user that these aren't there for them to use. We could do some encapsulation to get it so we don't have to do that, but this is just easier. If I was building a real library that I expected thousands of people to use without my guidance, I'd go ahead and encapsulate that away from the user. But the reality is, my code will probably used by myself and maybe a couple people who work with me.

Anyways, at the end of the update function, we now mark that the node is "dirty". The way you update whether the node is still "dirty" is a little bit up to you and let me explain why. In my code, I did it by the code being retrieved. Once the value is used, in general we can assume that the state was resolved. However, you may want a more shallow resolution. In that case, you may only want to clean it once it has been used as a dependency in an effect. For most cases, it won't matter, but if you have a lot of layers of callbacks and effects, one strategy might benefit you more over the other.

To determine whether an effect should run, we check if any dependencies are included. If none are then the effect just runs by default. However, if there are dependencies we need to check if any are currently dirty. If they are dirty, we run the effect.

## Example of side effects with signals

Let's modify the code we used for the poorly name `Tabber` component.

```ts
import { useSignal } from "../scripts/state";

const tabbers = [...document.querySelectorAll(".tabber")] as HTMLDivElement[];

tabbers.forEach(hydrateTabber);

function hydrateTabber(tabber: HTMLDivElement) {
  const buttons = tabber.querySelectorAll("button");
  const title = tabber.querySelector("h3");

  const activeBtn = useSignal(buttons.item(1));
  const activeText = activeBtn.derive(() => activeBtn.get().textContent);
  const activeClass = activeBtn.derive(() => {
    return activeText.get().toLowerCase();
  });

  buttons.forEach((button) => {
    const isActive = activeBtn.derive(() => activeBtn.get() === button);

    function render() {
      console.log("rendering");
      if (isActive.get()) {
        button.className = activeClass.get();
        title!.textContent = activeText.get();
      } else {
        button.className = "";
      }
    }

    render();

    activeBtn.useEffect(() => {
      render();
    }, [isActive]);

    button.addEventListener("click", () => {
      activeBtn.set(button);
    });
  });
}
```

I've included a console log to show the number of times the render function is called on the component. You should see it run several times at first to render all the buttons (which strictly speaking, you could just run it for the active one, but it doesn't hurt to just start from a zero state). Then when you click a button the render should run twice, once for the active button becoming inactive and once for the clicked button becoming active.

And there you have it, an implementation of a signal-like state manager that works with a static website. Signal-like because it really isn't _exactly_ like what a signal is in a frontend framework. Honestly, we've kind of created something more similar to Svelte's derived state functionality. It's still really cool and it's probably as close as we can get without writing way more code than is really necessary I feel like. If you are interested in something more robust, I linked the Github repo for the signal proposal in JavaScript in the first paragraph.

At this point, we've gone over three strategies for state management. For the next article, I will probably take a break from state management for a bit and write about hydration of components on static websites.
