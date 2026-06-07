import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import SiteLinks from './components/SiteLinks'
import ActivityCard from './components/ActivityCard'
import FilterBar from './components/FilterBar'
import { fetchActivities } from './api/activities'

function App() {
  // 상태 3개: 활동 목록, 로딩 중인지, 에러 있는지
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 컴포넌트가 처음 화면에 나타날 때 한 번만 실행
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <SiteLinks />
        <FilterBar />
        
        {/* 활동 카운트 */}
        <div className="text-sm text-gray-600 mb-4">
          {loading ? (
            '활동 불러오는 중...'
          ) : error ? (
            <span className="text-red-600">에러: {error}</span>
          ) : (
            <>활동 <span className="font-semibold text-gray-900">{activities.length}개</span></>
          )}
        </div>

        {/* 카드 그리드 */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}

        {/* 활동이 0개일 때 */}
        {!loading && !error && activities.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            아직 등록된 활동이 없어요.
          </div>
        )}
      </main>
    </div>
  )
}

export default App