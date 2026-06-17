// localStorage 키
const STORAGE_KEY = 'bookmarked_activities'

// 북마크된 id 목록 가져오기
export function getBookmarks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 특정 활동이 북마크 됐는지 확인
export function isBookmarked(id) {
  return getBookmarks().includes(id)
}

// 북마크 토글 (켜져있으면 끔, 꺼져있으면 켬)
export function toggleBookmark(id) {
  const current = getBookmarks()
  const newList = current.includes(id)
    ? current.filter(bId => bId !== id)
    : [...current, id]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
  return newList
}