---
title: 'Creating My New Blog From "Scratch" in a Few Hours'
description: "How I used Astro and TailwindCSS to build a responsible, performant, bleeding-edge website in a few hours"
pubDate: "May 09 2023"
heroImage: "/placeholder-hero.jpg"
---

Well, I've finally have done what I've threatened to do for a while: I've replaced my old blog. And more importantly, I did it in less than 24 hours and with only a few hours of work.

## Choosing My Stack

First and foremost, I knew I wanted my blog to be a Multi-Page app. This means I would need to stick with a framework that allowed me to create a static website. There is really no upside to going with the multitude of Server-Side Rendering or Client-Side Rendering for a blog. I have no desire to keep anyone's attention with my blog or to drive sales. My blog only serves two purposes: 

1. For me to put thoughts that might be useful out there for anyone to read
2. To give myself a live-site that I am free to run experiments on

The frameworks that can build static sites are:

1. Sveltekit
2. Next.JS
3. Hugo
4. Gatsby
5. Astro

I immediately eliminated Next.JS and Gatsby because I am not the biggest fan of React. I respect it and I use it, but it isn't my cup of tea if I'm making something for myself. Sveltekit was very tempting. However, as much as I love Sveltekit, using it to just build a blog would mean bringing on a lot of technical overhead without a lot of upsides. Sveltekit is brilliant for creating apps, but if you just want to drive content, it isn't your best choice. (Next.JS has the same problems, I just don't like it as much.)

Hugo is great. My old blog was built on Hugo. However, that is exactly why I didn't want to build on Hugo again. My old Hugo blog used a community template to create the outline, but it included so many things that I just didn't care about. Refactoring all of that would've taken ages honestly. There's just too much technical debt working with Hugo. I wanted something better.

I had heard a lot about Astro recently and was pretty excited about it. For those not in the know, Astro is a frontend framework that is focused on delivering content rather than applications. Given that my job is all about building content driven websites, I wanted to learn more about it anyways. Well, after reading through Astro's documentation, I was sold. Some of the features that Astro sold me on:

1. No shipped JavaScript - I don't think that "no JavaScript" should be the objective for most sites, but I do think it should be for certain sites. A singular person's blog shouldn't require tons of resources in order to work.
2. A pleasurable development experience - Astro has a really great modern development flow and a great markup language. It has type safety, performance, and supports all the modern third-party libraries you would expect it to.
3. The ability to extend it in the future - Astro can integrate with Svelte and other frontend frameworks if I ever feel like I want to start adding in client-side rendering for whatever reason.
4. Markdown support out of the box - I configured nothing to get Markdown to work. It just works.

Astro sped up my development experience by just being great and easy-to-use out of the box. However, one thing was missing, styling.

I am on record saying that if you are a developer and not a designer, you should always use a component library to build your site. Well, in this case, I practiced what I preach. For the style of the site, I used TailwindCSS with DaisyUI. To create the markdown content style, I used TailwindCSS Typography.

While I am not a huge fan of utility classes, I do like that Tailwind gives me access to a library of standard CSS styles I can pick from fast. DaisyUI extends that by giving my component styles that let me create a website fast.

Now I had everything I would need to create a great site: a framework to build my site and a framework to style my site. All that was left to do was implement it.

## The Implementation

If you aren't interested in coding, you can skip this section.

I boast a lot about being a good coder while being stuck in an engineering management position that either sees me doing low-code to no code tasks on the daily. So any chance I get to finally flex what I'm doing, I take it.

First, I had to decide what parts of my blog are important to me and what I needed to launch it. I looked at my old site and made a note of what components and styles I wanted bring over.

* The simple header with my name as the home link, and a button for switching between dark and light themes. I didn't really care about the navigation items that my old blog had, they were just included with the template I was using. I may bring them back in the future, but for now, I'm fine with not having them.
* The intro section to myself with social media links on the home page.
* The blog cards on the front page for displaying post previews.
* The post pages themselves.

