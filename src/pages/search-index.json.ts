import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { filterVisiblePosts, sortBlogPosts, toSearchIndex } from '@/lib/blog'

export async function GET(_context: APIContext) {
  const posts = sortBlogPosts(filterVisiblePosts(await getCollection('blog'), true))

  return new Response(JSON.stringify(toSearchIndex(posts)), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
}
