const STORAGE_KEY = 'application_status'

// 가능한 상태: '신청완료', '활동중', '활동완료'
export const STATUS_OPTIONS = ['신청완료', '활동중', '활동완료']

// 전체 상태 데이터: { activityId: status }
export function getApplicationStatuses() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

// 특정 활동의 상태
export function getStatus(activityId) {
  return getApplicationStatuses()[activityId] || null
}

// 상태 설정 (이미 같은 상태면 해제)
export function setStatus(activityId, status) {
  const all = getApplicationStatuses()
  if (all[activityId] === status) {
    delete all[activityId]  // 같은 거 또 누르면 해제
  } else {
    all[activityId] = status
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  return all[activityId] || null
}

// 상태별 활동 ID 목록
export function getActivityIdsByStatus(status) {
  const all = getApplicationStatuses()
  return Object.entries(all)
    .filter(([_, s]) => s === status)
    .map(([id, _]) => id)
}