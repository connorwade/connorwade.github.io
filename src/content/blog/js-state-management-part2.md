---
title: "How to: JavaScript State Management Without Libraries - Part 2"
description: "How to build state stores or context"
pubDate: "April 17 2024"
draft: false
---

In the first part of my series about JavaScript state management, we talked about how to create a function that allowed you to control reactive local state. In this part, I will show you how to create state that persists across a page and multiple pages on the client.

## Creating a store

A store or context is a state management structure that allows components to subscribe to, unsubscribe from, and retrieve the current state. When subscribed, a component will run a callback when the state changes. Now, so far that doesn't sound any different from the `setState` function we developed in part 1. What makes the store so powerful is that we can define a single store with a defined set of functionality that controls multiple components with a single state.

Let's create a `scripts/state.ts` file and move our `useState` function to it. Then let's add some new code:

```ts
// scripts/state.ts

//... useState

function useSubscription(): {
  notify: () => void;
  subscribe: (callback: () => void) => () => void;
  unsubscribe: (callback: () => void) => void;
} {
  const eventName = "state-changed";
  const eventTarget = new EventTarget();

  function notify() {
    eventTarget.dispatchEvent(new CustomEvent(eventName));
  }

  function subscribe(callback: () => void) {
    eventTarget.addEventListener(eventName, callback);
    return () => unsubscribe(callback);
  }

  function unsubscribe(callback: () => void) {
    return eventTarget.removeEventListener(eventName, callback);
  }

  return { notify, subscribe, unsubscribe };
}

export function useStore<T, U>({
  initialState,
  reducer,
}: {
  initialState: T;
  reducer: (state: T, action: U) => T;
}) {
  let state = initialState;

  const { notify, subscribe, unsubscribe } = useSubscription();

  const dispatch = (action: U) => {
    state = reducer(state, action);
    notify();
  };

  return { getState: () => state, dispatch, notify, subscribe, unsubscribe };
}
```

