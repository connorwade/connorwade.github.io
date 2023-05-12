import { getCollection } from "astro:content";

export async function getBlogs() {
  const posts = (await getCollection("blog"))
    .filter((blog) => !blog.data.draft)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  return posts;
}
