// 활동 배열을 필터/정렬 조건에 따라 가공해서 반환
export function applyFiltersAndSort(activities, selected) {
  let result = [...activities]  // 원본 배열 안 건드리게 복사

  // ===== 필터링 =====
  
  // 활동 사이트 (source 컬럼)
  const sources = selected['활동 사이트'] || []
  if (sources.length > 0) {
    result = result.filter(a => sources.includes(a.source))
  }

  // 세부 분야 (field 컬럼 — 쉼표로 구분된 여러 값 가능)
  const fields = selected['세부 분야'] || []
  if (fields.length > 0) {
    result = result.filter(a => {
      const activityFields = (a.field || '').split(',').map(s => s.trim())
      return fields.some(f => activityFields.includes(f))
    })
  }

  // 신청 단위 (team 컬럼)
  const teams = selected['신청 단위'] || []
  if (teams.length > 0) {
    result = result.filter(a => teams.includes(a.team))
  }

  // ===== 정렬 =====
  
  const sortOption = (selected['정렬'] || [])[0]
  
  if (sortOption === '신청 마감순') {
    // 마감 가까운 순 (오름차순)
    result.sort((a, b) => {
      const aTime = new Date(a.applyEnd?.replace(' ', 'T') || 0).getTime()
      const bTime = new Date(b.applyEnd?.replace(' ', 'T') || 0).getTime()
      return aTime - bTime
    })
  } else if (sortOption === '활동 시작순') {
    result.sort((a, b) => {
      const aTime = new Date(a.startDate?.replace(' ', 'T') || 0).getTime()
      const bTime = new Date(b.startDate?.replace(' ', 'T') || 0).getTime()
      return aTime - bTime
    })
  } else if (sortOption === '최신순') {
    // id가 클수록 최신 (학교 사이트가 id를 순차 부여)
    result.sort((a, b) => Number(b.id) - Number(a.id))
  }

  return result
}