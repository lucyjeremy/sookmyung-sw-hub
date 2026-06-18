import { useState } from 'react'
import { isDeadlineSoon, getDaysUntilDeadline } from '../utils/date'
import { isBookmarked, toggleBookmark } from '../utils/bookmark'
import { getReviewByActivityId, addReview, updateReview, deleteReview } from '../utils/review'
import { getStatus, setStatus, STATUS_OPTIONS } from '../utils/application'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'
import { getCurrentUser } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

function ActivityCard({ activity }) {
  const deadlineSoon = isDeadlineSoon(activity.applyEnd)
  const daysLeft = getDaysUntilDeadline(activity.applyEnd)
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(activity.id))
  const [appStatus, setAppStatus] = useState(() => getStatus(activity.id))
  const [review, setReview] = useState(() => getReviewByActivityId(activity.id))
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const isLoggedIn = !!getCurrentUser()

  const handleStatusClick = (status) => {
    if (!isLoggedIn) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?')) {
        navigate('/login')
      }
      return
    }
    const newStatus = setStatus(activity.id, status)
    setAppStatus(newStatus)
  }

  const handleBookmarkClick = () => {
    if (!isLoggedIn) {
      if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동할까요?')) {
        navigate('/login')
      }
      return
    }
    toggleBookmark(activity.id)
    setBookmarked(prev => !prev)
  }

  const handleAddReview = (content, rating) => {
    const newReview = addReview(activity.id, activity.title, content, rating)
    setReview(newReview)
    setShowForm(false)
  }

  const handleUpdateReview = (reviewId, content, rating) => {
    const updated = updateReview(reviewId, content, rating)
    setReview(updated)
  }

  const handleDeleteReview = (reviewId) => {
    deleteReview(reviewId)
    setReview(null)
  }

  // 분야를 쉼표로 분리 (여러 태그 표시)
  const fields = (activity.field || '').split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div 
      className={
        bookmarked
          ? 'bg-white rounded-xl border-2 border-yellow-400 overflow-hidden hover:shadow-lg transition flex flex-col'
          : 'bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition flex flex-col'
      }
    >
      
      {/* 포스터 이미지 */}
      <div className="aspect-[4/3] bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden relative">
        {activity.image ? (
          <img 
            src={activity.image} 
            alt={activity.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-purple-400 p-4">
            <span className="text-4xl mb-2">📚</span>
            <span className="text-xs text-center line-clamp-2">{activity.title}</span>
          </div>
        )}
        
        {/* 마감 임박 오버레이 */}
        {deadlineSoon && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
            {daysLeft === 0 ? '오늘 마감' : `D-${daysLeft}`}
          </div>
        )}

        {/* 현재 상태 오버레이 */}
        {appStatus && (
          <div className="absolute top-2 right-2 bg-purple-700 text-white text-xs font-bold px-2 py-1 rounded shadow">
            {appStatus}
          </div>
        )}
      </div>

      {/* 내용 영역 */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* 뱃지 + 북마크 */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex flex-wrap gap-1">
            {activity.source && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-medium">
                {activity.source}
              </span>
            )}
            {fields.map(f => (
              <span key={f} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                {f}
              </span>
            ))}
            {activity.team && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium">
                {activity.team}
              </span>
            )}
          </div>
          <button 
            onClick={handleBookmarkClick} 
            className={
              bookmarked
                ? 'text-yellow-500 text-xl shrink-0'
                : 'text-gray-300 hover:text-yellow-500 text-xl shrink-0'
            }
            aria-label="북마크"
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>

        {/* 제목 + 기관 */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1 text-sm">
          {activity.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          {activity.organization}
        </p>

        {/* 날짜 정보 */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3 mt-auto">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-400 mb-0.5">활동 기간</div>
            <div className="text-gray-800 font-medium">
              {activity.startDate?.slice(0, 10)}<br />
              ~ {activity.endDate?.slice(5, 10)}
            </div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-gray-400 mb-0.5">신청 마감</div>
            <div className="text-gray-800 font-medium">
              {activity.applyEnd?.slice(0, 10)}
              {daysLeft !== null && daysLeft >= 0 && (
                <div className={daysLeft <= 3 ? 'text-red-600 font-bold' : 'text-gray-500'}>
                  {daysLeft === 0 ? '오늘' : `${daysLeft}일 남음`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 모집 인원 */}
        {activity.capacity && (
          <div className="text-xs text-gray-600 mb-3">
            모집 인원: <span className="font-semibold text-gray-900">{activity.capacity}명</span>
          </div>
        )}

        {/* 신청 상태 토글 */}
        <div className="flex gap-1 mb-2">
          {STATUS_OPTIONS.map(status => (
            <button
              key={status}
              onClick={() => handleStatusClick(status)}
              className={
                appStatus === status
                  ? 'flex-1 text-xs py-1.5 rounded bg-purple-700 text-white font-medium'
                  : 'flex-1 text-xs py-1.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            >
              {status}
            </button>
          ))}
        </div>

        {/* 신청하기 버튼 */}
        <a 
          href={activity.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 font-medium text-sm shadow-sm"
        >
          신청하기 ↗
        </a>

        {/* 후기 영역 (로그인 + 활동완료 상태일 때만) */}
        {isLoggedIn && (appStatus === '활동완료' || review) && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {review ? (
              <ReviewItem 
                review={review} 
                onUpdate={handleUpdateReview}
                onDelete={handleDeleteReview}
              />
            ) : showForm ? (
              <ReviewForm
                onSubmit={handleAddReview}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="w-full text-sm text-purple-700 hover:bg-purple-50 py-2 rounded-lg border border-purple-200"
              >
                ✏️ 후기 작성하기
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default ActivityCard