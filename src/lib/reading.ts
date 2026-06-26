export function estimateMarkdownCharCount(content = ''): number {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*]\([^)]*\)/g, '')
    .replace(/\[[^\]]*]\([^)]*\)/g, '')
    .replace(/[#>*_\-\[\]()`~|]/g, '')
    .replace(/\s+/g, '')
    .length
}

export function estimateReadingMinutes(content = ''): number {
  const count = estimateMarkdownCharCount(content)
  if (count === 0) return 0
  return Math.max(1, Math.ceil(count / 450))
}
