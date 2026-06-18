import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser, logout, isAdmin } from '../utils/auth'  // isAdmin 추가

function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => getCurrentUser())
  const [admin, setAdmin] = useState(() => isAdmin())

  // 다른 페이지에서 로그인/로그아웃 시 Navbar에도 반영
  useEffect(() => {
    const interval = setInterval(() => {
      setUser(getCurrentUser())
      setAdmin(isAdmin())
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold text-purple-700">
            숙명 SW 비교과 Hub
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 hover:text-purple-700 font-medium">
            활동 목록
          </Link>
          <Link to="/calendar" className="text-gray-700 hover:text-purple-700 font-medium">
            캘린더
          </Link>
          <Link to="/report" className="text-gray-700 hover:text-purple-700 font-medium">
            활동 제보
          </Link>
          <Link to="/mypage" className="text-gray-700 hover:text-purple-700 font-medium">
            마이페이지
          </Link>
          <Link to="/chat" className="text-gray-700 hover:text-purple-700 font-medium">
            채팅
          </Link>
          <Link to="/mypage" className="text-gray-700 hover:text-purple-700 font-medium">
            마이페이지
          </Link>
            {admin && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-bold">
                관리자
              </Link>
            )}
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700 hidden md:inline">
              <span className="font-semibold">{user.name}</span> 님
            </span>
            <button 
              onClick={handleLogout}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 font-medium text-sm"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <Link 
            to="/login"
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 font-medium text-sm"
          >
            로그인
          </Link>
        )}

      </div>
    </nav>
  )
}

export default Navbar