In reality, one of the ways that I created a website so quickly was that I instantly set out what my requirements were and new that I had all the expertise I would need to get there. I also made comprimises on what exactly I would be willing to put out in the world.

The first task to do before anything else, was to create a base layout for the entire site. In this layout I would include the head tag, the header component, the footer component, and a slot for the content of each page.

```js
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>
    <BaseHead title={title} description={description} />
  </head>
  <body>
    <Header title={SITE_TITLE} />
    <slot />
    <Footer />
    
  </body>
</html>
```

There's nothing fancy at all to it. My "BaseHead" component is a standard one from Astro with slight modifications for my site. The "Footer" component likewise is just a copywrite notice so that maybe one day AI's will acknowledge me for the content they steal and reproduce from me. 

The Header component is a little more interesting.

```js
<header class="navbar bg-base-300 px-8">
  <div class="navbar-start">
    <a href="/"
      ><h2 class="text-2xl font-extrabold hover:text-accent-content">
        {SITE_TITLE}
      </h2></a
    >
  </div>

  <div class="navbar-end">
    <NavMenu links={HEADER_LINKS} />
    <div class="switch-container border-l pl-3 border-neutral-content">
      <button
        class="btn btn-circle btn-outline btn-sm"
        type="button"
        id="theme-switch"
        title="Dark/Light Mode Switch"
      >
        <Icon icon="sun" />
      </button>
    </div>
  </div>
</header>

<script>
  let theme = "light";
  let htmlEl = document.querySelector("html");

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme:dark)").matches)
  ) {
    htmlEl.dataset.theme = "dark";
    theme = "dark";
  } else {
    htmlEl.dataset.theme = "light";
    theme = "light";
  }
  function handleThemeSwitch() {
    theme = theme === "light" ? "dark" : "light";
    htmlEl.dataset.theme = theme;
    localStorage.theme = theme;
  }

  document
    .getElementById("theme-switch")
    .addEventListener("click", handleThemeSwitch);
</script>

```

So, what is going on here? Well, a little bit. It's wordier than it is complicated. For the header, I used DaisyUI's "navbar" component style. That got us off to a great start. While I have no navigation menu, I do have a component for it that will render a menu if I add items to it. In the future, I might do that, but for now, I see no reason.

Then I have a button for toggling the theme of my website between dark and light. To be honest, DaisyUI recommends using an npm package for handling this, but I after checking the package out on Github, I didn't see any reason I could just write a few lines and capture all of its functionality locally. 

First, we check if the user has set a theme on the website before. We store this in the localStorage of their browser. This supercedes a user's system preference because we assume they "opt-in" to whichever theme they picked. (Or in reality, they acted like QA engineers switching the theme a dozen times just to be sure it really works.) If we don't find any theme preference in local storage, we check the system preference and set the theme accordingly.

```js
if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme:dark)").matches)
  ) {
    htmlEl.dataset.theme = "dark";
    theme = "dark";
  } else {
    htmlEl.dataset.theme = "light";
    theme = "light";
  }
```

Handling the switch was actually harder than it really should've been but only because my brain is so used to frontend frameworks reactive state management that I can no longer handle simple JavaScript state. And by harder, I mean it took me an extra 10 minutes because I attempted to write it the Svelte way first and realized that wouldn't work.

```js
function handleThemeSwitch() {
    theme = theme === "light" ? "dark" : "light";
    htmlEl.dataset.theme = theme;
    localStorage.theme = theme;
  }

  document
    .getElementById("theme-switch")
    .addEventListener("click", handleThemeSwitch);
```

In reality, I ended up using a pattern that was just backwards from reactivity. Instead of managing a single state variable that changes several properties of elements, I set the state variable and then assigned the several properties to it.

Now I had a layout that was reusable for all my pages.

