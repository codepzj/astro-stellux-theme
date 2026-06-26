export type BlogEntryData = {
  title: string
  description?: string
  pubDate: Date
  updatedDate?: Date
  category?: string
  tags?: string[]
  thumbnail?: string
  isTop?: boolean
  draft?: boolean
  slug?: string
}

export type BlogEntryLike = {
  id: string
  slug?: string
  body?: string
  data: BlogEntryData
}

export type BlogSearchItem = {
  title: string
  description: string
  url: string
  category: string
  tags: string[]
  thumbnail?: string
  text: string
}

export const BLOG_PAGE_SIZE = 10

export function filterVisiblePosts<T extends BlogEntryLike>(posts: T[], isProduction: boolean): T[] {
  if (!isProduction) return posts
  return posts.filter((post) => !post.data.draft)
}

export function sortBlogPosts<T extends BlogEntryLike>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    const topDelta = Number(Boolean(b.data.isTop)) - Number(Boolean(a.data.isTop))
    if (topDelta !== 0) return topDelta
    return b.data.pubDate.getTime() - a.data.pubDate.getTime()
  })
}

export function getBlogSlug(post: BlogEntryLike): string {
  return (post.data.slug || post.slug || post.id).replace(/\.mdx?$/, '').replace(/^\/+|\/+$/g, '')
}

export function getPostUrl(post: BlogEntryLike): string {
  return `/blog/${getBlogSlug(post)}`
}

export function toSearchIndex(posts: BlogEntryLike[]): BlogSearchItem[] {
  return posts.map((post) => {
    const tags = post.data.tags ?? []
    const description = post.data.description ?? ''
    const category = post.data.category ?? ''
    const fields = [post.data.title, description, category, ...tags, post.body ?? '']

    return {
      title: post.data.title,
      description,
      url: getPostUrl(post),
      category,
      tags,
      thumbnail: post.data.thumbnail,
      text: fields.filter(Boolean).join(' '),
    }
  })
}

export function getPaginationWindow(totalPage: number, currentPage: number, maxVisible = 5): number[] {
  if (totalPage <= 0) return []
  if (totalPage <= maxVisible) {
    return Array.from({ length: totalPage }, (_, index) => index + 1)
  }

  const cap = Math.min(maxVisible, totalPage)
  const half = Math.floor(cap / 2)
  let start = currentPage - half
  let end = start + cap - 1

  if (start < 1) {
    start = 1
    end = cap
  }

  if (end > totalPage) {
    end = totalPage
    start = totalPage - cap + 1
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}
