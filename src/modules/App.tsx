import React from 'react'
import { Home } from './Home'
import { AuthProvider } from './auth/AuthContext'
import { Login } from './auth/Login'
import { Register } from './auth/Register'
import { SchedulesSearch } from './schedules/SchedulesSearch'
import { ScheduleDetail } from './schedules/ScheduleDetail'
import { BookingFlow } from './booking/BookingFlow'
import { MyTickets } from './tickets/MyTickets'
import { AdminDashboard } from './admin/AdminDashboard'

export const App: React.FC = () => {
  const [view, setView] = React.useState<'home' | 'login' | 'register' | 'schedules' | 'scheduleDetail' | 'booking' | 'myTickets' | 'admin'>('home')
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
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Travel Website</h1>
            <div className="space-x-2">
              <button className="px-2 py-1 border rounded" onClick={()=>setView('home')}>Home</button>
              <button className="px-2 py-1 border rounded" onClick={()=>setView('schedules')}>Schedules</button>
              <button className="px-2 py-1 border rounded" onClick={()=>setView('myTickets')}>My Tickets</button>
              {user?.role === 'admin' && (
                <button className="px-2 py-1 border rounded bg-purple-100" onClick={()=>setView('admin')}>Admin</button>
              )}
              <button className="px-2 py-1 border rounded" onClick={()=>setView('login')}>Login</button>
              <button className="px-2 py-1 border rounded" onClick={()=>setView('register')}>Register</button>
            </div>
          </div>

          {view === 'home' && <Home />}
          {view === 'schedules' && <SchedulesSearch onSelect={goDetail} />}
          {view === 'scheduleDetail' && selectedScheduleId && (
            <ScheduleDetail id={selectedScheduleId} onBack={()=>setView('schedules')} onBook={()=>goBooking(selectedScheduleId)} />
          )}
          {view === 'booking' && selectedScheduleId && (
            <BookingFlow scheduleId={selectedScheduleId} onBack={()=>setView('schedules')} onSuccess={()=>setView('myTickets')} />
          )}
          {view === 'myTickets' && <MyTickets />}
          {view === 'admin' && <AdminDashboard />}
          {view === 'login' && <Login />}
          {view === 'register' && <Register />}
        </div>
      </div>
    </AuthProvider>
  )
}
