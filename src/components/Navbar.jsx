function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* 왼쪽: 로고 */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎓</span>
          <span className="text-xl font-bold text-purple-700">
            숙명 SW 비교과 Hub
          </span>
        </div>

        {/* 가운데: 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            활동 목록
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            캘린더
          </a>
          <a href="#" className="text-gray-700 hover:text-purple-700 font-medium">
            마이페이지
          </a>
        </div>

        {/* 오른쪽: 로그인 */}
        <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 font-medium">
          로그인
        </button>

      </div>
    </nav>
  )
}

export default Navbar