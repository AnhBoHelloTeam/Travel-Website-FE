import React from 'react'
import { useAuth } from './AuthContext'

export const Register: React.FC = () => {
  const { register } = useAuth()
  const [form, setForm] = React.useState({
    email: '', password: '', role: 'customer',
    profile: { firstName: '', lastName: '', phone: '', address: '' }
  })
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')

  const onChange = (path: string, value: string) => {
    if (path.startsWith('profile.')) {
      const key = path.split('.')[1] as keyof typeof form.profile
      setForm(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }))
    } else {
      setForm(prev => ({ ...prev, [path]: value }))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Register failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 bg-white border rounded p-4">
      <h2 className="text-xl font-semibold">Register</h2>
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Role</label>
        <select value={form.role} onChange={e=>onChange('role', e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="customer">Customer</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input value={form.email} onChange={e=>onChange('email', e.target.value)} className="w-full border rounded px-3 py-2" type="email" required />
      </div>
      <div>
        <label className="block text-sm mb-1">Password</label>
        <input value={form.password} onChange={e=>onChange('password', e.target.value)} className="w-full border rounded px-3 py-2" type="password" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">First name</label>
          <input value={form.profile.firstName} onChange={e=>onChange('profile.firstName', e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Last name</label>
          <input value={form.profile.lastName} onChange={e=>onChange('profile.lastName', e.target.value)} className="w-full border rounded px-3 py-2" required />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Phone</label>
        <input value={form.profile.phone} onChange={e=>onChange('profile.phone', e.target.value)} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm mb-1">Address</label>
        <input value={form.profile.address} onChange={e=>onChange('profile.address', e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>

      <button disabled={loading} className="px-3 py-2 bg-green-600 text-white rounded">{loading ? '...' : 'Register'}</button>
    </form>
  )
}