Let's talk about what's going on here. First, we define a function called `useSubscription`. (This function could just be part of `useStore`, but I think the functionality of that function is self-contained so I like having it as it's own function.) The function defines a new `customEvent` in the code and creates an `eventTarget` that isn't a DOM element. This is a powerful JavaScript pattern that allows us to utilize the event loop on the client.

Notice that we have a `notify` function that dispatches this custom event to our newly created `eventTarget`. Then `subscribe` and `unsubscribe` are defining `eventListeners` on our `eventTarget`. The nice thing about keeping `eventTarget` restricted to the scope of this function is that having multiple stores won't effect the others. If we allowed `eventTarget` to exist outside of the scope of this function, using `notify` would effect multiple stores.

The actual function of `useStore` takes in an initial state as the parameter and a reducer. Now, why do I use a reducer if I supposedly love Svelte so much more than React? Because I actually kind of like the reducer pattern from React. The switch-statement is a nice way of defining store logic in my own opinion. If I have the choice, I'll stick with it. But as I always say, it's your code, do what you're comfortable with.

We define state in the function's scope as the initial state. Then we get the `notify`, `subscribe`, and `unsubscribe` from the `useSubscription` function. Then we're only going to define two more functions: `dispatch` and `getState`.

The `dispatch` function has a really simple job, it updates the state based on the reducer function and then notifies the subscribed components of the state change. The `getState` function is even simpler: it returns the current state.

## Example - a store for counting

Here's how we might use the store to keep the state of a count across multiple components:

```ts
// /scripts/countStore.ts

import { useStore } from "./state";

const count = useStore<
  {
    count: number;
  },
  { type: "INCREMENT" } | { type: "DECREMENT" } | { type: "RESET" }
>({
  reducer: (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return {
          ...state,
          count: state.count + 1,
        };
      case "DECREMENT":
        return {
          ...state,
          count: state.count - 1,
        };
      case "RESET":
        return {
          ...state,
          count: 0,
        };
      default:
        return state;
    }
  },
  initialState: {
    count: 0,
  },
});

export const { getState, dispatch, subscribe, unsubscribe } = count;
```

Yeah, I was a monster and just exported the individual functions when i wrote this. I don't know what's wrong with me. But I'm sticking to it.

We update our function using the _INCREMENT_, _DECREMENT_, and _RESET_ cases. Pretty self explanatory. You may notice that the state is defined as an object. In part 1 we also used an object to keep the scope of our state separate from the rest of the scope. We are doing the same thing here. However, here we just define state as being a object in the parameter and leave it to the user to do it correctly. Why do we do that? To me, a store is used when you're dealing with complex state, so you're likely going to be using an object with lots of keys and values anyway. It's better to leave the definition of it to the user.

The next thing we need to do is define a `Counter` component that uses the store as the source of its state:

```astro
// components/Counter.astro

<div class="counter">
  <button class="inc">+</button>
  <span class="count">0</span>
  <button class="dec">-</button>
  <button class="reset">Reset</button>
</div>

<script>
import {
  subscribe,
  getState,
  dispatch,
  unsubscribe,
} from "../scripts/countStore";

const counters = [
  ...document.querySelectorAll(".counter"),
]! as HTMLDivElement[];

counters.forEach(hydrateCounter);

function hydrateCounter(counter: HTMLDivElement) {
  const inc = counter.querySelector(".inc")!;
  const dec = counter.querySelector(".dec")!;
  const count = counter.querySelector(".count")!;
  const reset = counter.querySelector(".reset")!;

  function render() {
    count!.textContent = `${getState().count}`;
  }

  render();
  subscribe(render);

  inc.addEventListener("click", () => {
    dispatch({ type: "INCREMENT" });
  });

  dec.addEventListener("click", () => {
    dispatch({ type: "DECREMENT" });
  });

  reset.addEventListener("click", () => {
    dispatch({ type: "RESET" });
  });
}
</script>
```

It's a pretty straight forward component. We have three buttons and one display. The buttons increment, decrement, or reset the state. The display displays the current state from the count store.

Within the logic, we use the functional hydration pattern (my favorite pattern for static websites) to create the logic for the component. Within the hydration function we have a `render` function that defines how the function should render in regards to the state. We use it to define the initial render state of the component and then subscribe the render function to the store.

Each of the buttons are then assigned to a `dispatch` function. So, when the user clicks a button, the component dispatches a state change to the store. The store updates the current state. Then the subscribed function is run, in this case, `render`.

We can add this component to our `/pages/index.astro` file.

```astro
---
import Layout from "../layouts/Layout.astro";
import Counter from "../components/Counter.astro";
---

<Layout title="State Management">
  <main>
    <Counter />
  </main>
</Layout>
```

If we run this on the dev server, we should see the component increment and decrement as the state changes. However, that isn't very interesting. We already could do that with our `useState` function. Let's make it more interesting by adding a second counter to the page.

```astro
---
import Layout from "../layouts/Layout.astro";
import Counter from "../components/Counter.astro";
---

<Layout title="State Management">
  <main>
    <Counter />
    <Counter />
  </main>
</Layout>
```

Now you should see both counters reacting to the state change regardless of which one's buttons are pressed. Pretty neat so far.

We could also use the store to effect another component, it doesn't have to just be the counters we've defined so far. Let's create another function that just watches the change in the count store `/components/CounterWatcher.astro`.

```astro
<h1 class="header-count">0</h1>

<script>
import { subscribe, getState } from "../scripts/countStore";

function render() {
  document.querySelector("h1")!.innerText = `${getState().count}`;
}

render()
subscribe(render);
</script>
```

If we add this component to the page, we should see it matches the state of the counters.

```astro
---
import Layout from "../layouts/Layout.astro";
import Counter from "../components/Counter.astro";
import CounterWatcher from "../components/CounterWatcher.astro";
---

<Layout title="State Management">
  <main>
	<CounterWatcher />
    <Counter />
    <Counter />
  </main>
</Layout>
```

One last note I want to make before we move on, in part 1, the `useState` function also handled initializing and setting the state of the UI to match the state of the store. With stores this is left to the user. Why? Well, because we have to setup the store before the logic for the UI exists. There are definitely ways of doing it, but I personally think that it isn't advantageous.

## Persisting a Store Across the Client

So while the ability to control state across a page is pretty cool, honestly, it's probably not as useful as being able to control state across a static website. Using this can actually open up a range of possibilities and honestly turn a static website into something that can have the advantages of client-side rendering when it makes sense. Let's take a look at how we can change our functions to handle state management across the website:

```ts
// /scripts/state.ts

export function useState<T>(
  initialValue: T,
  afterUpdate: () => void = () => {},
  beforeUpdate: () => void = () => {}
) {
  let hook = {
    value: initialValue,
    set(newValue: T) {
      beforeUpdate();
      hook.value = newValue;
      afterUpdate();
    },
  };

  queueMicrotask(() => {
    hook.set(hook.value);
  });

  return hook;
}

function useSubscription(): {
  notify: () => void;
  subscribe: (callback: () => void) => () => void;
  unsubscribe: (callback: () => void) => void;
} {
  const eventName = "state-changed";
  const eventTarget = new EventTarget();

  function notify() {
    eventTarget.dispatchEvent(new CustomEvent(eventName));
  }

  function subscribe(callback: () => void) {
    eventTarget.addEventListener(eventName, callback);
    return () => unsubscribe(callback);
  }

  function unsubscribe(callback: () => void) {
    return eventTarget.removeEventListener(eventName, callback);
  }

  return { notify, subscribe, unsubscribe };
}

export function useStore<T, U>(
  {
    initialState,
    reducer,
  }: {
    initialState: T;
    reducer: (state: T, action: U) => T;
  },
  {
    useLocalStorage = false,
    key = "state",
  }: { useLocalStorage?: boolean; key?: string } = {
    useLocalStorage: false,
    key: "state",
  }
) {
  let state = initialState;

  const { notify, subscribe, unsubscribe } = useSubscription();

  const dispatch = (action: U) => {
    state = reducer(state, action);
    notify();
  };

  if (useLocalStorage) {
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, JSON.stringify(initialState)); // define local storage with our initial state if local storage doesn't exist yet
    } else {
      state = JSON.parse(localStorage.getItem(key)!); // define state as our local storage value if it exists
    }
    subscribe(() => {
      localStorage.setItem(key, JSON.stringify(state));
    });
  }

  return { getState: () => state, dispatch, subscribe, unsubscribe };
}
```

The only function that changes is our `useStore` so let's see what we're doing. We're going to be using the Local Storage API for this. However, you could use server state, Session Storage, or, if you wanna get real nuts, the browser built-in database. I figure, we should keep this to what the most likely use-case would be. You could also reconstruct this function such that it has the ability to use all of those choices depending on what the user needs.

We defined an additional optional parameter for the function that let's the user define if they would like to use Local Storage and what key they would like to use for it.

To implement the Local Storage, we actually take advantage of the subscribe method. When the state changes, we write the new state to the Local Storage using the subscribe method.

Now, one thing you may have a complaint about with this function is that it requires a lot of JSON parsing and JSON parsing is notoriously slow. I'd posture that this method is effective for about 80% of all use cases. However, if you exist in that 20% case, you can modify it such that each key of your state object has it's own field in Local Storage. So for example, you go through the object key fields and write the local storage keys as "'STORE KEY':'OBJECT KEY'". Your Local Storage would look something like:

```json
{
  "statekey:count": "1",
  "statekey:doubleCount": "2"
}
```

You'd just use a for loop and rewrite when you need to. You could even implement a structure with large enough states that defines states as dirty or clean. Dirty state needs to be changed, but the others don't.

Okay, fine, I'll just show you an example of how you could do it:

```ts
export function useStore2<U>(
  {
    initialState,
    reducer,
  }: {
    initialState: Record<string, unknown>;
    reducer: (state: Record<string, unknown>, action: U) => T;
  },
  {
    useLocalStorage = false,
    key = "state",
  }: { useLocalStorage?: boolean; key?: string } = {
    useLocalStorage: false,
    key: "state",
  }
) {
  let state = initialState;
  let storageKeys = Object.keys(initialState).map(
    (stateKey) => `${key}:${stateKey}`
  );

  const { notify, subscribe, unsubscribe } = useSubscription();

  const dispatch = (action: U) => {
    state = reducer(state, action);
    notify();
  };

  if (useLocalStorage) {
    for (let storageKey of storageKeys) {
      let stateKey = storageKey.split(":")[1];
      if (localStorage.getItem(storageKey) === null) {
        localStorage.setItem(
          storageKey,
          String(initialState[stateKey]) // might still need a JSON parse if you're storing objects
        );
      } else {
        // you will have to resolve the type of the state value here to have proper conversion
        let stateType = typeof state[stateKey];
        if (stateType === "number") {
          state[stateKey] = Number(localStorage.getItem(storageKey));
        } else if (stateType === "boolean") {
          state[stateKey] = Boolean(localStorage.getItem(storageKey));
        } else {
          state[stateKey] = localStorage.getItem(storageKey);
        }
      }
      subscribe(() => {
        // check if state is dirty, if so, update local storage
        if (state[stateKey] !== localStorage.getItem(storageKey)) {
          localStorage.setItem(storageKey, String(state[stateKey]));
        }
      });
    }
  }

  return { getState: () => state, dispatch, subscribe, unsubscribe };
}
```

Anyways, I wouldn't use that method unless you absolutely had to, but it is much faster. It's one of those trade-offs where the code becomes less manageable, but the performance is better. it's also harder to clean up the local storage or retrieve it if you have to.

Defining the store is as easy as it was with the previous example. We just add the local storage parameters.

```ts
// scripts/countStore.ts

import { useStore } from "./state";

const count = useStore<
  {
    count: number;
  },
  { type: "INCREMENT" } | { type: "DECREMENT" } | { type: "RESET" }
>(
  {
    reducer: (state, action) => {
      switch (action.type) {
        case "INCREMENT":
          return {
            ...state,
            count: state.count + 1,
          };
        case "DECREMENT":
          return {
            ...state,
            count: state.count - 1,
          };
        case "RESET":
          return {
            ...state,
            count: 0,
          };
        default:
          return state;
      }
    },
    initialState: {
      count: 0,
    },
  },
  {
    useLocalStorage: true,
    key: "STATE:COUNT",
  }
);

export const { getState, dispatch, subscribe, unsubscribe } = count;
```

Now that we have that, let's see it work across the client. Create a new page in our Astro project. Do that by creating a new directory under `pages` and call it `count`. Then create a file under `count` called `index.astro`. In `index.astro`, add the following code:

```astro
--- import Counter from
"../../components/Counter.astro"; import CounterWatcher from
"../../components/CounterWatcher.astro"; import Layout from
"../../layouts/Layout.astro"; ---

<Layout title="Count">
  <Counter />
</Layout>
```

Run the development server for Astro. Increment the counters on the home page. Then add `/count` to the URL and visit that page. You should see that the counter value matches the value the first page had.

That's all there is to it. We now have defined a store function that allows us to create components that react to state changes across the entire client. There's a lot of room to play around with the two functions we've created and it allows us to change it for our own purposes. That's the best part of defining your own state structures is that you can make it work for exactly the use case you have. It's more important to understand the principles of how things work so that you can implement them yourself.

In the next part, we will be showing how to create signal state structures for vanilla JavaScript. While not quite as useful without a frontend framework, you can still do some really interesting state management with them on a static website.
