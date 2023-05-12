---
title: 'Creating My New Blog From "Scratch" in a Few Hours'
description: "How I used Astro and TailwindCSS to build a responsible, performant, bleeding-edge website in a few hours"
pubDate: "May 09 2023"
heroImage: "/placeholder-hero.jpg"
---

Well, I've finally done what I've threatened to do for a while: I've replaced my old blog. And more importantly, I did it in less than 24 hours and with only a few hours of work. In this post, I want to go over what tools I used to do it and how I did it. There's nothing groundbreaking in this post. I just wanted to share how easy things can be in Web Development with the proper setup.

## Choosing My Stack

First and foremost, I knew I wanted my blog to be a Multi-Page app. A Multi-Page app is one where the HTML files are created before the website is deployed. These sites only use a server to deliver the content. This was important to me for two reasons:

1. I could deploy the site basically anywhere. Most web-hosting services offer free static-site hosting as long as you aren't making money or driving lots of traffic.
2. I didn't require the benefits of a Server-Side Rendered (SSR) app or Client-Side Rendered (CSR) app. Both of these rendering choices are great generally for websites, but I don't need content to be personalized or to perform actions with a server like with SSR. I also don't need users to download my entire blog just so they can read a singular post they care about (CSR).

This means I would need to stick with a framework that allowed me to create a static website. So that narrowed my choices down to a couple frameworks:

1. Sveltekit
2. Next.JS
3. Hugo
4. Gatsby
5. Astro

#### Sveltekit and Next.JS

Sveltekit was a very tempting choice. I love Svelte and believe it can truely do it all. I have drunk the Rich Harris Kool-aid and am eager to see where the framework goes. However, as much as I love Sveltekit, using it to just build a blog would mean bringing on a lot of technical overhead without a lot of upsides. Sveltekit is brilliant for creating apps, but if you just want to push content, it isn't your best choice. In that same vein, Next.JS is also better suited for apps than websites focusing on content first.

#### Hugo

Hugo is great. My old blog was built on Hugo. However, that is exactly why I didn't want to build on Hugo again. My old Hugo blog used a community template to create the outline, but it included so many things that I just didn't care about. Refactoring all of that would've taken ages honestly. There's just too much technical debt working with Hugo. I wanted something sleeker.

#### Gatsby

Gatsby isn't a real choice as far as I'm concerned, but I wanted to include it for anyone who asks why I didn't use Gatsby. Gatsby isn't bad per say. My biggest issue with it is using Graphql to manage the data layer. It is a lot of overhead for something that should be easy. More importantly Graphql just wasn't made to do that. It's an impressive hack, but it doesn't feel good to use as a developer.

#### Astro

