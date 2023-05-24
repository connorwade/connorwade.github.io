import { CollectionEntry, getCollection } from "astro:content";

export async function getBlogs() {
  const posts = (await getCollection("blog"))
    .filter((blog) => !blog.data.draft)
    .sort((a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf());
  return posts;
}

export function sortBlogs(collection: CollectionEntry<"blog">[]) {
  const posts = collection.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
  return posts;
}
