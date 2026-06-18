// 정적 옵션들 (값이 정해진 그룹)
export const STATIC_FILTER_GROUPS = [
  {
    label: '정렬',
    options: ['신청 마감순', '활동 시작순', '최신순'],
  },
  {
    label: '활동 사이트',
    options: ['WISE', '국제', '현장실습'],
  },
  {
    label: '신청 단위',
    options: ['개인', '팀'],
  },
  {
    label: '학년',
    options: ['1학년', '2학년', '3학년', '4학년', '전학년'],
  },
  {
    label: '시기',
    options: ['이번 주 마감', '이번 달 마감', '진행 중'],
  },
]

// 데이터에서 field 값 추출해서 정렬
function extractFieldOptions(activities) {
  const set = new Set()
  activities.forEach(a => {
    const fields = (a.field || '').split(',').map(s => s.trim()).filter(Boolean)
    fields.forEach(f => set.add(f))
  })
  return Array.from(set).sort()
}

function FilterBar({ selected, onToggle, activities = [] }) {
  // field 옵션은 데이터에서 동적 생성
  const fieldOptions = extractFieldOptions(activities)
  
  // 전체 필터 그룹: 정적 + 동적 field
  const filterGroups = [
    STATIC_FILTER_GROUPS[0],  // 정렬
    STATIC_FILTER_GROUPS[1],  // 활동 사이트
    { label: '세부 분야', options: fieldOptions },  // 동적
    STATIC_FILTER_GROUPS[2],  // 신청 단위
    STATIC_FILTER_GROUPS[3],  // 학년
    STATIC_FILTER_GROUPS[4],  // 시기
  ]

  const isActive = (group, option) => 
    (selected[group] || []).includes(option)

  return (
    <section className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="space-y-3">
        {filterGroups.map((group) => (
          <div key={group.label} className="flex items-start gap-3">
            <div className="text-sm font-semibold text-gray-700 w-24 shrink-0 pt-1.5">
              {group.label}
            </div>
            <div className="flex flex-wrap gap-2">
              {group.options.length > 0 ? (
                group.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => onToggle(group.label, option)}
                    className={
                      isActive(group.label, option)
                        ? 'text-sm px-3 py-1 rounded-full border bg-purple-700 text-white border-purple-700'
                        : 'text-sm px-3 py-1 rounded-full border bg-white text-gray-700 border-gray-300 hover:border-purple-500'
                    }
                  >
                    {option}
                  </button>
                ))
              ) : (
                <span className="text-sm text-gray-400 py-1">데이터 없음</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FilterBar