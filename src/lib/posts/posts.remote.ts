import { prerender } from '$app/server';
import { z } from 'zod';
import { error } from '@sveltejs/kit';
import { fetchPostsMetadata } from './posts';
import { getPost } from '.';

export const getPostsMetadata = prerender(async () => {
	return fetchPostsMetadata();
});

export const queryPost = prerender(z.string(), async (slug: string) => {
	const post = await getPost(slug);
	if (!post) {
		error(404, `Post not found: ${slug}`);
	}

	return post;
});
