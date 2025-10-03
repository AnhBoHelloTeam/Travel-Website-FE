import React from 'react'
import { Home } from './Home'
import { AuthProvider } from './auth/AuthContext'
import { Login } from './auth/Login'
import { Register } from './auth/Register'

export const App: React.FC = () => {
  const [view, setView] = React.useState<'home' | 'login' | 'register'>('home')

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Travel Website</h1>
            <div className="space-x-2">
              <button className="px-2 py-1 border rounded" onClick={()=>setView('home')}>Home</button>
              <button className="px-2 py-1 border rounded" onClick={()=>setView('login')}>Login</button>
              <button className="px-2 py-1 border rounded" onClick={()=>setView('register')}>Register</button>
            </div>
          </div>

          {view === 'home' && <Home />}
          {view === 'login' && <Login />}
          {view === 'register' && <Register />}
        </div>
      </div>
    </AuthProvider>
  )
}
