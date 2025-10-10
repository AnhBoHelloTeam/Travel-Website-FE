import React from 'react'
import { Home } from './Home'
import { AuthProvider, useAuth } from './auth/AuthContext'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { SchedulesSearch } from './schedules/SchedulesSearch'
import { ScheduleDetail } from './schedules/ScheduleDetail'
import { BookingFlow } from './booking/BookingFlow'
import { MyTickets } from './tickets/MyTickets'
import { AdminDashboard } from './admin/AdminDashboard'
import { BusinessDashboard } from './business/BusinessDashboard'

const AppContent: React.FC = () => {
  const [view, setView] = React.useState<'home' | 'login' | 'register' | 'schedules' | 'scheduleDetail' | 'booking' | 'myTickets' | 'admin' | 'business'>('home')
  const [selectedScheduleId, setSelectedScheduleId] = React.useState<string | null>(null)
  const { user } = useAuth()

  const goDetail = (id: string) => {
    setSelectedScheduleId(id)
    setView('scheduleDetail')
  }

  const goBooking = (id: string) => {
    setSelectedScheduleId(id)
    setView('booking')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-5xl p-4 flex items-center justify-between">
          <div className="font-bold text-xl">Travel Website</div>
          <nav className="space-x-3 text-sm">
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('home')}>Home</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('schedules')}>Schedules</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('myTickets')}>My Tickets</button>
            {user?.role === 'admin' && (
              <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('admin')}>Admin</button>
            )}
            {user?.role === 'business' && (
              <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('business')}>Business</button>
            )}
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('login')}>Login</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100" onClick={()=>setView('register')}>Register</button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-6 flex-1 w-full">
        {view === 'home' && <Home onNavigate={setView} />}
        {view === 'schedules' && <SchedulesSearch onSelect={goDetail} />}
        {view === 'scheduleDetail' && selectedScheduleId && (
          <ScheduleDetail id={selectedScheduleId} onBack={()=>setView('schedules')} onBook={()=>goBooking(selectedScheduleId)} />
        )}
        {view === 'booking' && selectedScheduleId && (
          <BookingFlow scheduleId={selectedScheduleId} onBack={()=>setView('schedules')} onSuccess={()=>setView('myTickets')} />
        )}
        {view === 'myTickets' && <MyTickets />}
        {view === 'admin' && <AdminDashboard />}
        {view === 'business' && <BusinessDashboard />}
        {view === 'login' && <Login />}
        {view === 'register' && <Register />}
      </main>

      <footer className="bg-white border-t">
        <div className="mx-auto max-w-5xl p-4 text-xs text-gray-600 flex items-center justify-between">
          <div>© {new Date().getFullYear()} Travel Website</div>
          <div className="space-x-3">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
