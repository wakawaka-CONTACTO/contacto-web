export interface ChatRoom {
  id: number
  title: string
  participants: number[]
  chatRoomThumbnail: string
  unreadMessageCount: number
  latestMessageContent: string | null
}

export interface ChatRoomResponse {
  content: ChatRoom[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  first: boolean
  numberOfElements: number
  empty: boolean
}

