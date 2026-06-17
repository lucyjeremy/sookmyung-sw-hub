import { useState } from 'react'
import { isDeadlineSoon } from '../utils/date'
import { isBookmarked, toggleBookmark } from '../utils/bookmark'
import { getReviewByActivityId, addReview, updateReview, deleteReview } from '../utils/review'
import ReviewForm from './ReviewForm'
import ReviewItem from './ReviewItem'

function ActivityCard({ activity }) {
  const deadlineSoon = isDeadlineSoon(activity.applyEnd)
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(activity.id))

  const [review, setReview] = useState(() => getReviewByActivityId(activity.id))
  const [showForm, setShowForm] = useState(false)

  const handleBookmarkClick = () => {
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition flex flex-col">
      
      {/* 포스터 이미지 */}
      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
        {activity.image ? (
          <img 
            src={activity.image} 
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이미지 없음
          </div>
        )}
      </div>

      {/* 내용 영역 */}
      <div className="p-4 flex flex-col flex-1">
        
        {/* 뱃지 + 북마크 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-wrap gap-1">
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {activity.source}
            </span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              {activity.field}
            </span>
            {deadlineSoon && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                마감 임박
              </span>
            )}
          </div>
          <button 
            onClick={handleBookmarkClick} 
            className={
              bookmarked
              ? 'text-yellow-500 text-xl'
              : 'text-gray-300 hover:text-yellow-500 text-xl'
            }
          >
            {bookmarked ? '★' : '☆'}
          </button>
        </div>

        {/* 제목 + 기관 */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
          {activity.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">
          {activity.organization}
        </p>

        {/* 날짜 정보 */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3 mt-auto">
          <div>
            <div className="text-gray-400">활동 기간</div>
            <div className="text-gray-700">
              {activity.startDate?.slice(0, 10)}<br />
              ~ {activity.endDate?.slice(5, 10)}
            </div>
          </div>
          <div>
            <div className="text-gray-400">신청 기간</div>
            <div className="text-gray-700">
              {activity.applyStart?.slice(0, 10)}<br />
              ~ {activity.applyEnd?.slice(5, 10)}
            </div>
          </div>
        </div>

        {/* 모집 인원 */}
        <div className="text-xs text-gray-600 mb-3">
          모집 인원: <span className="font-semibold">{activity.capacity}명</span>
        </div>

        {/* 신청하기 버튼 */}
        <a 
          href={activity.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 font-medium text-sm"
        >
          신청하기 ↗
        </a>

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
          </button>
        )}
      </div>
            </div>
          </div>
        )
      }

      export default ActivityCard