import { useState, useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SiteLinks from './components/SiteLinks'
import ActivityCard from './components/ActivityCard'
import FilterBar from './components/FilterBar'
import MyPage from './pages/MyPage'
import SearchBar from './components/SearchBar'
import ReportPage from './pages/ReportPage'
import CalendarPage from './pages/CalendarPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { fetchActivities } from './api/activities'
import { applyFiltersAndSort } from './utils/filter'

function HomePage({ activities, loading, error }) {
  const [selected, setSelected] = useState({})
  const [keyword, setKeyword] = useState('')

  const handleToggle = (group, option) => {
    setSelected(prev => {
      const current = prev[group] || []
      const isOn = current.includes(option)
      if (group === '정렬') {
        return { ...prev, [group]: isOn ? [] : [option] }
      }
      return {
        ...prev,
        [group]: isOn ? current.filter(o => o !== option) : [...current, option],
      }
    })
  }

  const visibleActivities = useMemo(
    () => applyFiltersAndSort(activities, selected, keyword),
    [activities, selected, keyword]
  )

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <SiteLinks />
      <FilterBar selected={selected} onToggle={handleToggle} />
      <SearchBar value={keyword} onChange={setKeyword} />

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

      {!loading && !error && visibleActivities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}

      {!loading && !error && visibleActivities.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          {activities.length === 0 
            ? '아직 등록된 활동이 없어요.' 
            : '조건에 맞는 활동이 없어요. 필터를 조정해보세요.'}
        </div>
      )}
    </main>
  )
}

function App() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={<HomePage activities={activities} loading={loading} error={error} />} 
          />
          <Route 
            path="/mypage" 
            element={<MyPage activities={activities} />} 
          />
          <Route 
            path="/report" 
            element={<ReportPage />} 
          />
          <Route 
            path="/calendar" 
            element={<CalendarPage activities={activities} />} 
          />
          <Route 
            path="/login" 
            element={<LoginPage />} 
          />
          <Route 
            path="/signup" 
            element={<SignupPage />} 
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App