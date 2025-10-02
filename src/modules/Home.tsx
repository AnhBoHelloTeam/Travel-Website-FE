import React from 'react'
import axios from 'axios'

export const Home: React.FC = () => {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = React.useState<string>('')

  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const checkHealth = async () => {
    try {
      setStatus('loading')
      const res = await axios.get(`${backendUrl}/health`)
      setStatus('ok')
      setMessage(res.data?.message || 'OK')
    } catch (e: any) {
      setStatus('error')
      setMessage(e?.message || 'Failed to connect')
    }
  }

  React.useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Travel Website</h1>
      <div className="rounded border p-4 bg-white">
        <div className="mb-2 font-semibold">Backend health:</div>
        <div className={`mb-2 ${status === 'ok' ? 'text-green-600' : status === 'error' ? 'text-red-600' : ''}`}>
          {status === 'loading' ? 'Checking...' : message || 'Idle'}
        </div>
        <button onClick={checkHealth} className="px-3 py-2 bg-blue-600 text-white rounded">
          Recheck
        </button>
      </div>
    </div>
  )
}
