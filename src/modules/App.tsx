import React from 'react'
import { Home } from './Home'

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl p-6">
        <Home />
      </div>
    </div>
  )
}
