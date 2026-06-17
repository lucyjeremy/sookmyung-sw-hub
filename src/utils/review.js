const STORAGE_KEY = 'activity_reviews'

// 전체 후기 가져오기 (객체 배열)
export function getReviews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 특정 활동의 후기 가져오기
export function getReviewByActivityId(activityId) {
  return getReviews().find(r => r.activityId === activityId) || null
}

// 후기 추가
export function addReview(activityId, activityTitle, content, rating) {
  const reviews = getReviews()
  const newReview = {
    id: Date.now().toString(),
    activityId,
    activityTitle,
    content,
    rating,
    createdAt: new Date().toISOString(),
  }
  reviews.push(newReview)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  return newReview
}

// 후기 수정
export function updateReview(reviewId, content, rating) {
  const reviews = getReviews()
  const idx = reviews.findIndex(r => r.id === reviewId)
  if (idx === -1) return null
  reviews[idx] = { 
    ...reviews[idx], 
    content, 
    rating,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  return reviews[idx]
}

// 후기 삭제
export function deleteReview(reviewId) {
  const reviews = getReviews().filter(r => r.id !== reviewId)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
}