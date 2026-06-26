import { BLOG_CONFIG } from './blog-config'
import type { FriendTypeConfig } from './blog-config'

export type Friend = {
  name: string
  description: string
  site_url: string
  avatar_url: string
  website_type: number
}

export const FRIEND_TYPES = BLOG_CONFIG.friendTypes

export type FriendTypeValue = number

export function groupFriends(
  friends: Friend[],
  friendTypes: FriendTypeConfig[] = FRIEND_TYPES
): Record<FriendTypeValue, Friend[]> {
  const groups: Record<FriendTypeValue, Friend[]> = Object.fromEntries(
    friendTypes.map((type) => [type.value, []])
  )

  for (const friend of friends) {
    const type = friend.website_type as FriendTypeValue
    if (type in groups) groups[type].push(friend)
  }

  return groups
}
