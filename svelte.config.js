import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import { createHighlighter } from 'shiki';

const theme = 'material-theme';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'html', 'css', 'svelte', 'astro', 'jsx', 'bash']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\\\]/).includes('node_modules') ? undefined : true),
		experimental: {
			async: true
		}
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			$posts: 'src/posts'
		},
		experimental: {
			remoteFunctions: true
		}
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
					return `{@html \`${html}\` }`;
				}
			}
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
