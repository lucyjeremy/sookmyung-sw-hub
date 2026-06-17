import { useState } from 'react'
import ReviewForm from './ReviewForm'

function ReviewItem({ review, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)

  if (editing) {
    return (
      <ReviewForm
        initialContent={review.content}
        initialRating={review.rating}
        onSubmit={(content, rating) => {
          onUpdate(review.id, content, rating)
          setEditing(false)
        }}
        onCancel={() => setEditing(false)}
      />
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">
            {review.activityTitle}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-yellow-500 text-sm">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
              {review.updatedAt && ' (수정됨)'}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setEditing(true)}
            className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
          >
            수정
          </button>
          <button
            onClick={() => {
              if (confirm('정말 삭제하시겠어요?')) onDelete(review.id)
            }}
            className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
          >
            삭제
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-wrap">
        {review.content}
      </p>
    </div>
  )
}

export default ReviewItem