import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup, login } from '../utils/auth'

function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', passwordCheck: '' })
  const [error, setError] = useState('')

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.')
      return
    }
    if (form.password !== form.passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      signup({ name: form.name, email: form.email, password: form.password })
      login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          회원가입
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              이름
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              이메일
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="user@sm.ac.kr"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              비밀번호
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              value={form.passwordCheck}
              onChange={(e) => handleChange('passwordCheck', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 rounded p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded-lg hover:bg-purple-800 font-medium"
          >
            가입하기
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          이미 회원이신가요?{' '}
          <Link to="/login" className="text-purple-700 hover:underline font-medium">
            로그인
          </Link>
        </div>
      </div>
    </main>
  )
}

export default SignupPage