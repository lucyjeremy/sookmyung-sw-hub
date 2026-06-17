import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getBookmarks } from '../utils/bookmark'
import { getReviews } from '../utils/review'
import ActivityCard from '../components/ActivityCard'

const COLORS = ['#7c3aed', '#2563eb', '#16a34a', '#ea580c', '#dc2626', '#0891b2', '#a855f7']

function MyPage({ activities }) {
  const bookmarkIds = getBookmarks()
  const reviews = getReviews()

  // 북마크한 활동들
  const bookmarkedActivities = useMemo(
    () => activities.filter(a => bookmarkIds.includes(a.id)),
    [activities, bookmarkIds]
  )

  // 후기 작성한 활동들 = "참여한 활동"으로 간주
  const reviewedActivities = useMemo(
    () => activities.filter(a => reviews.some(r => r.activityId === a.id)),
    [activities, reviews]
  )

  // 세부 분야 통계 (참여한 활동 기준)
  const fieldStats = useMemo(() => {
    const counts = {}
    reviewedActivities.forEach(a => {
      const fields = (a.field || '').split(',').map(s => s.trim()).filter(Boolean)
      fields.forEach(f => {
        counts[f] = (counts[f] || 0) + 1
      })
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [reviewedActivities])

  // 활동 히트맵 데이터 (월별)
  const monthlyHeatmap = useMemo(() => {
    const counts = {}
    reviewedActivities.forEach(a => {
      const month = a.startDate?.slice(0, 7) // "2026-06"
      if (month) counts[month] = (counts[month] || 0) + 1
    })
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
  }, [reviewedActivities])

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">북마크</div>
          <div className="text-3xl font-bold text-purple-700 mt-1">
            {bookmarkedActivities.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">참여한 활동</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">
            {reviewedActivities.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">작성한 후기</div>
          <div className="text-3xl font-bold text-green-700 mt-1">
            {reviews.length}
          </div>
        </div>
      </div>

      {/* 분야 비율 차트 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          참여한 활동의 분야 비율
        </h2>
        {fieldStats.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={fieldStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {fieldStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            아직 참여한 활동이 없어요. 활동 후기를 작성하면 통계가 표시됩니다.
          </div>
        )}
      </section>

      {/* 월별 활동 히트맵 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          월별 활동 히트맵
        </h2>
        {monthlyHeatmap.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {monthlyHeatmap.map(([month, count]) => {
              const intensity = Math.min(count / 3, 1)
              return (
                <div 
                  key={month}
                  className="flex flex-col items-center"
                >
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: `rgba(124, 58, 237, ${0.3 + intensity * 0.7})` }}
                  >
                    {count}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{month}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            아직 활동 기록이 없어요.
          </div>
        )}
      </section>

      {/* 북마크 목록 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          북마크한 활동 ({bookmarkedActivities.length})
        </h2>
        {bookmarkedActivities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedActivities.map(a => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            북마크한 활동이 없어요. 활동 목록에서 ☆를 눌러보세요.
          </div>
        )}
      </section>

      {/* 내 후기 목록 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          작성한 후기 ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 text-sm">{r.activityTitle}</h4>
                <div className="text-yellow-500 text-sm mt-1">
                  {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                </div>
                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{r.content}</p>
                <div className="text-xs text-gray-400 mt-2">
                  {new Date(r.createdAt).toLocaleDateString()}
                  {r.updatedAt && ' (수정됨)'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            아직 후기가 없어요.
          </div>
        )}
      </section>

    </main>
  )
}

export default MyPage