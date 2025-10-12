import React from 'react'

type Seat = {
  seatNumber: string
  isAvailable: boolean
  seatType: 'normal' | 'vip'
}

type Props = {
  seats: Seat[]
  seatLayout: string
  selectedSeat: string | null
  onSeatSelect: (seatNumber: string) => void
}

export const SeatMap: React.FC<Props> = ({ seats, seatLayout, selectedSeat, onSeatSelect }) => {
  // Parse seat layout (e.g., "2-2" -> [2, 2], "2-1" -> [2, 1])
  const layoutColumns = React.useMemo(() => {
    if (!seatLayout) return [2, 2] // Default 2-2 layout
    
    const parts = seatLayout.split('-').map(p => parseInt(p.trim(), 10)).filter(n => !isNaN(n))
    return parts.length > 0 ? parts : [2, 2]
  }, [seatLayout])

  // Group seats by rows
  const seatRows = React.useMemo(() => {
    const rows: { [key: string]: Seat[] } = {}
    
    seats.forEach(seat => {
      // Extract row number from seat number (e.g., "1A" -> row "1", "12B" -> row "12")
      const rowMatch = seat.seatNumber.match(/^(\d+)/)
      const row = rowMatch ? rowMatch[1] : '1'
      
      if (!rows[row]) rows[row] = []
      rows[row].push(seat)
    })
    
    // Sort rows numerically
    return Object.keys(rows)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
      .map(row => ({ rowNumber: row, seats: rows[row] }))
  }, [seats])

  // Get seat color based on status
  const getSeatColor = (seat: Seat) => {
    if (selectedSeat === seat.seatNumber) {
      return 'bg-blue-500 text-white border-blue-600' // Selected
    }
    if (!seat.isAvailable) {
      return 'bg-red-200 text-red-800 border-red-300 cursor-not-allowed' // Occupied
    }
    if (seat.seatType === 'vip') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' // VIP available
    }
    return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200' // Normal available
  }

  // Get seat icon based on type
  const getSeatIcon = (seat: Seat) => {
    if (seat.seatType === 'vip') return '👑'
    return '💺'
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>VIP Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Vehicle Layout */}
      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
        {/* Vehicle Header */}
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600">Vehicle Layout: {seatLayout}</div>
          <div className="text-xs text-gray-500">Driver</div>
        </div>

        {/* Seat Grid */}
        <div className="space-y-2">
          {seatRows.map(({ rowNumber, seats }) => (
            <div key={rowNumber} className="flex items-center gap-2">
              {/* Row Number */}
              <div className="w-8 text-center text-sm font-medium text-gray-600">
                {rowNumber}
              </div>
              
              {/* Seats */}
              <div className="flex gap-1">
                {layoutColumns.map((colCount, colIndex) => (
                  <React.Fragment key={colIndex}>
                    {/* Seats in this column group */}
                    {Array.from({ length: colCount }, (_, seatIndex) => {
                      const globalSeatIndex = layoutColumns.slice(0, colIndex).reduce((sum, count) => sum + count, 0) + seatIndex
                      const seat = seats[globalSeatIndex]
                      
                      if (!seat) {
                        // Empty space for missing seat
                        return (
                          <div key={`empty-${colIndex}-${seatIndex}`} className="w-8 h-8"></div>
                        )
                      }
                      
                      return (
                        <button
                          key={seat.seatNumber}
                          onClick={() => seat.isAvailable && onSeatSelect(seat.seatNumber)}
                          disabled={!seat.isAvailable}
                          className={`w-8 h-8 border rounded text-xs font-medium transition-colors ${getSeatColor(seat)}`}
                          title={`${seat.seatNumber} - ${seat.seatType.toUpperCase()} - ${seat.isAvailable ? 'Available' : 'Occupied'}`}
                        >
                          <span className="text-xs">{getSeatIcon(seat)}</span>
                        </button>
                      )
                    })}
                    
                    {/* Aisle between column groups */}
                    {colIndex < layoutColumns.length - 1 && (
                      <div className="w-2"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Footer */}
        <div className="text-center mt-4">
          <div className="text-xs text-gray-500">Back of Vehicle</div>
        </div>
      </div>

      {/* Selected Seat Info */}
      {selectedSeat && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="text-sm">
            <span className="font-medium">Selected Seat:</span> {selectedSeat}
            {seats.find(s => s.seatNumber === selectedSeat)?.seatType === 'vip' && (
              <span className="ml-2 text-yellow-600">👑 VIP</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

