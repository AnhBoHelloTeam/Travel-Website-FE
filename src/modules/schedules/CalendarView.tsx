import React from 'react'
import axios from 'axios'

type Props = {
  onDateSelect: (date: string) => void
  selectedDate: string
}

export const CalendarView: React.FC<Props> = ({ onDateSelect, selectedDate }) => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
  const [availableDates, setAvailableDates] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)

  // Generate next 7 days (reduce burst requests)
  const generateDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  }

  const dates = generateDates()

  // Check which dates have available schedules (throttle with small batch)
  const checkAvailableDates = async () => {
    setLoading(true)
    try {
      const results: any[] = []
      for (const date of dates) {
        // Sequential small requests to avoid rate limiters
        const res = await axios.get(`${apiBase}/api/schedules`, { params: { date, status: 'active', limit: 1 } })
        results.push(res)
        await new Promise(r => setTimeout(r, 120)) // small delay between requests
      }
      
      const available = results
        .map((result, index) => ({ date: dates[index], hasSchedules: result.data.data.length > 0 }))
        .filter(item => item.hasSchedules)
        .map(item => item.date)
      
      setAvailableDates(available)
    } catch (error) {
      console.error('Error checking available dates:', error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    checkAvailableDates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    }
  }

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0]
    return dateStr === today
  }

  const isSelected = (dateStr: string) => {
    return dateStr === selectedDate
  }

  const isAvailable = (dateStr: string) => {
    return availableDates.includes(dateStr)
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-4">📅 Select Travel Date</h3>
      
      {loading && (
        <div className="text-center py-4 text-gray-500">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          Checking available dates...
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Calendar dates */}
        {dates.map(dateStr => {
          const { day, month } = formatDate(dateStr)
          const available = isAvailable(dateStr)
          const selected = isSelected(dateStr)
          const today = isToday(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => available && onDateSelect(dateStr)}
              disabled={!available}
              className={`
                relative p-2 text-sm rounded-lg transition-colors
                ${selected 
                  ? 'bg-blue-600 text-white' 
                  : available 
                    ? 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                ${today ? 'ring-2 ring-blue-300' : ''}
              `}
              title={available ? `Available schedules on ${dateStr}` : 'No schedules available'}
            >
              <div className="font-medium">{day}</div>
              {today && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
              {available && !selected && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>No schedules</span>
          </div>
        </div>
        <div className="text-blue-600">
          {selectedDate && `Selected: ${new Date(selectedDate).toLocaleDateString()}`}
        </div>
      </div>
    </div>
  )
}
