import * as z from 'zod';

export const zPostFrontmatter = z.object({
	title: z.string(),
	description: z.string(),
	pubDate: z.string().transform((str) => new Date(str)),
	draft: z.boolean().optional(),
	tags: z.array(z.string()).optional()
});

export const zPostMetadata = zPostFrontmatter.extend({ slug: z.string() });

export type PostMetadata = z.infer<typeof zPostMetadata>;
export type PostFrontmatter = z.infer<typeof zPostFrontmatter>;
