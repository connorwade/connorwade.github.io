import type { Component } from 'svelte';
import { zPostFrontmatter } from './types';
import { resolveHeroImageModule } from './posts';

export * from './posts';
export * from './posts.remote';
export * from './types';

export const getPost = async (slug: string) => {
	const modules = import.meta.glob<{
		default: Component;
		metadata: unknown;
	}>('$posts/*.{md,svx}');

	const matchingPath = Object.keys(modules).find((path) => {
		const fileSlug = path
			.split('/')
			.pop()
			?.replace(/\.(md|svx)$/, '');
		return fileSlug === slug;
	});

	if (!matchingPath || !modules[matchingPath]) {
		throw new Error(`Post not found: ${slug}`);
	}

	const raw = await modules[matchingPath]();

	let result;
	try {
		result = await zPostFrontmatter.parseAsync(raw.metadata);
	} catch (err) {
		console.error(`Error parsing post ${slug}:`, err instanceof Error ? err.message : String(err));
		throw new Error(`Error parsing post ${slug}`, { cause: err });
	}

	const heroImageModule = result.heroImage
		? await resolveHeroImageModule(result.heroImage)
		: undefined;

	return {
		metadata: result,
		PostContent: raw.default,
		heroImageModule
	};
};
