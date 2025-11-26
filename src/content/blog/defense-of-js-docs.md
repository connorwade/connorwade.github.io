---
title: "In Defense of JSDocs"
heroImage: "../../assets/typescript.jpg"
description: "Why are developers using JSDocs over TypeScript?"
pubDate: "May 16 2023"
draft: true
---

Recently the Svelte team shifted their codebase type annotations from TypeScript to JSDocs. It in no way affected the end users of the library and Sveltekit had already been using JSDocs for almost a year. However, while being just the internal preference of a single team, this change sent a ripple through the developer community. "How could anyone, particularly the Svelte team, not use TypeScript?" The creator of Svelte, Rich Harris, stated that he did not understand why this has been so controversial in the developer community.

I think the simple answer is that, in the world of web development, the idea of not viewing TypeScript as the default is heresy. And for a well-loved and well-respected JavaScript library to not use it, shatters the world view of certain developers.

The idea of TypeScript being the default is on display everywhere in JavaScript development now. A lot of frameworks default to using TypeScript out of the box. When someone criticizes JavaScript online the first reply will inevitably be, "But have you tried TypeScript? TypeScript fixes everything about JavaScript." Coders at some companies haven't seen JavaScript in 3 years now because their internal teams all switched and haven't gone back. TypeScript has pretty much replaced JavaScript in all serious and enterprise coding. I would go so far as to say, when projects are done in vanilla JavaScript, they are judged in the developer community.

I don't necessarily think these are bad things. TypeScript is a good language. I use TypeScript daily at my job and encourage other people at my job to understand how it works and to use it.

However, months before, I also started to tell people that I think we've swung too far on TypeScript. Accepting it as the default has been a mistake. I started to code JavaScript projects using JSDocs type annotations for smaller libraries. By replacing TypeScript with JSDocs, I was able to greatly reduce the complexity needed for my code to run while still having access to type checking and code completion. I didn't need to install "ts-node" to test my library or install types or install packages to make ESLint work. Everything just worked because I didn't use TypeScript.

## What are JSDocs Type Annotations

The best introduction I could give to JSDoc annotations are from [TypeScript themselves](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

In essence, it's a way of type checking your JavaScript using comments. Like so:

```js
/**
 * @type {string}
 */

var s;
```

This code sets the variable "s" as a string type. Just like with TypeScript you now have access to code completion and type checking. You can enforce rules with a "jsconfig.json" file. And this is just the lowest level of typing for JSDocs. You can type pretty much every part of your code just like with TypeScript. you can even use "\*.d.ts" files for creating types and use them in your code.

Some notable things that annoy people about JSDocs vs. TypeScript are:

1. While the typing is enforced while you are developing, you don't actually get type safety at build time if you haven't set anything up to parse your code during bundling.
2. A lot of people feel like the syntax of JSDocs isn't very readable compared to TypeScript and they don't like the cascade of comments.
3. TypeScript can handle more complex typing situations because it is a more complete system.

## Why Use JSDocs?

The biggest downside to TypeScript is that by using it you are including an extra transpilation step in your build process. That transpilation step can add unnecessary headaches for bundling, building, testing, linting, formatting, and debugging. You are also forced to use TypeScript specific dependencies to fix dependencies that don't work with TypeScript. You have to add TypeScript support for Node.JS, for testing libraries like Jest, for the bundler you are using, etc. It's a lot of architectural problems to incorporate typing. For some projects, these headaches are well worth the reward. Teams with very mixed experience levels can really benefit from using TypeScript for example.

JSDocs in comparison don't come with the same amount of overhead that TypeScript comes with. There can be a little bit of setup if you want type safety during the build process, but by dropping the transpilation step, you instantly make your development process quite a bit easier. Personally, I am fine with that trade-off for a lot of my own projects.

## TypeScript Does Not Make JavaScript Statically Typed

People do not like this, but JavaScript is a dynamically typed language by default. TypeScript does not save you from runtime type errors. TypeScript is transpiled into JavaScript and runs the exact same way, there's no secret sauce once it has been transpiled. The very nature of JavaScript means no protection from runtime type errors. Some classic demonstrations of developer frustrations in TypeScript are still present in JavaScript:

```ts
// Developed in the TS Playground at https://www.typescriptlang.org/play using v5.0.4, standard TSConfig
const num: number = 0;
const strNum: string = "0";
const bool: boolean = false;
let str: string;

function compare(a, b) {
  console.log(a == b);
}

compare(num, strNum); // Cast the string object to a primative number -> true
compare(num, bool); // Cast the boolean to be a number -> true
compare(strNum, bool); // Cast the string object to be a boolean -> true

function isFalsish(a) {
  a ? console.log("Is Truish") : console.log("Is Falsish");
}

isFalsish(str); // Cast undefined string to boolean -> "Is Falsish"
isFalsish(num); // Cast number to boolean -> "Is Falsish"
isFalsish(strNum); // Cast defined string to boolean -> "Is Truish"
isFalsish(bool); // Proper use of boolean -> "Is Falsish"

console.log(num + strNum); // Cast number to string to concat with other string variable -> "00"
```

In a true typing system there is no way we would be allowed to compare a boolean value to a string value. Yet in JavaScript (and therefore, in TypeScript) that is fair game. We also wouldn't cast an undefined variable to a false boolean value. To someone coming from a strong, statically typed language, this looks like madness.

Now, to be fair to TypeScript, if I had added some type annotations to my function parameters, this code wouldn't have transpiled at all. That is a completely fair criticism and again, I'm not trying to say TypeScript is bad. I'm just pointing out that TypeScript does not have the features that people believe that it has. More importantly, this would have been the same outcome in JSDocs as well.

While I am happy typing exists for JavaScript, people need to come with the terms that JavaScript is what it is. It is a little bit more freeform and jazzy than other languages. It's okay to not like that, but you should be aware of it when you're developing JavaScript. JavaScript is never going to be Rust.

If you are holding on to TypeScript because you think "it makes JavaScript a good language", it just doesn't work like that. I vote we stop worrying about what people think is a good or bad language and instead show what is good and bad engineering. JavaScript can be a bad language while still giving people the tools to make extraordinary things.

## Final Thoughts

This post is not meant to be a hit piece against TypeScript. If this is a hit piece against anyone it is against people in web development who scoff at the idea of using anything other than TypeScript. A good engineer thinks carefully about tools and how they are used to solve problems. You recognize the trade-offs of each and can make decisions based on the problem statement at hand.

I think there are lots of reasons to continue to use TypeScript. However, I feel like there are just as many valid reasons to be using JSDocs. If you have fallen into the camp of thinking that TypeScript should be the default for web development, I encourage you to at least play around outside of it. By reevaluating our biases we learn more and become better engineers.
