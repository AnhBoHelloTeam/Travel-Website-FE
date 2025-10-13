import React from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

type Stop = {
  _id?: string
  name: string
  address: string
  coordinates?: { lat?: number, lng?: number }
  order: number
  estimatedTime: number
}

type Props = {
  stops: Stop[]
  departureTime: string
}

export const RouteMap: React.FC<Props> = ({ stops, departureTime }) => {
  const mapRef = React.useRef<HTMLDivElement | null>(null)
  const mapInstance = React.useRef<L.Map | null>(null)
  const markersRef = React.useRef<L.Marker[]>([])

  const validStops = React.useMemo(() => (stops || []).filter(s => s.coordinates?.lat && s.coordinates?.lng).sort((a, b) => a.order - b.order), [stops])

  React.useEffect(() => {
    if (!mapRef.current || validStops.length === 0) return

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([validStops[0].coordinates!.lat!, validStops[0].coordinates!.lng!], 9)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current)
    }

    // Clear previous markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Add stop markers and polyline
    const latlngs: L.LatLngExpression[] = []
    validStops.forEach((stop, idx) => {
      const latlng = [stop.coordinates!.lat!, stop.coordinates!.lng!] as L.LatLngExpression
      latlngs.push(latlng)
      const marker = L.marker(latlng, {
        title: `${stop.order}. ${stop.name}`
      }).addTo(mapInstance.current!)
      marker.bindPopup(`<b>${stop.name}</b><br/>${stop.address || ''}<br/>ETA: ${stop.estimatedTime}min`)
      markersRef.current.push(marker)
    })

    L.polyline(latlngs, { color: 'blue' }).addTo(mapInstance.current!)
    mapInstance.current!.fitBounds(L.latLngBounds(latlngs), { padding: [20, 20] })

    // Simulate/current bus position based on time difference
    const dep = new Date(departureTime).getTime()
    const now = Date.now()
    const minutesFromDep = Math.max(0, Math.floor((now - dep) / 60000))

    // Find nearest segment by ETA
    const segmentIndex = validStops.findIndex(s => s.estimatedTime > minutesFromDep)
    if (segmentIndex > 0) {
      const prev = validStops[segmentIndex - 1]
      const next = validStops[segmentIndex]
      const span = next.estimatedTime - prev.estimatedTime
      const progress = span > 0 ? Math.min(1, Math.max(0, (minutesFromDep - prev.estimatedTime) / span)) : 0

      const lat = (prev.coordinates!.lat! + (next.coordinates!.lat! - prev.coordinates!.lat!) * progress)
      const lng = (prev.coordinates!.lng! + (next.coordinates!.lng! - prev.coordinates!.lng!) * progress)

      const busIcon = L.divIcon({
        html: '<div style="background:#10b981;color:white;border-radius:9999px;padding:6px 8px;font-size:12px;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,.3)">🚌</div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
      L.marker([lat, lng], { icon: busIcon }).addTo(mapInstance.current!).bindTooltip('Current position', { permanent: false })
    }

    return () => {
      // no-op; map persists
    }
  }, [validStops, departureTime])

  if (validStops.length === 0) {
    return <div className="text-sm text-gray-500">No map data available for this route.</div>
  }

  return (
    <div className="w-full h-72 rounded border" ref={mapRef}></div>
  )
}
