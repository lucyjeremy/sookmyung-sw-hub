import { useState } from 'react'
import { addReport, getReports, deleteReport } from '../utils/report'

function ReportPage() {
  const [reports, setReports] = useState(() => getReports())
  const [form, setForm] = useState({
    title: '',
    organization: '',
    applyLink: '',
    description: '',
  })

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.applyLink.trim()) {
      alert('제목과 링크는 필수입니다.')
      return
    }
    addReport(form)
    setReports(getReports())
    setForm({ title: '', organization: '', applyLink: '', description: '' })
    alert('제보 감사합니다! 관리자 검토 후 반영됩니다.')
  }

  const handleDelete = (id) => {
    if (confirm('제보를 삭제하시겠어요?')) {
      deleteReport(id)
      setReports(getReports())
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">활동 제보</h1>
        <p className="text-sm text-gray-600 mt-2">
          누락된 SW 비교과 활동이 있다면 알려주세요. 검토 후 추가됩니다.
        </p>
      </div>

      {/* 제보 폼 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            활동 제목 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="예: 2026 AI 캡스톤 디자인 경진대회"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            주관 기관
          </label>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => handleChange('organization', e.target.value)}
            placeholder="예: SW중심대학사업단"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            신청 페이지 링크 <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            value={form.applyLink}
            onChange={(e) => handleChange('applyLink', e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            추가 설명
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            placeholder="활동에 대한 간단한 설명을 적어주세요."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 font-medium"
        >
          제보 등록
        </button>
      </form>

      {/* 내 제보 내역 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          내 제보 내역 ({reports.length})
        </h2>
        {reports.length > 0 ? (
          <div className="space-y-2">
            {reports.map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{r.title}</h4>
                      <span className={
                        r.status === '대기' 
                          ? 'text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded'
                          : 'text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded'
                      }>
                        {r.status}
                      </span>
                    </div>
                    {r.organization && (
                      <div className="text-xs text-gray-500 mt-1">{r.organization}</div>
                    )}
                    {r.description && (
                      <p className="text-sm text-gray-700 mt-2">{r.description}</p>
                    )}
                    <a 
                      href={r.applyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-purple-700 hover:underline mt-1 inline-block"
                    >
                      {r.applyLink} ↗
                    </a>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(r.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            아직 제보한 활동이 없어요.
          </div>
        )}
      </section>
    </main>
  )
}

export default ReportPage