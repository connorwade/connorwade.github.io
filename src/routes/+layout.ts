export const prerender = true;
export const csr = true;

const SITE_DESCRIPTION = 'A blog about coding, technology, and software development.';

export const load = async ({ url }) => {
	return {
		path: url.pathname,
		siteDescription: SITE_DESCRIPTION
	};
};
