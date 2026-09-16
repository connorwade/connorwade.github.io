import { getPostsMetadata } from '$lib/posts';

export const load = async () => {
	const posts = await getPostsMetadata();
	return {
		title: 'Blog',
		posts
	};
};
