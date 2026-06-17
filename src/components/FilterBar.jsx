// 필터 옵션 그룹들 — 외부에서도 쓸 수 있게 export
export const filterGroups = [
  {
    label: '정렬',
    options: ['신청 마감순', '활동 시작순', '최신순'],
  },
  {
    label: '활동 사이트',
    options: ['WISE', '국제', '현장실습'],
  },
  {
    label: '세부 분야',
    options: ['AI', '보안', '빅데이터', '디자인', '데이터', '네트워크'],
  },
  {
    label: '신청 단위',
    options: ['개인', '팀'],
  },
]

// props로 selected, onToggle 받기
function FilterBar({ selected, onToggle }) {
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
              {group.options.map((option) => (
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FilterBar