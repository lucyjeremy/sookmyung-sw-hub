const ROOMS_KEY = 'chat_rooms'
const MESSAGES_KEY = 'chat_messages'

export function getRooms() {
  try {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]')
  } catch { return [] }
}

export function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]')
  } catch { return [] }
}

// 두 사용자 간 채팅방 찾거나 만들기 (참여자 이메일 두 개)
export function getOrCreateRoom(myEmail, otherEmail) {
  const rooms = getRooms()
  const key = [myEmail, otherEmail].sort().join('|')
  let room = rooms.find(r => r.key === key)
  if (!room) {
    room = {
      id: Date.now().toString(),
      key,
      participants: [myEmail, otherEmail],
      createdAt: new Date().toISOString(),
    }
    rooms.push(room)
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
  }
  return room
}

// 내가 참여 중인 채팅방 목록
export function getMyRooms(myEmail) {
  return getRooms().filter(r => r.participants.includes(myEmail))
}

// 특정 채팅방의 메시지
export function getRoomMessages(roomId) {
  return getMessages().filter(m => m.roomId === roomId).sort((a, b) => 
    new Date(a.createdAt) - new Date(b.createdAt)
  )
}

// 메시지 보내기
export function sendMessage(roomId, senderEmail, content) {
  const messages = getMessages()
  const newMsg = {
    id: Date.now().toString(),
    roomId,
    senderEmail,
    content,
    createdAt: new Date().toISOString(),
  }
  messages.push(newMsg)
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
  return newMsg
}

// 채팅방 삭제
export function deleteRoom(roomId) {
  const rooms = getRooms().filter(r => r.id !== roomId)
  const messages = getMessages().filter(m => m.roomId !== roomId)
  localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms))
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}