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