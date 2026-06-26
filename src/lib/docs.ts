export type DocumentRootLike = {
  id: string
  title: string
  alias: string
  description?: string
  thumbnail?: string
  sort?: number
  createdAt: Date
  updatedAt?: Date
}

export type DocumentContentLike = {
  id: string
  title: string
  alias?: string
  parentId?: string
  documentId: string
  isDir: boolean
  sort?: number
  createdAt: Date
}

export type DocumentTreeItem = {
  id: string
  title: string
  url: string
  sort: number
  createdAt: Date
  isDir: boolean
  items?: DocumentTreeItem[]
}

type DocumentEntryAliasLike = {
  id: string
  filePath?: string
}

export type DocumentEntryKind = 'root' | 'dir' | 'page'

function cleanDocumentEntryId(id: string): string {
  return id
    .replace(/\\/g, '/')
    .replace(/\.(md|mdx)$/i, '')
    .replace(/^\/+|\/+$/g, '')
}

function getDocumentEntryPath(entry: Pick<DocumentEntryAliasLike, 'id' | 'filePath'>): string {
  const path = entry.filePath?.replace(/\\/g, '/')
  if (!path) return cleanDocumentEntryId(entry.id)

  const marker = '/src/content/docs/'
  const markerIndex = path.indexOf(marker)
  if (markerIndex >= 0) {
    return cleanDocumentEntryId(path.slice(markerIndex + marker.length))
  }

  return cleanDocumentEntryId(path.replace(/^src\/content\/docs\//, ''))
}

export function isPublicDocumentEntry(_entry: Pick<DocumentEntryAliasLike, 'id'>): boolean {
  return true
}

function getDocumentEntrySegments(entry: Pick<DocumentEntryAliasLike, 'id' | 'filePath'>): string[] {
  return getDocumentEntryPath(entry).split('/').filter(Boolean)
}

function trimIndexSegment(segments: string[]): string[] {
  return segments.at(-1) === 'index' ? segments.slice(0, -1) : segments
}

export function getDocumentEntryKind(entry: Pick<DocumentEntryAliasLike, 'id'>): DocumentEntryKind {
  const segments = getDocumentEntrySegments(entry)
  if (segments.length === 2 && segments.at(-1) === 'index') return 'root'
  if (segments.length > 2 && segments.at(-1) === 'index') return 'dir'
  return 'page'
}

export function isDocumentRootEntry(entry: Pick<DocumentEntryAliasLike, 'id'>): boolean {
  return getDocumentEntryKind(entry) === 'root'
}

export function isDocumentContentEntry(entry: Pick<DocumentEntryAliasLike, 'id'>): boolean {
  return getDocumentEntryKind(entry) === 'page'
}

export function getDocumentEntryRootAlias(entry: DocumentEntryAliasLike): string {
  return getDocumentEntrySegments(entry)[0] || cleanDocumentEntryId(entry.id)
}

export function getDocumentEntryContentAlias(entry: DocumentEntryAliasLike): string {
  const contentSegments = trimIndexSegment(getDocumentEntrySegments(entry)).slice(1)
  return contentSegments.join('/')
}

export function getDocumentEntryRootId(entry: DocumentEntryAliasLike): string {
  return getDocumentEntryRootAlias(entry)
}

export function getDocumentEntryContentId(entry: DocumentEntryAliasLike): string {
  return `${getDocumentEntryRootAlias(entry)}/${getDocumentEntryContentAlias(entry)}`
}

export function getDocumentEntryDocumentId(entry: DocumentEntryAliasLike): string {
  return getDocumentEntryRootAlias(entry)
}

export function getDocumentEntryParentId(entry: DocumentEntryAliasLike): string {
  const rootAlias = getDocumentEntryRootAlias(entry)
  const contentSegments = getDocumentEntryContentAlias(entry).split('/').filter(Boolean)
  if (contentSegments.length <= 1) return rootAlias
  return `${rootAlias}/${contentSegments.slice(0, -1).join('/')}`
}

export function getDocumentEntryIsDir(entry: DocumentEntryAliasLike): boolean {
  return getDocumentEntryKind(entry) === 'dir'
}

export function getDocumentRootUrl(root: Pick<DocumentRootLike, 'alias'>): string {
  return `/document/${root.alias}`
}

export function getDocumentContentUrl(
  root: Pick<DocumentRootLike, 'alias'>,
  content: { alias?: string; id?: string }
): string {
  return `/document/${root.alias}/${content.alias || content.id}`
}

function compareDocumentOrder(
  a: Pick<DocumentRootLike | DocumentTreeItem, 'sort' | 'createdAt'>,
  b: Pick<DocumentRootLike | DocumentTreeItem, 'sort' | 'createdAt'>
): number {
  const sortDelta = (a.sort ?? 0) - (b.sort ?? 0)
  if (sortDelta !== 0) return sortDelta
  return a.createdAt.getTime() - b.createdAt.getTime()
}

export function sortDocumentRoots<T extends DocumentRootLike>(roots: T[]): T[] {
  return [...roots].sort(compareDocumentOrder)
}

function sortTree(items: DocumentTreeItem[]) {
  items.sort(compareDocumentOrder)
  for (const item of items) {
    if (item.items?.length) sortTree(item.items)
  }
}

function getImplicitDirectoryTitle(id: string): string {
  return id.split('/').filter(Boolean).at(-1) || id
}

function ensureDirectoryNode(
  map: Map<string, DocumentTreeItem>,
  id: string,
  parentId: string,
  directories: Array<{ id: string; parentId: string }>
) {
  if (map.has(id)) return
  map.set(id, {
    id,
    title: getImplicitDirectoryTitle(id),
    url: '',
    sort: 0,
    createdAt: new Date(0),
    isDir: true,
  })
  directories.push({ id, parentId })
}

export function buildDocumentTree(
  root: DocumentRootLike,
  contents: DocumentContentLike[]
): DocumentTreeItem[] {
  const map = new Map<string, DocumentTreeItem>()
  const directories: Array<{ id: string; parentId: string }> = []

  for (const content of contents) {
    const aliasSegments = content.alias?.split('/').filter(Boolean) ?? []
    const directorySegments = aliasSegments.slice(0, -1)
    let parentId = content.documentId

    for (let index = 0; index < directorySegments.length; index += 1) {
      const directoryId = `${content.documentId}/${directorySegments.slice(0, index + 1).join('/')}`
      ensureDirectoryNode(map, directoryId, parentId, directories)
      parentId = directoryId
    }

    map.set(content.id, {
      id: content.id,
      title: content.title,
      url: getDocumentContentUrl(root, content),
      sort: content.sort ?? 0,
      createdAt: content.createdAt,
      isDir: false,
    })
  }

  const tree: DocumentTreeItem[] = []
  for (const item of [...directories, ...contents]) {
    const node = map.get(item.id)
    if (!node) continue
    if (!item.parentId || item.parentId === root.id || !map.has(item.parentId)) {
      tree.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (!parent) continue
      parent.items ??= []
      parent.items.push(node)
    }
  }

  sortTree(tree)
  return tree
}

export function flattenDocumentTree(items: DocumentTreeItem[]): DocumentTreeItem[] {
  const result: DocumentTreeItem[] = []
  const walk = (nodes: DocumentTreeItem[]) => {
    for (const node of nodes) {
      result.push(node)
      if (node.items?.length) walk(node.items)
    }
  }
  walk(items)
  return result
}