Next, I needed content for a blog. Luckily, Astro has a built-in feature for handling content. All you do is create a content directory, create a "config.ts" file, and then create a directory for your new content collection. The "config.ts" file uses Zog to create a schema to export to the rest of your app. Here's what mine currently looks like:

```js
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		heroImage: z.string().optional(),
	}),
});

export const collections = { blog };
```

I don't feel like explaining how Zog works is in the scope of this blog post. Maybe there will be one in the future. For now, you can just read the documentation on Zog.

Anyways, with this setup I now had some blogs to test on.

### Routing

Routing in Astro is just as easy as any modern fullstack framework. Directories are paths and files within them represent the pages. All I would need is a home page, a blog page, and post pages. So my directory just looked like this:

```
    Pages ->
    |  blog ->
    |  |    index.astro
    |  |    [...slug].astro
    |  index.astro
```

The more interesting question is how do you create pages from content in Astro?

```js
---
import { CollectionEntry, getCollection } from "astro:content";
import BlogPost from "../../layouts/BlogPost.astro";

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: post,
  }));
}
type Props = CollectionEntry<"blog">;

const post = Astro.props;
const { Content } = await post.render();
---

<BlogPost {...post.data}>
  <Content />
</BlogPost>
```

If you are used to Next.JS or SvelteKit, this pattern shouldn't look too unusual to you. You use the "getStaticPaths" hook to create pages and props from your content.

### Blog Posts Pages

For the blog posts pages themselves, I decided to create a layout that would nest within the base layout. Now, whether that should really be considered a layout of its own is up for debate. I guess it probably should really be more of a component, however, I saw it as providing a scaffold for a page, so I went with layout. When you're an engineering team of one, sometimes you can get actually get away with sementics without someone starting a fight over it.

```js
---
import type { CollectionEntry } from "astro:content";
import BaseHead from "../components/BaseHead.astro";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import FormattedDate from "../components/FormattedDate.astro";
import BaseLayout from "./BaseLayout.astro";

type Props = CollectionEntry<"blog">["data"];

const { title, description, pubDate, updatedDate, heroImage } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <main class="flex justify-center">
    <article class="prose lg:prose-lg p-8">
      {heroImage && <img width={720} height={360} src={heroImage} alt="" />}
      <h1>{title}</h1>
      <FormattedDate date={pubDate} />
      {
        updatedDate && (
          <div class="last-updated-on">
            Last updated on <FormattedDate date={updatedDate} />
          </div>
        )
      }
      <hr />
      <slot />
    </article>
  </main>
</BaseLayout>
```

This is the very page that you are looking at. Instead of dealing with styling, notice that I just used TailwindCSS Typography with the "prose" class to handle the markdown. I couldn't be bothered to handle the styling, so I didn't. Massive amount of time saved, and I personally think it looks, adequate.

## Outcomes

So far, my new blog has a nearly perfect score in Google Lighthouse. There's some issues with accessibility regarding my color choices, but that's because I'm an orangutan who can't even use a provided color theme properly. I will fix it in the future.

While I don't think Lighthouse should be used as a scorecard like it currently is by businesses, I think engineers should be using it to diagnose problems on their website. However, I don't get any problems back, therefore, I am not going to worry about performance.

So far, my new site has also got me writing better and faster than before because there is a more immediate feedback loop than there was with Hugo. The content management feels very fluid.

## Key Takeaways

One of my goals this year for programming has been to create things faster and finish more projects. So far I'm doing terribly at that, but this project has really revitalized me by showing me it can be done. I think the big things to take away from experiment are:

1. Choose tools that are well suited to your goals. If you want to ship a minimalistic, content-driven site, just slap together Astro and Tailwind. If you want an app, use Sveltekit or Next.JS.
2. Rely on the work of others for the things you don't care about. Using a CSS theme makes your life simple while regulating something quite difficult to someone else.
3. Coming up with a strategy to execute will speed up your experience a lot.