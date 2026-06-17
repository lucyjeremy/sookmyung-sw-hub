const USER_KEY = 'current_user'
const USERS_KEY = 'registered_users'

// 현재 로그인된 사용자
export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

// 가입된 사용자 목록
export function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// 회원가입
export function signup({ email, password, name }) {
  const users = getUsers()
  if (users.find(u => u.email === email)) {
    throw new Error('이미 가입된 이메일입니다.')
  }
  const newUser = { email, password, name, createdAt: new Date().toISOString() }
  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

// 로그인
export function login(email, password) {
  const user = getUsers().find(u => u.email === email && u.password === password)
  if (!user) {
    throw new Error('이메일 또는 비밀번호가 일치하지 않습니다.')
  }
  const { password: _, ...safeUser } = user
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

// 로그아웃
export function logout() {
  localStorage.removeItem(USER_KEY)
}

// 회원정보 수정 (이름, 비밀번호)
export function updateProfile({ name, currentPassword, newPassword }) {
  const current = getCurrentUser()
  if (!current) throw new Error('로그인이 필요합니다.')

  const users = getUsers()
  const idx = users.findIndex(u => u.email === current.email)
  if (idx === -1) throw new Error('사용자를 찾을 수 없습니다.')

  // 비밀번호 바꾸려면 현재 비번 확인
  if (newPassword) {
    if (users[idx].password !== currentPassword) {
      throw new Error('현재 비밀번호가 일치하지 않습니다.')
    }
    if (newPassword.length < 4) {
      throw new Error('새 비밀번호는 4자 이상이어야 합니다.')
    }
    users[idx].password = newPassword
  }

  if (name) {
    users[idx].name = name
  }

  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // 현재 로그인된 사용자 정보도 갱신
  const { password: _, ...safeUser } = users[idx]
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  return safeUser
}

// 회원 탈퇴 (모든 사용자 데이터 삭제)
export function deleteAccount() {
  const current = getCurrentUser()
  if (!current) throw new Error('로그인이 필요합니다.')

  const users = getUsers().filter(u => u.email !== current.email)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  localStorage.removeItem(USER_KEY)

  // 본인이 만든 데이터도 다 삭제
  localStorage.removeItem('bookmarked_activities')
  localStorage.removeItem('activity_reviews')
  localStorage.removeItem('application_status')
  localStorage.removeItem('activity_reports')
}