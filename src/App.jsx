import { useState, useEffect, useMemo } from 'react'
import Navbar from './components/Navbar'
import SiteLinks from './components/SiteLinks'
import ActivityCard from './components/ActivityCard'
import FilterBar from './components/FilterBar'
import { fetchActivities } from './api/activities'
import { applyFiltersAndSort } from './utils/filter'

function App() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 필터/정렬 선택 상태를 App에서 관리
  const [selected, setSelected] = useState({})

  useEffect(() => {
    fetchActivities()
      .then(data => {
        setActivities(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // 토글 함수 — FilterBar에 넘겨줄 거
  const handleToggle = (group, option) => {
    setSelected(prev => {
      const current = prev[group] || []
      const isOn = current.includes(option)
      
      // 정렬은 1개만, 나머지는 여러 개
      if (group === '정렬') {
        return { ...prev, [group]: isOn ? [] : [option] }
      }
      return {
        ...prev,
        [group]: isOn ? current.filter(o => o !== option) : [...current, option],
      }
    })
  }

  // 필터/정렬 적용된 결과 (메모이즈로 최적화)
  const visibleActivities = useMemo(
    () => applyFiltersAndSort(activities, selected),
    [activities, selected]
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SiteLinks />
        <FilterBar selected={selected} onToggle={handleToggle} />
        
        {/* 활동 카운트 */}
        <div className="text-sm text-gray-600 mb-4">
          {loading ? (
            '활동 불러오는 중...'
          ) : error ? (
            <span className="text-red-600">에러: {error}</span>
          ) : (
            <>
              활동 <span className="font-semibold text-gray-900">{visibleActivities.length}개</span>
              {visibleActivities.length !== activities.length && (
                <span className="text-gray-400"> (전체 {activities.length}개)</span>
              )}
            </>
          )}
        </div>

        {/* 카드 그리드 */}
        {!loading && !error && visibleActivities.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}

        {/* 활동 0개 */}
        {!loading && !error && visibleActivities.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            {activities.length === 0 
              ? '아직 등록된 활동이 없어요.' 
              : '조건에 맞는 활동이 없어요. 필터를 조정해보세요.'}
          </div>
        )}
      </main>
    </div>
  )
}

export default App