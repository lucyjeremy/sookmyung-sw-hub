import { useState } from 'react'

function ReviewForm({ initialContent = '', initialRating = 5, onSubmit, onCancel }) {
  const [content, setContent] = useState(initialContent)
  const [rating, setRating] = useState(initialRating)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim()) {
      alert('후기 내용을 입력해주세요.')
      return
    }
    onSubmit(content.trim(), rating)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 space-y-3">
      {/* 별점 */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          별점
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className={n <= rating ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 내용 */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-1">
          후기 내용
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="활동에 대한 솔직한 후기를 남겨주세요."
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 text-sm bg-purple-700 text-white rounded-lg hover:bg-purple-800"
        >
          저장
        </button>
      </div>
    </form>
  )
}

export default ReviewForm