function SiteLinks() {
  const sites = [
    {
      name: '와이즈 (WISE)', 
      url: 'https://wise.sookmyung.ac.kr/ko/' 
    },
    {
      name: '국제협력팀', 
      url: 'https://exchange.sookmyung.ac.kr/exchange/index.do' 
    },
    { 
      name: '현장실습지원센터', 
      url: 'https://intern.sookmyung.ac.kr/index.do' 
    }
  ]

  return (
    <section className="mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">
        활동 사이트 바로가기
      </h2>
      
      <div className="flex flex-wrap gap-2">
        {sites.map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
          >
            <span>{site.icon}</span>
            <span className="text-sm font-medium text-gray-700">
              {site.name}
            </span>
            <span className="text-xs text-gray-400">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export default SiteLinks