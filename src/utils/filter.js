export function applyFiltersAndSort(activities, selected, keyword = '') {
  let result = [...activities]

  // 검색어 필터링
  if (keyword.trim()) {
    const lower = keyword.toLowerCase()
    result = result.filter(a => 
      (a.title || '').toLowerCase().includes(lower)
    )
  }

  // 활동 사이트
  const sources = selected['활동 사이트'] || []
  if (sources.length > 0) {
    result = result.filter(a => sources.includes(a.source))
  }

  // 세부 분야
  const fields = selected['세부 분야'] || []
  if (fields.length > 0) {
    result = result.filter(a => {
      const activityFields = (a.field || '').split(',').map(s => s.trim())
      return fields.some(f => activityFields.includes(f))
    })
  }

  // 신청 단위
  const teams = selected['신청 단위'] || []
  if (teams.length > 0) {
    result = result.filter(a => teams.includes(a.team))
  }

  // 정렬
  const sortOption = (selected['정렬'] || [])[0]
  
  if (sortOption === '신청 마감순') {
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
    result.sort((a, b) => Number(b.id) - Number(a.id))
  }

  return result
}