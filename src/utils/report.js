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
  const newReport = {
    id: Date.now().toString(),
    ...data,
    status: '대기',
    createdAt: new Date().toISOString(),
  }
  reports.push(newReport)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
  return newReport
}

export function deleteReport(reportId) {
  const reports = getReports().filter(r => r.id !== reportId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
}