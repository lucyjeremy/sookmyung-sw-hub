import Papa from 'papaparse'
import { SHEET_CSV_URL } from '../config'

// 구글 시트에서 활동 목록 가져오기
export async function fetchActivities() {
  // 1. 시트 CSV 다운로드
  const response = await fetch(SHEET_CSV_URL)
  
  if (!response.ok) {
    throw new Error(`시트 가져오기 실패: ${response.status}`)
  }
  
  const csvText = await response.text()
  
  // 2. CSV → JavaScript 배열로 파싱
  const parsed = Papa.parse(csvText, {
    header: true,        // 첫 줄을 컬럼명으로 사용
    skipEmptyLines: true // 빈 줄 무시
  })
  
  // 3. 결과 배열 반환 (id가 있는 행만)
  return parsed.data.filter(row => row.id)
}