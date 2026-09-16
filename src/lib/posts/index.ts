import type { Component } from 'svelte';
import { zPostFrontmatter } from './types';

export * from './posts';
export * from './posts.remote';
export * from './types';

export const getPost = async (slug: string) => {
	const raw: {
		default: unknown;
		metadata: unknown;
	} = await import(`$posts/${slug}.md`);

	let result;
	try {
		result = await zPostFrontmatter.parseAsync(raw.metadata);
	} catch (err) {
		console.error(`Error parsing post ${slug}:`, err instanceof Error ? err.message : String(err));
		throw new Error(`Error parsing post ${slug}`, { cause: err });
	}

	return {
		metadata: result,
		PostContent: raw.default as Component
	};
};
