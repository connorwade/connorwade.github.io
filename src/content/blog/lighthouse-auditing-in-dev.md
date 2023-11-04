---
title: "Tutorial: Adding Lighthouse to Your Code Base"
description: "How to setup Lighthouse audits within your code that are reusable and versatile."
pubDate: "July 1 2023"
heroImage: "/lighthouse.jpg"
draft: false
---

*The Lighthouse Node API has changed quite a bit since I first wrote this article. Unfortunately, this post probably currently serves as way to see how to do a general integration rather than a new one.*

Lighthouse is a performance testing tool owned by Google for your website. Lighthouse scores have an infamous and well-earned reputation with developers because businesses often over-emphasize the importance of Lighthouse scores on projects. While I 100% agree that Lighthouse is often misused by companies, Lighthouse can provide development teams with valuable insight to optimizing their code base and highlight problems they may not be aware of. Lighthouse can assist with optimizing libraries, optimizing rendering, optimizing assets, ensuring good practice for SEO and ADA, and lots of other little goodies.

To run Lighthouse, the typical process is to go to the page on a chromium based browser and run Lighthouse from the DevTools tray. This is slow and ineffective if you need to audit a lot of pages or need to continuously monitor performance scores for development. In this tutorial, I'm going to show you how to set up a simple Lighthouse audit in your code base that makes things a little more efficient.

For this tutorial, I'm going to be using Vite (frontend tooling that handles bundling), Sveltekit (an SSR framework), and Playwright (a UI testing library). However, this code should work for any project architecture. I will focus on the process and what each tool does and possible replacements for them.

## Project Setup

To start, let's create a new Vite project. I am going to use pnpm, but npm and yarn both work fine. There isn't too much difference in syntax between the three, but you will probably need to look up specific commands still.

```bash
pnpm create vite@latest lighthouse-auditing-project
```

The project will ask you a few questions about setup. To follow along with me select the following options:

1. For project type select Svelte and then Sveltekit
2. Select the demo project for Sveltekit
3. Enable playwright for testing

Any other option doesn't really matter. You can add anything else you'd like. I am using Sveltekit mostly because it comes with a more robust demo than other projects. This makes itso we don't have to create a bunch of pages from scratch to get going with testing. I just want to focus on the integration and not writing client code.

If you're unfamiliar with Vite and Sveltekit, I would recommend running `pnpm dev` just to familiarize yourself with base of the project. It also has a Wordle game in it that's pretty fun. So, go ahead and lose an hour or two playing that.

When you're ready to move on, let's install Lighthouse:

```bash
pnpm add -D lighthouse
```

Once Lighthouse is installed, let's create another directory called "performance":

```bash
mkdir performance
```

We could integrate our performance audit with our unit testing or integration testing if we wanted, but I don't feel like giving Lighthouse performance scores a pass/fail is a good use of time. Use it for auditing, not testing.

Anyways, once you have a performance folder, you'll want to add two more files to it.

```bash
touch lighthouse.js .gitignore
```

For your ".gitignore" file for this directory you will want to add the "results" folder to it.

```
#.gitignore
/results/
```

The lighthouse file is where the magic will really happen.

*Note:* If you're questioning the use of JavaScript over TypeScript, my main reasoning is that Sveltekit comes setup with the "tsconfig" setting to check JavaScript files as well. You get a lot of the TypeScript features without needing to do any compilation step. If you really don't want to use JavaScript, you could add "ts-node" to the project and make this file a TypeScript file. I don't think that's a good use of time or resources, so I'm going to stick with JavaScript

## Writing the initial auditor

In order to run a Lighthouse test from our code, there's a few things we will need to do:

1. Expose a preview of our project build on our localhost.
2. Start a Chromium browser on a port.
3. Use that same port to run a Lighthouse test.

To accomplish that with our current project setup, here's what we need to do:

1. Use `vite build` to build a bundled version of our project.
2. Use `vite preview` to start our bundled project on our localhost.
3. Use Playwright to start a Chromium browser and navigate to the page we want to audit.
	1. If you aren't using Playwright in your project already, I wouldn't recommend adding it just for this.
	2. You could replace Playwright very easily with Puppeteer, chrome-launcher, or any other package that starts a Chromium browser. 
4. Use Lighthouse to test the performance of the page opened with Playwright.

To build our project, for now, let's just use the command line. You can use either `pnpm build` or `vite build`. We won't be changing our project in this tutorial so we won't technically need to add a build step, but I will show to set that up a little better ahead.

Now open "lighthouse.js" and add the following code:

```js
//lighthouse.js
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const resultsDir = './performance/results';
const previewPort = 4173; // Port that your preview is on, might be different for you
const browserPort = 4174; // While unlikely, port may be in use, just select another until one isn't in use. There are better ways to do that, but I'm not going to cover that here.
const baseUrl = `http://localhost:${previewPort}`;

