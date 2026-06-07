// 신청 마감일까지 며칠 남았는지 계산
// applyEnd 예: "2026-06-17 23:45"
// 반환: 0 = 오늘 마감, 1 = 내일 마감, 음수 = 이미 지남
export function getDaysUntilDeadline(applyEnd) {
  if (!applyEnd) return null

  const deadline = new Date(applyEnd.replace(' ', 'T'))
  const today = new Date()
  
  // 시간 제외하고 날짜만 비교 (자정 기준)
  deadline.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffMs = deadline.getTime() - today.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// 마감 임박 여부 (D-1 이하 + 아직 안 지남)
export function isDeadlineSoon(applyEnd) {
  const days = getDaysUntilDeadline(applyEnd)
  if (days === null) return false
  return days >= 0 && days <= 1
}