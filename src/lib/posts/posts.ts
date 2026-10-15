import { z } from 'zod';
import { error } from '@sveltejs/kit';
import { zPostMetadata, type PostMetadata } from './types';

export const enhancedImages = import.meta.glob('$lib/assets/**/*.{jpg,jpeg,png,webp,avif}', {
	query: { enhanced: true },
	import: 'default'
});

export const resolveHeroImageModule = async (heroPath?: string) => {
	if (!heroPath) return undefined;

	const cleanSubpath = heroPath
		.replace(/^(\.\.\/)+assets\//, '')
		.replace(/^\/?src\/lib\/assets\//, '')
		.replace(/^\/?lib\/assets\//, '')
		.replace(/^\$lib\/assets\//, '')
		.replace(/^\//, '');

	for (const [key, resolver] of Object.entries(enhancedImages)) {
		if (key.endsWith(cleanSubpath)) {
			const mod = await resolver();
			return mod;
		}
	}

	return undefined;
};

export const fetchPostsMetadata = async (): Promise<PostMetadata[]> => {
	const rawPosts = await Promise.all(
		Object.entries(
			import.meta.glob<{ metadata: unknown }>('$posts/*.{md,svx}', { eager: true })
		).map(async ([path, post]) => {
			const slug =
				path
					.split('/')
					.pop()
					?.replace(/\.(md|svx)$/, '') ?? '';
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return { ...((post as any)?.metadata ?? {}), slug };
		})
	);

	const result = await z.array(zPostMetadata).safeParseAsync(rawPosts);
	if (!result.success) {
		console.error(`Error parsing posts:`, result.error);
		error(500, `Error parsing posts`);
	}

	return result.data.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
};