async function performanceAudit() {
	await preview(); // starts the vite preview server. Same as running `vite preview` in the Command Line

    const browser = await chromium.launch({
		args: [`--remote-debugging-port=${browserPort}`] // this ensures our browser starts on a specific port
	}); 

    const path = "/"
    const url = baseUrl + path;
    const page = await browser.newPage();

    await page.goto(url);

    const options = {
        logLevel: 'info',
        output: 'html',
        port: browserPort,
    }
    const runnerResults = await lighthouse(url, options)

    const reportHtml = runnerResult.report

    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir)
    }

	const fileName = path === '/' ? `home` : path.slice(1).replaceAll('/', '-');
	fs.writeFileSync(`${resultsDir}/lighthouse-${fileName}.html`, reportHtml);

	console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
	console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

	await page.close();
    await browser.close()
}

performanceAudit()
```

To run this file, use:

```bash
node performance/lighthouse.js
```

This should create a new file called "lighthouse-home.html" in your "performance/results" directory.

If we want we can also add this to our "package.json" scripts.

```json
...
"scripts": {
    "audit:performance": "node performance/lighthouse.js",
}
...
```

If you wanted to add in the build script before running the performance auditor, you could add a script like:

```json
...
"scripts": {
    "audit:performance": "node performance/lighthouse.js",
    "audit:performance-w-build": "pnpm build && node performance/lighthouse.js"
    -OR-
    "build:audit-performance": "pnpm build && node performance/lighthouse.js"
}
...
```

I prefer to keep the preview in my script, but not every build system allows that like Vite does. You may even need to make a custom node server to serve a local build or use an npm package that serves local files for some frameworks. 

Now you should be able to run the script simply with:

```bash
pnpm audit:performance
```

At this point, we are technically finished. However, I thought I'd include just a few more things that I do for my scripts to make them more usable. After all, we are hard programming our path variable, which is not great since we'd like to be able to audit whatever page we want on the site.

## Setting paths via the command-line

To make our paths more dynamic we're going to use the command line to set them up.

There are packages that make this simpler and more readable, but I'm going to just use raw Node.JS for this tutorial.

I want to create an environment variable so that the user can do something like:

```bash
pnpm audit:performance --path=/about
```

The first thing I'll want to do is check that the user passed this argument when they called the auditor.

I'll add in these lines at the top of the script:

```js
//lighthouse.js
... //dependencies are the same
const pathIndex = process.argv.findIndex((arg) => /^(?:-p|--path)=\/\S*$/.test(arg));
const pathSet = pathIndex > 0;

!pathSet && console.log("No path detected. Setting to default '/'");

const args = {
	path: pathSet ? process.argv[pathIndex].split('=')[1] : '/' //if there is no path set by the user, default to the homepage
};

... // keep other constants the same

async function performanceAudit() {
    await preview();

    const browser = await chromium.launch({
		args: [`--remote-debugging-port=${browserPort}`]
	}); 

    const {path} = args
    const url = baseUrl + path;
    const page = await browser.newPage();

    await page.goto(url);

    const options = {
        logLevel: 'info',
        output: 'html',
        port: browserPort,
    }
    const runnerResults = await lighthouse(url, options)

    const reportHtml = runnerResult.report

    if (!fs.existsSync(resultsDir)) {
        fs.mkdirSync(resultsDir)
    }

	const fileName = path === '/' ? `home` : path.slice(1).replaceAll('/', '-');
	fs.writeFileSync(`${resultsDir}/lighthouse-${fileName}.html`, reportHtml);

	console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
	console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

	await page.close();
    await browser.close()
}

performanceAudit()
```

Now when running the performance auditor, you can use the command-line to set a path.

```bash
pnpm audit:performance -p=/about
'or'
pnpm audit:performance --path=/about
```

This is really good, but there's one thing missing. Often, product teams will want a full report of the site. It'd be very slow to do it this way, so we should probably add a flag to tell our auditor to run Lighthouse against all the pages on the site.

## Auditing all the pages

To audit all the pages, I want the user to be able to use a flag like:

```bash
pnpm audit:performance -a
'or'
pnpm audit:performance --all
```

In order to do this, you will need all the paths from your website. There's a few ways you could do this, but hopefully your team is maintaining some type of sitemap that makes it simple. If not, you may need to use a crawler of some type. Or for projects based on a routing folder like Sveltekit and Next.JS, you could use a filesystem crawl. For this project, I just did it manually since there are only 4 pages. At my work, I would probably use a crawler to build a sitemap if the site were particularly large.

I won't cover how to do this here, but just know there are many solutions you could use to obtain all your site's paths.

Here's how to update the code to handle this:

```js
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { preview } from 'vite';

const pathIndex = process.argv.findIndex((arg) => /^(?:-p|--path)=\/\S*$/.test(arg));
const pathSet = pathIndex > 0;

const allIndex = process.argv.findIndex((arg) => /^(?:-a|--all)$/.test(arg));
const allSet = allIndex > 0;

!pathSet && !allSet && console.log("No path detected. Setting to default '/'");
allSet && console.log('Running against all paths');

const args = {
	path: pathSet ? process.argv[pathIndex].split('=')[1] : '/'
};

