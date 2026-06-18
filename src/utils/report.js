const STORAGE_KEY = 'activity_reports'

export function getReports() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addReport(data) {
  const reports = getReports()
  const user = JSON.parse(localStorage.getItem('current_user') || 'null')
  const newReport = {
    id: Date.now().toString(),
    ...data,
    authorEmail: user?.email || 'anonymous',  // 작성자 기록
    authorName: user?.name || '익명',
    status: '대기',
    createdAt: new Date().toISOString(),
  }
  reports.push(newReport)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  return newReport
}

// 내 제보만 가져오기
export function getMyReports(email) {
  return getReports().filter(r => r.authorEmail === email)
}

export function deleteReport(reportId) {
  const reports = getReports().filter(r => r.id !== reportId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}

// 관리자: 제보 상태 변경 + 코멘트
export function updateReportStatus(reportId, status, adminComment) {
  const reports = getReports()
  const idx = reports.findIndex(r => r.id === reportId)
  if (idx === -1) return null
  reports[idx] = {
    ...reports[idx],
    status,
    adminComment: adminComment || '',
    reviewedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  return reports[idx]
}