I had heard a lot about Astro recently and was pretty excited about it. For those not in the know, Astro is a frontend framework that is focused on delivering content rather than applications. Given that my job is all about building content driven websites, I wanted to learn more about it anyways. Well, after reading through [Astro's documentation](https://docs.astro.build/en/getting-started/), I was sold. Some of the features that Astro sold me on:

1. No shipped JavaScript - I don't think that "no JavaScript" should be the objective for most sites, but I do think it should be for certain sites. A singular person's blog shouldn't require tons of resources in order to work.
2. A pleasurable development experience - Astro has a really great modern development flow and a great markup language. It has type safety, performance, and supports all the modern third-party libraries you would expect it to.
3. The ability to extend it in the future - Astro can integrate with Svelte and other frontend frameworks if I ever feel like I want to start adding in client-side rendering for whatever reason.
4. Markdown support out of the box - I configured nothing to get my markdown to work for writing blog pages. It just works.

Astro sped up my development experience by just being great and easy-to-use out of the box. However, one thing was missing, styling.

#### Styling

I am on record saying that if you are a developer and not a designer, you should always use a component library to build your site. Well, in this case, I practiced what I preach. For the style of the site, I used TailwindCSS with DaisyUI. To create the markdown content style, I used TailwindCSS Typography.

While I am not a huge fan of utility classes, I do like that Tailwind gives me access to a library of standard CSS styles I can pick from fast. DaisyUI extends that by giving me a prebuilt design system that lets me focus on developing rather than worrying too much about design. However, one thing I also like about Tailwind and Daisy is that they just give enough to handle things on my own. I still created the style of the site, it just was within a set of standards.

Now I had everything I would need to create a great site: a framework to build my site and a framework to style my site. All that was left to do was implement it.

## The Implementation

If you aren't interested in coding, you can skip this section.

I boast a lot about being a good coder while being stuck in an engineering management position that either sees me doing low-code to no code tasks on the daily. So any chance I get to finally flex what I'm doing, I take it.

First, I had to decide what parts of my blog are important to me and what I needed to launch it. I looked at my old site and made a note of what components and styles I wanted to bring over.

* The simple header with my name as the home link, and a button for switching between dark and light themes. I didn't really care about the navigation items that my old blog had, they were just included with the template I was using. I may bring them back in the future, but for now, I'm fine with not having them.
* The intro section to myself with social media links on the home page.
* The blog cards on the front page for displaying post previews.
* The post pages themselves.

In reality, one of the ways that I created a website so quickly was that I instantly set out what my requirements were and knew that I had all the expertise I would need to get there. I also made compromises on what exactly I would be willing to put out in the world.

#### Base Layout

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

There's nothing fancy at all to it. My "BaseHead" component is a standard one from Astro with slight modifications for my site. The "Footer" component likewise is just a copyright notice so that maybe one day AI's will acknowledge me for the content they steal and reproduce from me.* 

#### Header Component

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

Then I have a button for toggling the theme of my website between dark and light. To be honest, DaisyUI recommends using an npm package for handling this, but after checking the package out on Github, I didn't see any reason I could just write a few lines and capture all of its functionality locally. 

First, we check if the user has set a theme on the website before. We store this in the localStorage of their browser. This supersedes a user's system preference because we assume they "opt-in" to whichever theme they picked. (Or in reality, they acted like QA engineers switching the theme a dozen times just to be sure it really works.) If we don't find any theme preference in local storage, we check the system preference and set the theme accordingly.

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

Explaining how Zog works is not really in the scope of this blog post. Maybe there will be one in the future. For now, you can just read the documentation on [Zog](https://github.com/colinhacks/zod).

Anyways, with this setup I now had some blogs to test on.

#### Routing

Routing in Astro is just as easy as any modern fullstack framework. Directories are paths and files within them represent the pages. All I would need is a home page, a blog page, and post pages. So my directory just looked like this:

```
    Pages ->
    |  blog ->
    |  |    index.astro
    |  |    [...slug].astro
    |  index.astro
```

The more interesting question is how do you create pages from content in Astro? That's what the "[...slug]" is for. By using that, I can tell Astro, "I want to create some pages from some data". So in that file, I just added the following code:

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

If you are used to Next.JS or SvelteKit, this pattern shouldn't look too unusual to you. You use the "getStaticPaths" hook to create pages and props from your content. It's as simple as creating components, but now just on a router level rather than a DOM level.

### Blog Posts Pages

For the blog posts pages themselves, I decided to create a layout that would nest within the base layout. Now, whether that should really be considered a layout of its own is up for debate. I guess it probably should really be more of a component. However, I saw it as providing a scaffold for a page, so I went with a layout. When you're an engineering team of one, sometimes you can get away with bad semantics without someone starting a fight over it.

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

This is the very page that you are looking at. Instead of dealing with styling, notice that I just used TailwindCSS Typography with the "prose" class to handle the markdown. I couldn't be bothered to handle the styling, so I didn't. Massive amount of time saved, and I personally think it looks... adequate.

## Deployment

Deployment was the easiest part of this whole process. I just followed Astro's [guide on deploying to github pages](https://docs.astro.build/en/guides/deploy/github/). The guide was simple and included everything I needed to know. And most importantly, it actually worked without hacking. It's always great to work with documentation that is being updated and cared about. 

## Outcomes

So far, my new blog has a nearly perfect score in Google Lighthouse. There's some issues with accessibility regarding my color choices, but that's because I'm basically a chimpanzee who can't even use a provided color theme properly. I will fix it in the future.

While I don't think Lighthouse should be used as a scorecard like it currently is by many businesses, I think engineers should use it to diagnose problems on their website. In this case, I had very little to diagnose. That's the advantage of not shipping JavaScript for a simple content page.

So far, my new site has also got me writing better and faster than before because there is a more immediate feedback loop than there was with Hugo. The content management feels very fluid.

## Key Takeaways

One of my goals this year for programming has been to create things faster and finish more projects. So far I'm doing terribly at that, but this project has really revitalized me by showing me it can be done. I think the big things to take away from experiment are:

1. Choose tools that are well suited to your goals.
2. Rely on the work of others for the things you don't care about.
3. Coming up with a strategy to execute will speed up your development a lot.
4. Accomplish the minimum viable specs and call it a day - things can always be upgraded later.

Hopefully, I've demonstrated how I went about creating this blog and shown how easy it is to do so for yourself. I really encourage you if you think you have something to share with people to give it a try. Start by stealing my code if you want. Just be sure to message me to show me how it turned out afterwards. I look forward to reading your posts next.

\* While this article was written by a human, it was assisted by ChatGPT. I gave it the article and asked for suggestions on grammar and prose. And it told me how to turn it into an email.