const resultsDir = './performance/results';
const previewPort = 4173;
const browserPort = 4174;
const baseUrl = `http://localhost:${previewPort}`;
const allPaths = ['/', '/about', '/sverdle', '/sverdle/how-to-play']; // regardless of how you obtain this, I recommend having these set before starting the test, I personally keep a cache of site endpoints for projects
const paths = allSet ? allPaths : [args.path];

async function performanceAudit() {
	await preview();

	const browser = await chromium.launch({
		args: [`--remote-debugging-port=${browserPort}`]
	});

	for (const path of paths) {
		const url = baseUrl + path;
		const page = await browser.newPage();

		await page.goto(url);

		const options = {
			logLevel: 'info',
			output: 'html',
			port: browserPort
		};
		const runnerResult = await lighthouse(url, options);

		const reportHtml = runnerResult.report;

		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir);
		}

		const fileName = path === '/' ? `home` : path.slice(1).replaceAll('/', '-');
		fs.writeFileSync(`${resultsDir}/lighthouse-${fileName}.html`, reportHtml);

		console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
		console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

		await page.close();
	}

	await browser.close();
}

performanceAudit();
```

Now the test should run against all of your site in one go by testing one page after another.

## Testing Device Screens

At times, it may be necessary to test performance on certain screen sizes. To do this, we can use chromium's device emulator. We also can add it to our flags when running the auditor. Here's how I modified the code to handle this:

```js
import fs from 'node:fs';
import lighthouse from 'lighthouse';
import { chromium, devices } from '@playwright/test'; // Update the dependencies with our new devices
import { preview } from 'vite';

const pathIndex = process.argv.findIndex((arg) => /^(?:-p|--path)=\/\S*$/.test(arg));
const pathSet = pathIndex > 0;

const allIndex = process.argv.findIndex((arg) => /^(?:-a|--all)$/.test(arg));
const allSet = allIndex > 0;

const deviceIndex = process.argv.findIndex((arg) => /^(?:-d|--device)$/.test(arg));
const deviceSet =
	deviceIndex > 0 &&
	Object.keys(devices).includes(process.argv[pathIndex].split('=')[1].replace('"', ''));
	// Check that the user added a device argument, but also that the argument is valid

!pathSet && !allSet && console.log("No path detected. Setting to default '/'");
!deviceSet && console.log('Device not set - running against Desktop Chrome');
allSet && console.log('Running against all paths');

const args = {
	path: pathSet ? process.argv[pathIndex].split('=')[1] : '/',
	device: deviceSet ? process.argv[pathIndex].split('=')[1].replace('"', '') : 'Desktop Chrome'
};

const resultsDir = './performance/results';
const previewPort = 4173;
const browserPort = 4174;
const baseUrl = `http://localhost:${previewPort}`;
const allPaths = ['/', '/about', '/sverdle', '/sverdle/how-to-play'];
const paths = allSet ? allPaths : [args.path];

async function performanceAudit() {
	await preview();

	const browser = await chromium.launch({
		args: [`--remote-debugging-port=${browserPort}`]
	});

	const context = await browser.newContext(devices[args.device]);

	for (const path of paths) {
		const url = baseUrl + path;
		const page = await context.newPage();

		await page.goto(url);

		const options = {
			logLevel: 'info',
			output: 'html',
			port: browserPort
		};
		const runnerResult = await lighthouse(url, options);

		const reportHtml = runnerResult.report;

		if (!fs.existsSync(resultsDir)) {
			fs.mkdirSync(resultsDir);
		}

		const fileName = path === '/' ? `home` : path.slice(1).replaceAll('/', '-');
		fs.writeFileSync(`${resultsDir}/lighthouse-${fileName}-${args.device}.html`, reportHtml); // Update the fileName variable so that it includes the devices

		console.log('Report is done for', runnerResult.lhr.finalDisplayedUrl);
		console.log('Performance score was', runnerResult.lhr.categories.performance.score * 100);

		await page.close();
	}

	await context.close();
	await browser.close();
}

performanceAudit();
```

Now you should be able to run performance audits against device screens using this command:

```bash
pnpm audit:performance --device="iPhone 11"
'or'
pnpm audit:performance --d="iPhone 11"
```

This will emulate the iPhone 11 screen in chromium and run Lighthouse against it.

## Closing thoughts

While I have just shown you how to integrate Lighthouse auditing into your project, using Lighthouse to monitor your websites is a double-edged sword. Some project owners get a little too hung up on the numbers instead of understanding what the numbers mean and the why's behind them. Having bad scores is not necessarily a bad thing, but it should alert the engineering team to issues that could be creeping into the code base.

Now with that being said, how could you use this? For smaller teams, it might make sense for the lead engineer or architect to take regular audits of site and pages to ensure that performance is not degrading as new features are added (or if there is degradation, it is explainable and necessary). On a large team, you may want full integration with husky and a reporting tool that monitors performance as commits are made to the project. 

Whatever you do, just promise me you won't abuse my tutorial to make passing performance scores necessary for committing code. By reading my blog you are agreeing to use it responsibly. If that line works for privacy notices, it also must work here, right?