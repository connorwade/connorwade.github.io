---
title: 'Rewriting AEM Edge Delivery'
heroImage: '/typescript.jpg'
description: "Exploring Performance Client-Side Performance By Rewriting AEM Edge"
pubDate: "November 4 2023"
draft: false
---

## What is AEM Edge Delivery?

AEM Edge Delivery is the latest CMS from Adobe promising better authoring and perfect performance scores. While there is a lot to praise about the system, I personally felt there were some changes that could be addressed. The system works by having authors create web pages within Google Drive that are then delivered as HTML templates to the end-user on a site. While that is all well and good, and indeed those systems of content authoring have been around for a while, after delivering the HTML is where things get interesting. AEM Edge Delivery runs a lot of JavaScript. Like a seriously, a lot of JavaScript. The delivered HTML document doesn't reflect rendered HTML document because so much of the document is rerendered when a user visits a page. A lot of this is to style component blocks into common web components such as hero's, or cards, or columns. Some of it is to bring in static remote HTML. And some of it is to remove nodes and set classes and hydrate components with listeners. There is a lot of rendering that happens when a page is loaded.

So if there is so much change happening on page load, how can AEM Edge Delivery promise such high Lighthouse scores? Well, they are kind of gamed. Currently the way AEM Edge Delivery does this is by having the entire page hidden until the rendering completes. Then once it is complete, the page is unhidden from the end user. Now, there is a lot that AEM Edge Delivery got right in terms of performance, so I don't want to beat them over the head and act like they did bad. For the most part, they did good. However, failure to render pages in an efficient manner has caused quite a bit of an issue. If you remove this little hack, the Lighthouse scores fall dramatically. For myself, I was seeing scores as low as 70 - still about on par with most AEM sites I've observed, but not really perfect.

In fairness, while I did give my feedback on the topic, I never thought I'd attempt to do an entire reimplementation of the system. That just seemed crazy. Instead, I was mostly focused on trying to integrate technology within it while working with their framework. I gave up on that project within two weeks back in spring.

Fast forward to this last week as Adobe has been beating the marketing drum on AEM Edge Delivery. I had been reading about coding hacks people use to hydrate SSR components and I wanted a shot to try it out. While I could've spun up something like Golang templates or Django, I thought about trying out AEM Edge Delivery since my company would likely want to explore it anyways. However, I knew from the beginning that would ripping out a lot of inards and just diving into it. So, I took a weekend and got to work.

## How can you define performance anyways?

Web performance is a tricky thing. There is of course Lighthouse, but while Lighthouse does give a score, I think it is very wrong to use this as a real metric to show that your site is good. Rather, Lighthouse is a diagnostic tool to tell you when something is wrong. If you attempt to game Lighthouse, the only thing you are doing is shooting yourself in the foot. Lighthouse is there to **cough cough** *guide* you. Anyways, Lighthouse performance scores are a summation of a number of diagnostics about how your page loads and how it functions. Some of the biggest items are things like:

1. Largest Contentful Paint (LCP) - Measurement of the render time of the largest image or text block visible within the viewport relative to when the page first started loading.
2. First Input Delay (FID) - Measurement of the time when the user first interacts with a page to the time when the browser is actually able to begin processing the response to the interaction.
3. First Contentful Paint (FCP) - Measures when the first point in page load timeline where users can see anything on the screen.
4. Cumulative Layout Shift (CLS) - Hard to define metric, but it quantifies how often users experience unexpected layout shifts.

TL;DR: Load content fast, ensure users can interact with the page, and don't have unexpected layout shifts. What counts as fast for performance? About 1.8 seconds from the time the browser gets the HTML document. Now with this in mind, let's start where I started, looking at the Lighthouse scores for a [live AEM Edge example page](https://main--my-website--lighthouse100.hlx.page/).

### Examining Performance

So the Lighthouse results come in and obviously the performance score is 100. Okay so we're all good then right? Well, let's run some more tests and see what we can find.

Generally one of the first tests I run when inspecting a page for performance after I run Lighthouse is a performance diagnostics test. Open the DevTools and go to Perfomance. Make sure that screenshots are on and run a diagnostic by reloading the page. You should see a number of blocks that make very little sense to you.



