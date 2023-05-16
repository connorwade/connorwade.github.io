---
title: 'In Defense of JSDocs'
heroImage: '/typescript.jpg'
description: "Why are developers using JSDocs over TypeScript?"
pubDate: "May 17 2023"
draft: true
---

Recently the Svelte team decided to shift from TypeScript to JSDoc type annotations for their internal code typing. It in no way affected end users of the library and Sveltekit had already been using JSDocs for almost a year. However, while being just the internal preference of a single team, this change caused a ripple through the developer community. "How could anyone, particularly the Svelte team, not use TypeScript?" Rich Harris, the creator of Svelte, has stated that he does not understand why this has been a matter of such controversy in the developer community. Personally though, I feel like I 100% know why this became an issue: in the world of web development, the idea of not viewing TypeScript as the default is heresy.

We can see this idea of TypeScript being the default pretty much everywhere in JavaScript development now. Frameworks support TypeScript out of the box. When someone criticizes JavaScript online the first reply will inevitably be, "Have you tried TypeScript?" Coders at some companies haven't seen JavaScript in 3 years now because their internal teams all switched and haven't gone back. TypeScript has pretty much replaced JavaScript in all serious and enterprise coding.

I don't necessarily think these are bad things. TypeScript is a good language. (Microsoft calls it a language in the documentation so I do too.) I use TypeScript daily at my job and encourage other people at my job to understand how it works and to use it. However, we have also begun to code using JSDocs type annotations for smaller libraries. The reduced overhead from removing TypeScript has been much better for our smaller projects while keeping the things we love about TypeScript.

## What are JSDocs Type Annotations

The best introduction I could give to JSDoc annotations are from [TypeScript themselves](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html).

In essence, it's a way of type checking your JavaScript using comments. Like so:

```js
/**
 * @type {string}
 */

var s;
```

Now "s" is seen as a string variable in your code now. Just like with TypeScript, it will throw errors when you try to use it in place of a number. However, if you don't necessarily have any type checking in place (like using barebones TypeScript), it will only be a development error and won't be an error during compilation. Your text editor will also give you autocomplete for the variable. You gain a lot of TypeScript's great development experience without the overhead.

## Why Use JSDocs?

The biggest downside to TypeScript is that by using it you are including an extra transpilation step in your build process. That transpilation step can add unnecessary headaches for bundling, building, testing, linting, formatting, and debugging. We also are forced to bring in TypeScript specific dependencies to fix dependencies that don't work with TypeScript. You have to add in TypeScript support for Node.JS, for testing libraries like Jest, for the bundler you are using. It's a lot of architectural problems just for wanting to incorporate typing. For some projects, these headaches are well worth the reward. Honestly, I think for teams with very mixed experiences and very complex communication channels, TypeScript is king.

JSDocs in comparison don't come with the same amount of overhead that TypeScript comes with. There can be a little bit of setup if you want type safety during the build process, but by dropping the transpilation step, you instantly make your development process quite a bit easier. Personally, I am fine with that trade-off for a lot of my own projects both at my job and at home.

## The TypeScript Does Not Make JavaScript Statically Typed

People do not like when I remind them of this, but JavaScript is a dynamically typed language by default. TypeScript does not save you from runtime type errors. TypeScript is transpiled into JavaScript and runs the exact same way, there's no secret sauce once it has been transpiled. The very nature of JavaScript means no protection from runtime type errors. The easiest demonstration of this is for any comparative operations in JavaScript:

```js
const num:number = 0
const strNum:string = "0"
const bool:boolean = false
let str:string;


function compare(a, b) {
	console.log(a == b)
}


compare(num,strNum) //true
compare(num,bool) //true
compare(strNum,bool) //true


function isFalsish(a) {
	a ? console.log("Is Truish") : console.log("Is Falsish")
}


isFalsish(str) // "Is Flasish"
isFalsish(num) // "Is Flasish"
isFalsish(strNum) // "Is Truish"
isFalsish(bool) // "Is Flasish"


console.log(num + strNum) // "00"
```

Of course, what is happening here is that when JavaScript sees an equality comparison between two types, it will cast the types to match one another. For example in comparing "num" to "strNum", "strNum" is converted to a number. Therefore, although we said that "strNum" is a string it is now behaving like number. For my ternary operator, "strNum" is true while "num" is false. Even though they are both defined variables. Well, JavaScript sees "strNum" as defined so it marks it as true, but for "num" it takes the 0 as false. Finally, for "num + strNum = '00'", JavaScript thinks that I must want to concatenate and add to my string. Therefore, the number is converted to a string and added.

In a true typing system there is no way we would be allowed to compare a boolean value to a string value. Yet in JavaScript (and therefore, in TypeScript) that is fair game. In a true typing system, we also wouldn't cast an undefined variable to a false boolean value. To someone coming from a strong, static typed language, this looks like madness.

Now, to be fair to TypeScript, if I had added some type annotations to my function parameters, this code wouldn't have transpiled at all. That is a completely fair criticism and again, I'm not trying to say TypeScript is bad. I'm just pointing out that TypeScript does not have the features that people believe that it has. More importantly, this would have been the same outcome in JSDocs as well.

While I am happy typing exists for JavaScript, people need to come with the terms that JavaScript is what it is. It is a little bit more freeform and jazzy than other languages. It's okay to not like that, but you should be aware of what language you are writing in. JavaScript is never going to be Rust. Maybe one day WASM will become the standard for web development, but that is another topic for another day. For now, if you're a JavaScript developer, you're just going to have to understand the language.

## Final Thoughts

Now, like I said, this is not meant to be a hit piece against TypeScript. If this is a hit piece against anyone it is against people in web development who scoff at the idea of using anything other than TypeScript. A good engineer thinks carefully about tools and how they are used to solve problems. You recognize the trade-offs of each and can make decisions based on the problem statement at hand.   

I think there are lots of reasons to continue to use TypeScript. However, I feel like there are just as many valid reasons to be using JSDocs. If you have fallen into the camp of thinking that TypeScript should be the default for web development, I encourage you to at least play around outside of it. By reevaluating our biases we learn more and become engineers.


