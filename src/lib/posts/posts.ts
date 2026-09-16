import { z } from 'zod';
import { error } from '@sveltejs/kit';
import { zPostMetadata, type PostMetadata } from './types';

export const fetchPostsMetadata = async (): Promise<PostMetadata[]> => {
	const rawPosts = await Promise.all(
		Object.entries(import.meta.glob('$posts/*.{md,svx}', { eager: true })).map(
			async ([path, post]: [string, unknown]) => {
				const slug =
					path
						.split('/')
						.pop()
						?.replace(/.(md|svx)$/, '') ?? '';
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return { ...((post as any)?.metadata ?? {}), slug };
			}
		)
	);

	const result = await z.array(zPostMetadata).safeParseAsync(rawPosts);
	if (!result.success) {
		console.error(`Error parsing posts:`, result.error);
		error(500, `Error parsing posts`);
	}

	return result.data.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
};
