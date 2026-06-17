import { useState, useEffect, useRef } from 'react'
import { getCurrentUser } from '../utils/auth'
import { getUsers } from '../utils/auth'
import { 
  getMyRooms, getOrCreateRoom, getRoomMessages, 
  sendMessage, deleteRoom 
} from '../utils/chat'

function ChatPage() {
  const me = getCurrentUser()
  const [rooms, setRooms] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)
  const [otherEmail, setOtherEmail] = useState('')
  const messagesEndRef = useRef(null)

  // 채팅방 목록 갱신
  const refreshRooms = () => {
    if (!me) return
    setRooms(getMyRooms(me.email))
  }

  // 메시지 갱신
  const refreshMessages = () => {
    if (!selectedRoom) return
    setMessages(getRoomMessages(selectedRoom.id))
  }

  useEffect(() => {
    refreshRooms()
  }, [])

  useEffect(() => {
    refreshMessages()
    // 0.5초마다 새 메시지 폴링 (다른 사용자가 보낸 거 받기)
    const interval = setInterval(refreshMessages, 500)
    return () => clearInterval(interval)
  }, [selectedRoom])

  // 새 메시지 오면 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!me) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-600 mb-4">채팅을 이용하려면 로그인이 필요합니다.</p>
      </main>
    )
  }

  const handleStartChat = (e) => {
    e.preventDefault()
    if (!otherEmail.trim()) return
    if (otherEmail === me.email) {
      alert('자기 자신과는 채팅할 수 없어요.')
      return
    }
    const users = getUsers()
    const target = users.find(u => u.email === otherEmail)
    if (!target) {
      alert('존재하지 않는 회원입니다.')
      return
    }
    const room = getOrCreateRoom(me.email, otherEmail)
    refreshRooms()
    setSelectedRoom(room)
    setShowNewChat(false)
    setOtherEmail('')
  }

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim() || !selectedRoom) return
    sendMessage(selectedRoom.id, me.email, input.trim())
    setInput('')
    refreshMessages()
  }

  const handleDelete = (roomId) => {
    if (!confirm('채팅방을 삭제하시겠어요?')) return
    deleteRoom(roomId)
    if (selectedRoom?.id === roomId) setSelectedRoom(null)
    refreshRooms()
  }

  const otherParticipant = (room) => 
    room.participants.find(p => p !== me.email)

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">채팅</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
        {/* 채팅방 목록 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">채팅방</h2>
            <button
              onClick={() => setShowNewChat(true)}
              className="text-sm bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
            >
              + 새 채팅
            </button>
          </div>

          {showNewChat && (
            <form onSubmit={handleStartChat} className="p-3 bg-purple-50 space-y-2">
              <input
                type="email"
                value={otherEmail}
                onChange={(e) => setOtherEmail(e.target.value)}
                placeholder="상대방 이메일"
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 text-xs bg-purple-700 text-white py-1 rounded">
                  시작
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowNewChat(false)}
                  className="flex-1 text-xs bg-gray-200 text-gray-700 py-1 rounded"
                >
                  취소
                </button>
              </div>
            </form>
          )}

          <div className="flex-1 overflow-y-auto">
            {rooms.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                아직 채팅방이 없어요.
              </div>
            ) : (
              rooms.map(room => (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={
                    selectedRoom?.id === room.id
                      ? 'p-3 border-b border-gray-100 bg-purple-50 cursor-pointer'
                      : 'p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                  }
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {otherParticipant(room)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(room.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(room.id) }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 메시지 영역 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col lg:col-span-2">
          {selectedRoom ? (
            <>
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">
                  {otherParticipant(selectedRoom)}
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    아직 메시지가 없어요. 첫 메시지를 보내보세요!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderEmail === me.email
                    return (
                      <div
                        key={msg.id}
                        className={isMine ? 'flex justify-end' : 'flex justify-start'}
                      >
                        <div
                          className={
                            isMine
                              ? 'bg-purple-700 text-white rounded-lg px-3 py-2 max-w-xs'
                              : 'bg-gray-100 text-gray-800 rounded-lg px-3 py-2 max-w-xs'
                          }
                        >
                          <div className="text-sm whitespace-pre-wrap break-words">
                            {msg.content}
                          </div>
                          <div className={
                            isMine ? 'text-xs text-purple-200 mt-1' : 'text-xs text-gray-500 mt-1'
                          }>
                            {new Date(msg.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지 입력..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-700 text-white px-4 rounded-lg hover:bg-purple-800 text-sm"
                >
                  전송
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              왼쪽에서 채팅방을 선택하거나 새 채팅을 시작하세요.
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ChatPage