import { readFileSync } from 'node:fs'
import path from 'node:path'

import { parse, stringify } from 'yaml'

import type { Friend } from './friends'

export type SiteNavLink = {
  href: string
  label: string
}

export type FriendTypeConfig = {
  value: number
  label: string
  description: string
}

export type FriendsPageConfig = {
  title: string
  eyebrow: string
  description: string
  emptyTitle: string
  emptyDescription: string
  exchangeTitle: string
  exchangeDescription: string
} & Record<string, unknown>

export type StelluxConfig = {
  title: string
  url: string
  description: string
  author: string
  avatar: string
  repoUrl: string
  locale: string
  htmlLang: string
  navLinks: SiteNavLink[]
} & Record<string, unknown>

export type BlogConfig = {
  stellux: StelluxConfig
  friendTypes: FriendTypeConfig[]
  friendsPage: FriendsPageConfig
  friends: Friend[]
} & Record<string, unknown>

export const DEFAULT_BLOG_CONFIG: BlogConfig = {
  stellux: {
    title: 'Stellux Blog',
    url: 'http://localhost:4321',
    description: 'A static Astro blog.',
    author: 'Stellux',
    avatar: '/avatar.jpg',
    repoUrl: '',
    locale: 'zh-CN',
    htmlLang: 'zh-CN',
    navLinks: [
      { href: '/blog', label: 'Posts' },
      { href: '/document', label: 'Docs' },
      { href: '/friends', label: 'Friends' },
    ],
  },
  friendTypes: [
    { value: 0, label: 'Type 0', description: 'Websites grouped as type 0.' },
    { value: 1, label: 'Type 1', description: 'Websites grouped as type 1.' },
    { value: 2, label: 'Type 2', description: 'Websites grouped as type 2.' },
  ],
  friendsPage: {
    title: 'Friends',
    eyebrow: 'Friends',
    description: 'Links to other websites.',
    emptyTitle: 'No links yet',
    emptyDescription: 'Add friends in config.yml.',
    exchangeTitle: 'Link Exchange',
    exchangeDescription: 'Add your exchange policy in config.yml.',
  },
  friends: [],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function stringOrDefault(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function numberOrDefault(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function normalizeNavLinks(value: unknown): SiteNavLink[] {
  if (!Array.isArray(value)) return DEFAULT_BLOG_CONFIG.stellux.navLinks

  const links = value
    .filter(isRecord)
    .map((link) => ({
      href: stringOrDefault(link.href, ''),
      label: stringOrDefault(link.label, ''),
    }))
    .filter((link) => link.href.length > 0 && link.label.length > 0)

  return links.length > 0 ? links : DEFAULT_BLOG_CONFIG.stellux.navLinks
}

function normalizeFriendTypes(value: unknown): FriendTypeConfig[] {
  if (!Array.isArray(value)) return DEFAULT_BLOG_CONFIG.friendTypes

  const types = value
    .filter(isRecord)
    .map((type) => ({
      value: numberOrDefault(type.value, Number.NaN),
      label: stringOrDefault(type.label, ''),
      description: stringOrDefault(type.description, ''),
    }))
    .filter((type) => Number.isInteger(type.value) && type.label.length > 0)

  return types.length > 0 ? types : DEFAULT_BLOG_CONFIG.friendTypes
}

function normalizeFriendsPage(value: unknown): FriendsPageConfig {
  const page = isRecord(value) ? value : {}

  return {
    ...page,
    title: stringOrDefault(page.title, DEFAULT_BLOG_CONFIG.friendsPage.title),
    eyebrow: stringOrDefault(page.eyebrow, DEFAULT_BLOG_CONFIG.friendsPage.eyebrow),
    description: stringOrDefault(page.description, DEFAULT_BLOG_CONFIG.friendsPage.description),
    emptyTitle: stringOrDefault(page.emptyTitle, DEFAULT_BLOG_CONFIG.friendsPage.emptyTitle),
    emptyDescription: stringOrDefault(
      page.emptyDescription,
      DEFAULT_BLOG_CONFIG.friendsPage.emptyDescription
    ),
    exchangeTitle: stringOrDefault(page.exchangeTitle, DEFAULT_BLOG_CONFIG.friendsPage.exchangeTitle),
    exchangeDescription: stringOrDefault(
      page.exchangeDescription,
      DEFAULT_BLOG_CONFIG.friendsPage.exchangeDescription
    ),
  }
}

function normalizeFriends(value: unknown): Friend[] {
  if (!Array.isArray(value)) return []

  return value
    .filter(isRecord)
    .map((friend) => ({
      name: stringOrDefault(friend.name, ''),
      description: stringOrDefault(friend.description, ''),
      site_url: stringOrDefault(friend.site_url, ''),
      avatar_url: stringOrDefault(friend.avatar_url, ''),
      website_type: numberOrDefault(friend.website_type, 2),
    }))
    .filter((friend) => friend.name.length > 0 && friend.site_url.length > 0)
}

export function parseBlogConfig(source: string): BlogConfig {
  const parsed = parse(source) as unknown
  const root = isRecord(parsed) ? parsed : {}
  const stellux = isRecord(root.stellux) ? root.stellux : {}

  return {
    ...root,
    stellux: {
      ...stellux,
      title: stringOrDefault(stellux.title, DEFAULT_BLOG_CONFIG.stellux.title),
      url: stringOrDefault(stellux.url, DEFAULT_BLOG_CONFIG.stellux.url),
      description: stringOrDefault(stellux.description, DEFAULT_BLOG_CONFIG.stellux.description),
      author: stringOrDefault(stellux.author, DEFAULT_BLOG_CONFIG.stellux.author),
      avatar: stringOrDefault(stellux.avatar, DEFAULT_BLOG_CONFIG.stellux.avatar),
      repoUrl: stringOrDefault(stellux.repoUrl, DEFAULT_BLOG_CONFIG.stellux.repoUrl),
      locale: stringOrDefault(stellux.locale, DEFAULT_BLOG_CONFIG.stellux.locale),
      htmlLang: stringOrDefault(stellux.htmlLang, DEFAULT_BLOG_CONFIG.stellux.htmlLang),
      navLinks: normalizeNavLinks(stellux.navLinks),
    },
    friendTypes: normalizeFriendTypes(root.friendTypes),
    friendsPage: normalizeFriendsPage(root.friendsPage),
    friends: normalizeFriends(root.friends),
  }
}

export function loadBlogConfig(configPath = path.resolve(process.cwd(), 'config.yml')): BlogConfig {
  try {
    return parseBlogConfig(readFileSync(configPath, 'utf8'))
  } catch (error) {
    if (isRecord(error) && error.code === 'ENOENT') {
      return DEFAULT_BLOG_CONFIG
    }
    throw error
  }
}

export function stringifyBlogConfigWithFriends(source: string, friends: Friend[]): string {
  const config = parseBlogConfig(source)
  return stringify({
    ...config,
    friends,
  })
}

export const BLOG_CONFIG = loadBlogConfig()
