import { BLOG_CONFIG } from './blog-config'

const locale = BLOG_CONFIG.stellux.locale

const absoluteFormatter = new Intl.DateTimeFormat(locale, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const relativeFormatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 60 * 60],
  ['month', 30 * 24 * 60 * 60],
  ['week', 7 * 24 * 60 * 60],
  ['day', 24 * 60 * 60],
  ['hour', 60 * 60],
  ['minute', 60],
]

export function formatBlogDate(date: Date): string {
  return absoluteFormatter.format(date)
}

export function formatRelativeTime(date: Date, now = new Date()): string {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)

  for (const [unit, unitSeconds] of units) {
    if (Math.abs(seconds) >= unitSeconds) {
      return relativeFormatter.format(Math.round(seconds / unitSeconds), unit)
    }
  }

  return '刚刚'
}
