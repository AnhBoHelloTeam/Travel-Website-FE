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

  const validStops = React.useMemo(() => {
    console.log('RouteMap - Raw stops:', stops);
    const filtered = (stops || []).filter(s => s.coordinates?.lat && s.coordinates?.lng).sort((a, b) => a.order - b.order);
    console.log('RouteMap - Valid stops:', filtered);
    return filtered;
  }, [stops])

  React.useEffect(() => {
    if (!mapRef.current || validStops.length === 0) return

    if (!mapInstance.current) {
      // Set center to Vietnam if we have multiple stops, otherwise use first stop
      const centerLat = validStops.length > 1 ? 16.0 : validStops[0].coordinates!.lat!
      const centerLng = validStops.length > 1 ? 108.0 : validStops[0].coordinates!.lng!
      const zoom = validStops.length > 1 ? 6 : 9
      
      mapInstance.current = L.map(mapRef.current).setView([centerLat, centerLng], zoom)

      // Use multiple tile layers for better Vietnam coverage
      const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      })
      
      const cartoLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19
      })
      
      // Add default layer
      osmLayer.addTo(mapInstance.current)
      
      // Add layer control
      const baseMaps = {
        "Bản đồ mặc định": osmLayer,
        "Bản đồ sáng": cartoLayer
      }
      
      L.control.layers(baseMaps).addTo(mapInstance.current)
    }

    // Clear previous markers
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    // Add stop markers and polyline
    const latlngs: L.LatLngExpression[] = []
    validStops.forEach((stop, idx) => {
      const latlng = [stop.coordinates!.lat!, stop.coordinates!.lng!] as L.LatLngExpression
      latlngs.push(latlng)
      
      // Create custom icon based on stop type
      const isStart = idx === 0
      const isEnd = idx === validStops.length - 1
      
      let iconColor = '#3388ff' // Default blue
      let iconSymbol = '📍'
      
      if (isStart) {
        iconColor = '#28a745' // Green for start
        iconSymbol = '🚌'
      } else if (isEnd) {
        iconColor = '#dc3545' // Red for end
        iconSymbol = '🏁'
      }
      
      const customIcon = L.divIcon({
        html: `<div style="
          background-color: ${iconColor};
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${iconSymbol}</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      })
      
      const marker = L.marker(latlng, {
        icon: customIcon,
        title: `${stop.order}. ${stop.name}`
      }).addTo(mapInstance.current!)
      
      // Enhanced popup with Vietnamese formatting
      const popupContent = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${iconSymbol} ${stop.name}</h4>
          <p style="margin: 4px 0; color: #666; font-size: 12px;">📍 ${stop.address || ''}</p>
          <p style="margin: 4px 0; color: #007bff; font-weight: bold;">⏱️ Thời gian: ${stop.estimatedTime} phút</p>
          <p style="margin: 4px 0; color: #28a745; font-size: 11px;">Thứ tự: ${stop.order}</p>
        </div>
      `
      
      marker.bindPopup(popupContent)
      markersRef.current.push(marker)
    })

    // Add route polyline with Vietnamese styling
    if (latlngs.length > 1) {
      const routePolyline = L.polyline(latlngs, {
        color: '#e74c3c',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10'
      }).addTo(mapInstance.current!)
      
      markersRef.current.push(routePolyline as any)
    }
    
    // Fit bounds to show entire route
    if (latlngs.length > 1) {
      mapInstance.current!.fitBounds(L.latLngBounds(latlngs), { 
        padding: [30, 30],
        maxZoom: 12
      })
    }

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
