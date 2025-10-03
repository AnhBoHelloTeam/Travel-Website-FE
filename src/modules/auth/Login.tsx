import React from 'react'
import { useAuth } from './AuthContext'

export const Login: React.FC = () => {
  const { login } = useAuth()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white border rounded p-4">
      <h2 className="text-xl font-semibold">Login</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border rounded px-3 py-2" type="email" required />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} className="w-full border rounded px-3 py-2" type="password" required />
      </div>
      <button disabled={loading} className="px-3 py-2 bg-blue-600 text-white rounded">{loading ? '...' : 'Login'}</button>
    </form>
  )
}

