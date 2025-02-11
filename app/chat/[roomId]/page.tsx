import { ChatRoom } from "@/components/chat-room"

export default function ChatRoomPage({ params }: { params: { roomId: string } }) {
  return <ChatRoom roomId={Number.parseInt(params.roomId)} />
}

