"use client"

import {useEffect, useRef, useState} from "react"
import {useRouter} from "next/navigation"
import {ArrowLeft, Send} from "lucide-react"
import {Client, IMessage} from "@stomp/stompjs"
import {AnimatePresence, motion} from "framer-motion"
import {getAuthToken} from "@/lib/auth"
import SockJS from "sockjs-client"
import {config} from "@/config"

// 상수를 함수 내부로 이동
const CHAT_URL = config.CHAT_URL

interface Message {
    id: number
    content: string
    senderId: string
    sendedId: number
    chatRoomId: number
    createdAt: string
    isMine: boolean
    translatedContent?: string
}

interface ChatRoomProps {
    roomId: number,
    participantId?: number,
    messages?: Message[]
}

export function ChatRoom({roomId}: Readonly<ChatRoomProps>) {
    const [messages, setMessages] = useState<Message[]>([])
    const [messageContent, setMessageContent] = useState("")
    const [showCongrats, setShowCongrats] = useState(true)
    const [connected, setConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [participantId, setParticipantId] = useState<number | null>(null)
    const [isTranslationEnabled, setIsTranslationEnabled] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState("EN")
    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false)
    const translationLanguages = ["KO", "EN", "JAP", "CH"]

    const stompClientRef = useRef<Client | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // 이전 메시지 로드
    const loadPreviousMessages = async () => {
        try {
            const token = getAuthToken()
            const userId = localStorage.getItem("userId")

            const response = await fetch(`${config.BASE_URL}/api/v1/users/me/chatroom/${roomId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            })

            if (!response.ok) throw new Error('Failed to load messages')

            const data = await response.json()
            // 참여자 ID 설정
            if (data.participants && data.participants.length > 0) {
                setParticipantId(data.participants[0])
            }

            if (data.messages) {
                const processedMessages = data.messages.map((message: Message) => ({
                    ...message,
                    isMine: message.senderId.toString() === userId
                }))
                setMessages(processedMessages)
            }
        } catch (error) {
            console.error("Failed to load messages:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (typeof window === "undefined") return

        let isSubscribed = true // 구독 상태 추적

        const initializeWebSocket = async () => {
            try {
                // 이전 연결 정리
                if (stompClientRef.current?.active) {
                    console.log("Cleaning up previous connection")
                    await stompClientRef.current.deactivate()
                }

                const userId = localStorage.getItem("userId")
                const token = getAuthToken()

                if (!userId || !token) {
                    console.error("Missing userId or token")
                    return
                }

                await loadPreviousMessages()

                const sockJS = new SockJS(CHAT_URL + `?userId=${userId}&accessToken=${token}`)
                const client = new Client({
                    webSocketFactory: () => sockJS,
                    connectHeaders: {
                        userId: userId,
                        accessToken: token,
                    },
                    onConnect: () => {
                        if (!isSubscribed) return // 구독이 취소되었다면 무시

                        setConnected(true)
                        console.log("Connected to WebSocket")

                        client.subscribe(`/topic/${roomId}`, (message: IMessage) => {
                            if (!isSubscribed) return // 구독이 취소되었다면 무시

                            const receivedMessage = JSON.parse(message.body)
                            const isMyMessage = receivedMessage.senderId.toString() === userId

                            if (!isMyMessage) {
                                setMessages(prev => [...prev, {
                                    ...receivedMessage,
                                    isMine: false
                                }])
                            }
                        })
                    },
                    onDisconnect: () => {
                        if (!isSubscribed) return
                        setConnected(false)
                        console.log("Disconnected from WebSocket")
                    }
                })

                client.activate()
                stompClientRef.current = client
            } catch (error) {
                console.error("WebSocket initialization error:", error)
                if (isSubscribed) {
                    setConnected(false)
                }
            }
        }

        initializeWebSocket()

        const timer = setTimeout(() => {
            setShowCongrats(false)
        }, 3000)

        // Cleanup function
        return () => {
            console.log("Cleaning up WebSocket connection")
            isSubscribed = false
            if (stompClientRef.current?.active) {
                stompClientRef.current.deactivate()
                stompClientRef.current = null
            }
            clearTimeout(timer)
        }
    }, [roomId])

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    const handleBack = () => {
        router.push("/chat")
    }

    const sendMessage = () => {
        if (!messageContent || !stompClientRef.current || !connected || !participantId) return

        const userId = localStorage.getItem("userId")
        const token = getAuthToken()
        const currentTime = new Date().toISOString()

        const messageData = {
            content: messageContent,
            senderId: userId,
            sendedId: participantId,
            chatRoomId: roomId,
            createdAt: currentTime,
        }

        // 먼저 로컬에 메시지 추가
        setMessages(prev => [...prev, {
            ...messageData,
            id: Date.now(),
            isMine: true,
        }])

        // 서버로 메시지 전송
        stompClientRef.current.publish({
            destination: `/app/chat.send/${roomId}`,
            headers: {Authorization: `${token}`},
            body: JSON.stringify(messageData),
        })

        setMessageContent("")
    }

    // 번역 메시지 처리 함수
    const handleTranslateMessage = (message) => {
        try {
            console.log('Raw translation message:', message.body)
            const parsedData = JSON.parse(message.body)
            console.log('Parsed translation data:', parsedData)

            if (Array.isArray(parsedData)) {
                setMessages(prevMessages => {
                  return prevMessages.map(msg => {
                      const translatedMsg = parsedData.find(tMsg => tMsg.id === msg.id)
                      if (translatedMsg) {
                        return {...msg, translatedContent: translatedMsg.message}
                      }
                      return msg
                    })
                })
            }
        } catch (error) {
            console.error('Translation message parsing error:', error)
        }
    }

    // 번역 토글 함수
    const toggleTranslation = () => {
        const newTranslationState = !isTranslationEnabled
        setIsTranslationEnabled(newTranslationState)

        if (newTranslationState && stompClientRef.current) {
            const userId = localStorage.getItem("userId")
            const messageIds = messages
                .filter(msg => !msg.isMine)
                .map(msg => msg.id)
                .join(',')
            stompClientRef.current.subscribe(
                `/queue/translate/${userId}`,
                handleTranslateMessage,
                {
                    targetLanguage: selectedLanguage,
                    messageIds: messageIds
                }
            )
        }
    }

    // 언어 변경 함수
    const changeLanguage = (newLanguage: string) => {
        setSelectedLanguage(newLanguage)
        setIsLanguageModalVisible(false)

        if (stompClientRef.current && isTranslationEnabled) {
            const userId = localStorage.getItem("userId")

            // 기존 구독 해제
            stompClientRef.current.unsubscribe(`/queue/translate/${userId}`)

            // 새 언어로 재구독
            const messageIds = messages
                .filter(msg => !msg.isMine)
                .map(msg => msg.id)
                .join(',')

            stompClientRef.current.subscribe(
                `/queue/translate/${userId}`,
                handleTranslateMessage,
                {
                    targetLanguage: newLanguage,
                    messageIds: messageIds
                }
            )
        }
    }

    return (
        <div className="flex flex-col h-screen bg-[#f5dfdb]">
            {/* 헤더 */}
            <div className="flex items-center justify-between p-4 border-b border-black/10">
                <div className="flex items-center">
                    <button onClick={handleBack} className="mr-4">
                        <ArrowLeft className="w-6 h-6"/>
                    </button>
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-white rounded-full mr-2"/>
                        <span className="font-press-start">Contacto Manager</span>
                    </div>
                </div>

                {/* 번역 컨트롤 */}
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <button
                            onClick={toggleTranslation}
                            className={`px-3 py-1 rounded-lg ${
                                isTranslationEnabled
                                    ? 'bg-[#2ea7e0] text-white'
                                    : 'bg-gray-200'
                            }`}
                        >
                            번역 {isTranslationEnabled ? '끄기' : '켜기'}
                        </button>

                        {isTranslationEnabled && (
                            <div className="relative inline-block ml-2">
                                <button
                                    onClick={() => setIsLanguageModalVisible(!isLanguageModalVisible)}
                                    className="px-3 py-1 bg-[#2ea7e0] text-white rounded-lg"
                                >
                                    {selectedLanguage}
                                </button>

                                {isLanguageModalVisible && (
                                    <div
                                        className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        {translationLanguages.map(lang => (
                                            <button
                                                key={lang}
                                                onClick={() => changeLanguage(lang)}
                                                className={`block w-full px-4 py-2 text-left hover:bg-[#2ea7e0]/10 ${
                                                    selectedLanguage === lang ? 'bg-[#2ea7e0] text-white' : ''
                                                }`}
                                            >
                                                {lang}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {!connected && (
                <div
                    className="bg-red-100 border border-gray-200 border-red-400 text-red-700 px-4 py-3 rounded relative dark:border-gray-800"
                    role="alert">
                    <strong className="font-bold">Connection Error!</strong>
                    <span
                        className="block sm:inline"> Unable to connect to the chat server. Please try again later.</span>
                </div>
            )}

            {/* Messages */}
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <p>Loading messages...</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!connected && (
                        <div className="bg-yellow-100 p-2 text-center rounded-lg">
                            <p className="text-sm text-yellow-800">Connecting to chat...</p>
                        </div>
                    )}
                    <AnimatePresence>
                        {showCongrats && (
                            <motion.div
                                initial={{opacity: 0, y: 20}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: -20}}
                                className="bg-green-400 p-4 rounded-lg text-center"
                            >
                                <p className="font-press-start text-sm">Congratulation!</p>
                                <p className="text-xs mt-1">
                                    WE THINK YOU BOTH HAVE A LOT IN COMMON.
                                    <br/>
                                    FEEL FREE TO TALK COMFORTABLY.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${
                                message.isMine ? 'items-end' : 'items-start'
                            }`}
                        >
                            <div className={`max-w-[70%] rounded-lg p-3 ${
                                message.isMine
                                    ? 'bg-[#2ea7e0] text-white' // 내 메시지 색상
                                    : 'bg-[#ffd698] text-black' // 상대방 메시지 색상 (노란색)
                            }`}>
                                <p>{message.content}</p>
                                {isTranslationEnabled && message.translatedContent && !message.isMine && (
                                    <p className="mt-2 pt-2 border-t border-gray-200/50 text-sm text-gray-600">
                                        {message.translatedContent}
                                    </p>
                                )}
                            </div>
                            <span className="text-xs text-gray-500 mt-1">
                {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
              </span>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border-2 border-black rounded-lg focus:outline-none"
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!connected || !messageContent}
                        className="p-2 bg-[#2ea7e0] text-white rounded-lg hover:bg-[#2ea7e0]/80 transition-colors disabled:opacity-50"
                    >
                        <Send className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    )
}

