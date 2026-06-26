import { BLOG_CONFIG } from './blog-config'

const stelluxConfig = BLOG_CONFIG.stellux

export const SITE = {
  title: stelluxConfig.title,
  description: stelluxConfig.description,
  author: stelluxConfig.author,
  url: stelluxConfig.url,
  repoUrl: stelluxConfig.repoUrl,
  avatar: stelluxConfig.avatar,
}

export const SITE_NAV_LINKS = stelluxConfig.navLinks

export const SITE_CONTENT_MAX_CLASS = 'max-w-3xl'
export const BLOG_CONTENT_MAX_CLASS = SITE_CONTENT_MAX_CLASS

export function isSiteNavActive(pathname: string, href: string): boolean {
  const currentPath = pathname.split('/')[1] || '/'
  return currentPath === href.split('/')[1] || (currentPath === '/' && href === '/')
}
