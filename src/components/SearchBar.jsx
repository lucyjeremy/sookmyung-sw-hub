function SearchBar({ value, onChange }) {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="활동 제목으로 검색..."
        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        🔍
      </span>
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default SearchBar