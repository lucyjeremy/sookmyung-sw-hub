import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, updateProfile, deleteAccount } from '../utils/auth'

function ProfileEditor() {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const [name, setName] = useState(user?.name || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <p className="text-gray-600 mb-3">로그인이 필요합니다.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 text-sm"
        >
          로그인하러 가기
        </button>
      </div>
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    try {
      updateProfile({ 
        name, 
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined,
      })
      setMessage({ type: 'success', text: '정보가 수정되었습니다.' })
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleDelete = () => {
    if (!confirm('정말 회원 탈퇴하시겠어요?\n모든 북마크·후기·신청 현황 데이터가 삭제됩니다.')) return
    if (!confirm('한 번 더 확인합니다. 정말 탈퇴하시겠어요?')) return
    
    try {
      deleteAccount()
      alert('회원 탈퇴가 완료되었습니다.')
      navigate('/')
      window.location.reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">내 정보 수정</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            이메일
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">비밀번호를 바꾸려면 아래 두 칸을 채우세요.</p>
          
          <label className="text-sm font-semibold text-gray-700 block mb-1">
            현재 비밀번호
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500 mb-3"
          />

          <label className="text-sm font-semibold text-gray-700 block mb-1">
            새 비밀번호
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호 입력 (4자 이상)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {message.text && (
          <div className={
            message.type === 'success'
              ? 'text-sm text-green-700 bg-green-50 rounded p-2'
              : 'text-sm text-red-600 bg-red-50 rounded p-2'
          }>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 font-medium"
        >
          저장
        </button>
      </form>

      {/* 위험 구역: 회원 탈퇴 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-red-600 mb-2">위험 구역</h3>
        <p className="text-xs text-gray-500 mb-3">
          회원 탈퇴 시 모든 데이터(북마크·후기·신청 현황)가 영구 삭제됩니다.
        </p>
        <button
          onClick={handleDelete}
          className="w-full border border-red-300 text-red-600 py-2 rounded-lg hover:bg-red-50 font-medium text-sm"
        >
          회원 탈퇴
        </button>
      </div>
    </div>
  )
}

export default ProfileEditor