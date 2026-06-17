import { useState, useMemo } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

function CalendarPage({ activities }) {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const dateToString = (date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const activitiesByDate = useMemo(() => {
    const map = {}
    activities.forEach(a => {
      const startDate = a.startDate?.slice(0, 10)
      const endDate = a.endDate?.slice(0, 10)
      const applyEnd = a.applyEnd?.slice(0, 10)
      const dates = [startDate, endDate, applyEnd].filter(Boolean)
      const uniqueDates = [...new Set(dates)]
      uniqueDates.forEach(date => {
        if (!map[date]) map[date] = []
        if (!map[date].find(x => x.id === a.id)) {
          map[date].push(a)
        }
      })
    })
    return map
  }, [activities])

  const selectedDateStr = dateToString(selectedDate)
  const activitiesForSelectedDate = activitiesByDate[selectedDateStr] || []

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null
    const dateStr = dateToString(date)
    const count = (activitiesByDate[dateStr] || []).length
    if (count === 0) return null
    return (
      <div className="text-xs text-purple-700 font-semibold mt-1">
        • {count}
      </div>
    )
  }

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return ''
    const dateStr = dateToString(date)
    return activitiesByDate[dateStr]?.length > 0 ? 'has-activity' : ''
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">활동 캘린더</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              locale="ko-KR"
              calendarType="gregory"
            />
          </div>
          <div className="mt-3 text-xs text-gray-500">
            ※ 활동 시작일 · 종료일 · 신청 마감일이 표시됩니다.
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {selectedDate.toLocaleDateString('ko-KR', { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              활동 {activitiesForSelectedDate.length}개
            </div>
            
            {activitiesForSelectedDate.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {activitiesForSelectedDate.map(a => (
                  <div key={a.id} className="border border-gray-200 rounded-lg p-3 hover:border-purple-500 transition">
                    <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                      {a.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {a.organization}
                    </p>
                    <div className="mt-2 text-xs space-y-1">
                      <div>
                        <span className="text-gray-400">활동: </span>
                        <span className="text-gray-700">
                          {a.startDate?.slice(0, 10)} ~ {a.endDate?.slice(0, 10)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">신청 마감: </span>
                        <span className="text-gray-700">
                          {a.applyEnd?.slice(0, 10)}
                        </span>
                      </div>
                    </div>
                    <a 
                      href={a.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-center text-xs bg-purple-700 text-white py-1 rounded hover:bg-purple-800"
                    >
                      신청하기 ↗
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-8">
                선택한 날짜에 활동이 없어요.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default CalendarPage