import { BLOG_CONFIG, type GiscusConfig } from './blog-config'

export const GISCUS_CONFIG = BLOG_CONFIG.comments.giscus

export function isGiscusCommentsEnabled(giscus: GiscusConfig = GISCUS_CONFIG): boolean {
  return (
    giscus.enabled &&
    Boolean(giscus.repo && giscus.repoId && giscus.category && giscus.categoryId)
  )
}

export const GISCUS_COMMENTS_ENABLED = isGiscusCommentsEnabled()
