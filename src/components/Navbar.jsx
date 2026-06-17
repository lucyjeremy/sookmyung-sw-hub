import { Link } from 'react-router-dom'

function Navbar() {
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
          <Link to="/mypage" className="text-gray-700 hover:text-purple-700 font-medium">
            마이페이지
          </Link>
        </div>

        <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 font-medium">
          로그인
        </button>

      </div>
    </nav>
  )
}

export default Navbar