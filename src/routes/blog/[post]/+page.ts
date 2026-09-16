import { getPost, fetchPostsMetadata } from '$lib/posts';
import { error } from '@sveltejs/kit';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = async () => {
	const posts = await fetchPostsMetadata();
	return posts.map((post) => ({ post: post.slug }));
};

export const load = async ({ params }) => {
	try {
		const post = await getPost(params.post);
		return {
			metadata: post.metadata,
			PostContent: post.PostContent,
			title: post.metadata.title
		};
	} catch (err) {
		error(404, err instanceof Error ? err.message : String(err));
	}
};
