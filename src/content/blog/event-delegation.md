---
title: "JavaScript Event Delegation"
description: "Should you delegate your events to a single element in JavaScript?"
pubDate: "January 2 2025"
draft: true
---

## What is Event Delegation?

In web development, event delegation is attaching events on the upper-most element in your document.

For example, if you have a basic clicker on a page, instead of attaching the event to the button, you would attach it to the document.

```html
<!-- Basic clicker example -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Event Delegation</title>
  </head>
  <body>
    <button class="counter">0</button>
  </body>
  <script>
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("counter")) {
        e.target.innerText = +e.target.innerText + 1;
      }
    });
  </script>
</html>
```

How does this work? Well, don't forget, in JavaScript, all events are bubbled up to ancestor component. (Though you do have the option of only listening to "captured" events.) This makes sense if you think about it. If you click a button on a page, you have technically also clicked the page and any other containing element of that button.

Therefore, even when you click on the button, technically, it was also a click on the document. More often than not, bubbling and capturing is actually a common source of frustration for beginner programmers (and some seniors on complex enough projects). However, we can also use them to simplify complex event patterns and slightly improve performance.

## What are the upsides to event delegation?

Broadly, event delegation can slightly improve performance and be easier to reason with.

### Faster event hydration

Normally during the rendering process of a web page, events are attached close to the end. This can sometimes create a lag between when the page is rendered and when a user can interact with it. However, when most events are on the same top-level element, the events are attached quicker.

### Reducing complexity

In some cases, you may want to handle multiple child element events. However, instead of handling each child separately, it may make sense to reduce the complexity and attach a singular handling event to the top level.

### Global reactivity

You may want to always treat certain elements and components the same. In that case, you can attach the events for those elements and components to the top-level to always be ready to handle them.

### You're using a frontend framework (and reaching the child components isn't as simple as you'd hope)

Sometimes you're working with a frontend framework and you may have a wrapper or parent component that handles its child components all the same way. In this case, adding an event to the wrapper element may make more sense than trying to deal with the child components.

## What are the downsides to event delegation?

However, as you might assume, event delegation can add complexity to a project. It may not even boost the performance meaningfully enough to actually warrant the added complexity.

### Event accumulation

If you aren't using any sort of framework to manage events, you may end up with multiple overlapping events on the same element. In order, to not have this occur, you need to be remove events...

### Event wrangling

If you are removing or adding elements and attaching their events to another element, you need to manually remove the events yourself.

## Example of more complex event delegation patterns

Event delegation can be used to simplify what we'd normally need loops for in JavaScript. By getting rid of loops we can reduce the performance cost of both looking for elements in our DOM and the hydration cost of attaching events.

Here's how you might create a small menu with loops. As loops get longer, the performance of JavaScript can really begin to suffer:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Menu</title>
  </head>
  <body>
    <div>
      <h1>Menu</h1>
      <p>Click to add to cart</p>
      <p>Cart</p>
      <p>Items: <span class="menu__items">0</span></p>
      <p>Total: $<span class="menu__cost">0.00</span></p>
    </div>

    <ul class="menu">
      <li><button class="menu__item" data-price="2.00">Iced Coffee</button></li>
      <li><button class="menu__item" data-price="3.00">Nice Coffee</button></li>
      <li><button class="menu__item" data-price="4.00">Latte</button></li>
    </ul>
  </body>
</html>

<script>
  const total = document.querySelector(".menu__cost");
  const items = document.querySelector(".menu__items");

  const menuItemEls = [...document.querySelectorAll(".menu__item")];

  for (let i = 0; i < menuItemsEls.length; i++) {
    menuItemsEls[i].addEventListener("click", function (e) {
      const price = e.target.dataset.price;
      total.innerText = (+total.innerText + +price).toFixed(2);
      items.innerText = +items.innerText + 1;
    });
  }
</script>
```

And here it is with event delegation (you could also delegate these events to the "menu" element, but I'm going with our document for now):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Menu</title>
  </head>
  <body>
    <div>
      <h1>Menu</h1>
      <p>Click to add to cart</p>
      <p>Cart</p>
      <p>Items: <span class="menu__items">0</span></p>
      <p>Total: $<span class="menu__cost">0.00</span></p>
    </div>

    <ul class="menu">
      <li><button class="menu__item" data-price="2.00">Iced Coffee</button></li>
      <li><button class="menu__item" data-price="3.00">Nice Coffee</button></li>
      <li><button class="menu__item" data-price="4.00">Latte</button></li>
    </ul>
  </body>
</html>

<script>
  const total = document.querySelector(".menu__cost");
  const items = document.querySelector(".menu__items");
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("menu__item")) {
      const price = e.target.dataset.price;
      total.innerText = (+total.innerText + +price).toFixed(2);
      items.innerText = +items.innerText + 1;
    }
  });
</script>
```

By not using a loop the event attaches once to the document and that's all we have to do to get interaction for the entirety of a menu item. If we were fetching and rendering elements for the menu, we wouldn't even need to worry about hydrating events on the element. We could just add elements as needed.

## Forms

Event delegation on forms allows you control and treat all inputs in the form the same. If you have a need for client-side validation or formatting, this would be a great place to include it.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Forms</title>
    <style>
      .error {
        display: none;
        &:has(+ form input[data-filled="false"]) {
          display: block;
        }
      }
    </style>
  </head>
  <body>
    <p class="error" style="color:red">Not all the fields are filled out</p>
    <form>
      <input data-filled="false" type="text" name="name" placeholder="Name" />
      <input data-filled="false" type="text" name="email" placeholder="Email" />
      <input data-filled="false" type="text" name="phone" placeholder="Phone" />
      <button type="submit">Submit</button>
    </form>
  </body>

  <script>
    const form = document.querySelector("form");
    const btn = document.querySelector("button");
    const error = document.querySelector(".error");
    let isFilled = false;

    form.addEventListener("change", function (e) {
      if (e.target.tagName !== "INPUT") return;

      if (e.target.value.trim() === "") {
        e.target.dataset.filled = "false";
      } else {
        e.target.dataset.filled = "true";
      }

      isFilled = [...document.querySelectorAll("input")].every(
        (input) => input.dataset.filled === "true",
      );
      btn.disabled = !isFilled;
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(form);
      console.log(Object.fromEntries(formData));
    });
  </script>
</html>
```

## Including a global delegation pattern

If you'd like to create a global function for event delegation, you could do something like this:

```ts
function on(el = document, ev: keyof DocumentEventMap, cb: (e: Event) => void) {
  el.addEventListener(ev, cb);

  return () => el.removeEventListener(ev, cb);
}
```

Using a function like this would ensure that you always target your document with events (if that's something you might want.) It maintains proper order of events. It also helps to have the remove event function returned so you can get rid of the event later.

## Final note

So should you use event delegation? Personally, I usually only use event delegation when dealing with lists or collections of the same element or working with forms.
