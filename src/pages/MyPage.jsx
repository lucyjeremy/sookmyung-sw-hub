import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { getBookmarks } from '../utils/bookmark'
import { getReviews } from '../utils/review'
import { getActivityIdsByStatus, STATUS_OPTIONS } from '../utils/application'
import ActivityCard from '../components/ActivityCard'
import ProfileEditor from '../components/ProfileEditor'
import { getMyReports } from '../utils/report'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'  // 이미 있을 수도 있음. 없으면 맨 위 import에 추가
import { getCurrentUser } from '../utils/auth'  // 맨 위 import에 추가

const COLORS = ['#7c3aed', '#2563eb', '#16a34a', '#ea580c', '#dc2626', '#0891b2', '#a855f7']

function MyPage({ activities }) {
  const me = getCurrentUser()
  
  if (!me) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <span className="text-5xl">🔒</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">
            로그인이 필요해요
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            마이페이지는 로그인한 사용자만 이용할 수 있습니다.
          </p>
          <a 
            href="/login" 
            className="inline-block bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 font-medium"
          >
            로그인하러 가기
          </a>
        </div>
      </main>
    )
  }

  const bookmarkIds = getBookmarks()
  const reviews = getReviews()
  const reports = getMyReports(me.email)

  // 상태별 활동 목록
  const activitiesByStatus = useMemo(() => {
    const result = {}
    STATUS_OPTIONS.forEach(status => {
      const ids = getActivityIdsByStatus(status)
      result[status] = activities.filter(a => ids.includes(a.id))
    })
    return result
  }, [activities])

  const completedActivities = activitiesByStatus['활동완료']

  // 북마크한 활동들
  const bookmarkedActivities = useMemo(
    () => activities.filter(a => bookmarkIds.includes(a.id)),
    [activities, bookmarkIds]
  )

  // 세부 분야 통계 (참여한 활동 기준)
  const fieldStats = useMemo(() => {
    const counts = {}
    completedActivities.forEach(a => {
      const fields = (a.field || '').split(',').map(s => s.trim()).filter(Boolean)
      fields.forEach(f => {
        counts[f] = (counts[f] || 0) + 1
      })
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [completedActivities])

  // 활동 히트맵 데이터 (월별)
  const monthlyHeatmap = useMemo(() => {
    const counts = {}
    completedActivities.forEach(a => {
      const month = a.startDate?.slice(0, 7) // "2026-06"
      if (month) counts[month] = (counts[month] || 0) + 1
    })
    return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b))
  }, [completedActivities])

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>

      {/* 내 정보 수정 */}
      <ProfileEditor />

      {/* 요약 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">북마크</div>
          <div className="text-3xl font-bold text-purple-700 mt-1">
            {bookmarkedActivities.length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">신청완료</div>
          <div className="text-3xl font-bold text-blue-700 mt-1">
            {activitiesByStatus['신청완료'].length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">활동중</div>
          <div className="text-3xl font-bold text-orange-600 mt-1">
            {activitiesByStatus['활동중'].length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">활동완료</div>
          <div className="text-3xl font-bold text-green-700 mt-1">
            {activitiesByStatus['활동완료'].length}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="text-sm text-gray-500">작성한 후기</div>
          <div className="text-3xl font-bold text-pink-700 mt-1">
            {reviews.length}
          </div>
        </div>
      </div>

      {/* 분야 비율 차트 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          활동완료한 활동의 분야 비율
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
            아직 활동완료한 활동이 없어요. 활동 카드에서 [활동완료] 버튼을 눌러보세요.
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

      {/* 신청 현황 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          신청 현황
        </h2>
        <div className="space-y-6">
          {STATUS_OPTIONS.map(status => (
            <div key={status}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {status} ({activitiesByStatus[status].length})
              </h3>
              {activitiesByStatus[status].length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activitiesByStatus[status].map(a => (
                    <ActivityCard key={a.id} activity={a} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-4 text-center text-gray-500 text-sm">
                  해당하는 활동이 없어요.
                </div>
              )}
            </div>
          ))}
        </div>
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

      {/* 활동 제보 결과 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            활동 제보 결과 ({reports.length})
          </h2>
          <Link to="/report" className="text-sm text-purple-700 hover:underline">
            제보하기 →
          </Link>
        </div>
        {reports.length > 0 ? (
          <div className="space-y-2">
            {reports.map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{r.title}</h4>
                      <span className={
                        r.status === '대기' 
                          ? 'text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded'
                          : 'text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded'
                      }>
                        {r.status}
                      </span>
                    </div>
                    {r.organization && (
                      <div className="text-xs text-gray-500 mt-1">{r.organization}</div>
                    )}
                    {r.adminComment && (
                      <div className="mt-2 bg-gray-50 rounded p-2 text-xs text-gray-700">
                        💬 관리자: {r.adminComment}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            아직 제보한 활동이 없어요. <Link to="/report" className="text-purple-700 hover:underline">제보하러 가기</Link>
          </div>
        )}
      </section>

    </main>
  )
}

export default MyPage