---
title: "AEM Edge: How to Lie About Performance"
description: "Adobe's latest framework makes big claims about performance while ignoring why the underlying numbers matter."
pubDate: "November 01 2023"
heroImage: "/lighthouse.jpg"
draft: false
---

## What is AEM Edge

Adobe Experience Manager Edge is Adobe's latest update to the AEM product line which has been around for almost a decade now. While they are calling it AEM, it has very little association with the old AEM as far as I can tell. In this new AEM Edge, authors author via document services such as Microsoft Word or Google Drive. I don't really have any problem with that. Plenty of CMS's already basically work that way already.

I will give it accolades where it deserves them, the content syncing to the delivered site is pretty flawless. They have thought about the authoring experience and it shows. Images are properly rendered and use the latest standards for performance. Adobe also claims that AEM Edge has perfect Lighthouse scores. While they aren't wrong about the (mostly) perfect Lighthouse scores, the scores are more of bug of Lighthouse rather than an accolade for Adobe.

## What is wrong with AEM Edge's performance?

AEM Edge works fairly straightforward. It serves an HTML file created from the document service, injects a header HTML from your development file system, loads a JavaScript script from the file system and serves it to the end user, and the script then basically builds the rest of the page by retrieving additional scripts and adding components.

The implementation is built on good intentions while not really understanding the how's or why's. What I mean by that is, the code does make an honest attempt to push performance, but ultimately, with the current architecture it will never be able to. First, the entire sheet is delivered in a non-completed state. As far as I can tell, the Adobe team expects the site owners to put in a heavy amount of DOM manipulation to finish the product. Second, the entire body of the document is delivered as `display=none`. Why is that the case? Because the heavy amount of loading and DOM manipulation that happens behind the curtain would harm the product's Lighthouse score. One of the score Lighthouse gives is for Cumulative Layout Shift. This measures how much the page shifts as it is rendered. Due to the unfinished nature of the HTML you receive and the amount of JavaScript that is used to correctly render the page, the pages shift a lot. By not showing it, AEM Edge is able to get away with huge amounts of DOM manipulation on the client side.

### But what is wrong with that? Isn't that a neat hack?

In a way, it kind of is; as long as you assume your end user is always in the optimal environment. The reality is: JavaScript breaks, users block JavaScript, and not everyone has good internet. If you throttle the speed of the page in the DevTools, you are greeted by a blank white screen that says nothing and gives no indication you are on a loading page. If you access the site with JavaScript disabled, you will only ever see a white screen. Adobe has basically traded one way site performance is measured while ignoring why that measurement exists. Cumulative layout shift is annoying to end users and is a sign of a poorly optimized DOM renders. By simply removing the screen, you haven't fixed layout shift, you've just broken your site and called it done.

## Blocks, maybe the worst implemented idea yet

Components within AEM edge are compiled into what they are calling "Blocks". The code for these have to be seen to believed.

```js
// Cards
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
```

Adobe really looked at all the great work being done for developers with amazing frontend frameworks and said, "Yeah, but what if we implemented Vanilla JS in the most borked way possible?" This code is slow, CPU intensive, and renders over the prerendered HTML body, making the HTML essentially useless. Passing JavaScript to HTML to render HTML is certainly a technique for speeding up performance I have never seen before... Most frameworks are working on trimming the fat by replacing more and more work with static elements, but AEM Edge would prefer it if we took those elements and redid them.

There really is no excuse for how this looks. It is terrible for development and it is terrible for client rendering.
