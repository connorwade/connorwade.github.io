---
title: "Custom Select Components"
description: "How to create a better custom select component than most UI libraries"
pubDate: "Nov 8 2024"
draft: false
---

## Quick updates about the blog (skippable)

Hopefully, this article marks my return and gets me back to writing. I have been busy with my career changing, maintaining open-source projects, and writing really long articles that never see the light of day. Honestly, I just don't have time to write really in-depth and long articles about the kind of technical things I want to cover. For now, I'm going to focus on smaller articles that cover the smaller web development topics. This is the first of such articles.

## Why select elements suck

The styling of select elements comes up far more than it should when creating a website. I can't tell you the number of times I have had the conversation of "Well, we can't style the select component the way it is in the design because of browser limitations." Why browsers continue to not support anyway of styling the select element more deeply with CSS only is beyond me. There are very obvious use cases for it.

However, when developers attempt to proxy select elements they will drop the select element all together. Usually the proxy is some sort of button with a dropdown. The dropdown has a list and the selected value is stored in-memory somewhere.

I hate that solution. It breaks multiple web fundamentals. If for example, you are using your select element only with forms, you now must submit your form with JavaScript. If you want to track changes to multiple input elements using a container-delegated event pattern (i.e. when you add `onChange` events to your form), you can't track those changes in a custom select form. Even using built-in form validation becomes a chore.

And now you say, "well what if I just proxy my select element to a `hidden` select element?" That won't work either. Updating the value of the select element to match your proxy element will only cover things like form submission. However, you still lose all the input events. This is because changing the value of the input with JavaScript does not create an event.

Finally, I think most proxied form inputs I see are just lacking in accessibility. I mean, it takes a lot of work to get it back to one-to-one, but you can get a lot closer with different methods.

## What I think is the correct solution

Okay, so let's think, what HTML element already exists and gives us:

- An ability to select an option out of multiple options
- Input events
- A form value
- A robust styling schema
- Some semantics that allow accessibility tools to understand what the dev intended

The answer: **radio inputs!**

If you think about it, a select is just a fancy radio input group anyways. It gives you an input that allows users to select a single element from a list of options.

You could take your dropdown and make a group of radio inputs like:

```html
<div class="custom-select">
  <button
    id="select-proxy-btn"
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="select-dropdown"
  >
    Select a person
  </button>
  <ul role="listbox" id="select-dropdown">
    <li role="listitem">
      <label>Mark<input hidden type="radio" name="group" value="1" /></label>
    </li>
    <li role="listitem">
      <label
        >David
        <input hidden type="radio" name="group" value="2" />
      </label>
    </li>
    <li role="listitem">
      <label>
        Susanne
        <input hidden type="radio" name="group" value="3" />
      </label>
    </li>
  </ul>
</div>
```

With a bit of styling, you can get something like this to match up with a select dropdown.

This isn't a great example, but something like:

```css
.custom-select {
  position: relative;
  width: 20%;
}
#select-dropdown {
  display: none;
  background-color: white;
  padding: 1rem;
  border: 1px solid darkgray;
  list-style: none;
  &.open {
    position: absolute;
    z-index: 100;
    top: 0%;
    display: block;
  }
}
```

You would still need some JavaScript in this case. Something along the lines of:

```js
const proxySelectEl = document.getElementById("select-proxy-btn");
const dropdown = document.getElementById("select-dropdown");

proxySelectEl.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

dropdown.addEventListener(
  "click",
  (e) => {
    if (e.target instanceof HTMLInputElement) {
      dropdown.classList.toggle("open");
      proxySelectEl.textContent = e.target.parentElement.innerText;
    }
  },
  true
);
```

Or you can just use a library like floating-ui that will do it for you.

## No JavaScript bonus points

When a user isn't using JavaScript (most likely because they are on a cellphone with spotty connection), you might want a fallback plan. There are two options:

1. Go back to using the `select` and lose all your custom styling.
2. Use the `details` element and lose some functionality.

Let's just pretend we like option 2 better.

If you've never seen the `details` element, it is one of the coolest yet under-utilized elements. Which is probably a good thing. I think most people would abuse the heck out of it. It is an element that when clicked, opens a dropdown to reveal more info. It is meant to be used as an accordion element.

And it is **NOT** semantically correct to use it as a select element. However, desperate times may call for desperate measures. More importantly, the day engineers actually care about accessibility before looking cool will be a cold day in hell.

So a quick and dirty way of doing a custom select element might have something like:

```html
<details>
  <summary
    role="combobox"
    aria-haspopup="listbox"
    aria-expanded="false"
    aria-controls="select-dropdown"
  >
    Select a person
  </summary>
  <ul role="listbox">
    <li role="listitem">
      <label>Mark<input hidden type="radio" name="group" value="1" /></label>
    </li>
    <li role="listitem">
      <label
        >David
        <input hidden type="radio" name="group" value="2" />
      </label>
    </li>
    <li role="listitem">
      <label>
        Susanne
        <input hidden type="radio" name="group" value="3" />
      </label>
    </li>
  </ul>
</details>
```

This element gives you 80% of the functionality for 20% of the work.

Don't worry though. In my next snippet, I will cover how to actually use the details component in a way that makes sense.
