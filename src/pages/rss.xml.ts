import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { filterVisiblePosts, getPostUrl, sortBlogPosts } from '@/lib/blog'
import { SITE } from '@/lib/site'

export async function GET(context: APIContext) {
  const posts = sortBlogPosts(filterVisiblePosts(await getCollection('blog'), true))

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site?.toString() ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostUrl(post),
    })),
  })
}
