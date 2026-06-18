import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAdmin } from '../utils/auth'
import { getReports, updateReportStatus, deleteReport } from '../utils/report'

function AdminPage() {
  const navigate = useNavigate()
  const [reports, setReports] = useState(() => getReports())
  const [editingId, setEditingId] = useState(null)
  const [comment, setComment] = useState('')

  if (!isAdmin()) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <span className="text-5xl">🚫</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2">
            접근 권한이 없습니다
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            관리자 페이지는 관리자 계정으로만 접근할 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 font-medium"
          >
            메인으로
          </button>
        </div>
      </main>
    )
  }

  const refresh = () => setReports(getReports())

  const handleApprove = (id) => {
    updateReportStatus(id, '승인', comment)
    setEditingId(null)
    setComment('')
    refresh()
  }

  const handleReject = (id) => {
    updateReportStatus(id, '반려', comment)
    setEditingId(null)
    setComment('')
    refresh()
  }

  const handleDelete = (id) => {
    if (!confirm('이 제보를 완전히 삭제하시겠어요?')) return
    deleteReport(id)
    refresh()
  }

  const pending = reports.filter(r => r.status === '대기')
  const reviewed = reports.filter(r => r.status !== '대기')

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
        <p className="text-sm text-gray-600 mt-2">활동 제보를 검토하고 승인/반려할 수 있습니다.</p>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="text-sm text-yellow-800">대기</div>
          <div className="text-3xl font-bold text-yellow-700 mt-1">{pending.length}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-sm text-green-800">승인</div>
          <div className="text-3xl font-bold text-green-700 mt-1">
            {reports.filter(r => r.status === '승인').length}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="text-sm text-red-800">반려</div>
          <div className="text-3xl font-bold text-red-700 mt-1">
            {reports.filter(r => r.status === '반려').length}
          </div>
        </div>
      </div>

      {/* 대기 중인 제보 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          ⏳ 검토 대기 ({pending.length})
        </h2>
        {pending.length > 0 ? (
          <div className="space-y-3">
            {pending.map(r => (
              <div key={r.id} className="bg-white border border-yellow-300 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{r.title}</h4>
                  <div className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleString()}
                  </div>
                </div>
                {r.organization && (
                  <div className="text-sm text-gray-600 mb-1">기관: {r.organization}</div>
                )}
                <a 
                  href={r.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-purple-700 hover:underline inline-block mb-2"
                >
                  {r.applyLink} ↗
                </a>
                {r.description && (
                  <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded p-2">{r.description}</p>
                )}
                
                {editingId === r.id ? (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                      placeholder="검토 코멘트 (선택)"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="flex-1 bg-green-600 text-white py-1.5 rounded text-sm hover:bg-green-700"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleReject(r.id)}
                        className="flex-1 bg-red-600 text-white py-1.5 rounded text-sm hover:bg-red-700"
                      >
                        반려
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setComment('') }}
                        className="flex-1 bg-gray-200 text-gray-700 py-1.5 rounded text-sm hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingId(r.id)}
                    className="mt-3 bg-purple-700 text-white px-4 py-1.5 rounded text-sm hover:bg-purple-800"
                  >
                    검토하기
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            검토 대기 중인 제보가 없어요.
          </div>
        )}
      </section>

      {/* 검토 완료 */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          ✅ 검토 완료 ({reviewed.length})
        </h2>
        {reviewed.length > 0 ? (
          <div className="space-y-2">
            {reviewed.map(r => (
              <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm">{r.title}</h4>
                      <span className={
                        r.status === '승인'
                          ? 'text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded'
                          : 'text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded'
                      }>
                        {r.status}
                      </span>
                    </div>
                    {r.adminComment && (
                      <p className="text-sm text-gray-600 mt-1">💬 {r.adminComment}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500 text-sm">
            검토 완료된 제보가 없어요.
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminPage