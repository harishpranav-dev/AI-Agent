/**
 * module: useWebSocket.js
 * purpose: React hook for WebSocket connection to backend agent stream.
 */

import { useEffect, useRef, useState, useCallback } from 'react'

export function useWebSocket(clientId) {
  const [events, setEvents] = useState([])
  const [connected, setConnected] = useState(false)
  const wsRef = useRef(null)
  const reconnectTimer = useRef(null)

  useEffect(() => {
    if (!clientId) return

    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/${clientId}`

    const connect = () => {
      wsRef.current = new WebSocket(wsUrl)
      wsRef.current.onopen = () => { setConnected(true) }
      wsRef.current.onclose = () => {
        setConnected(false)
        reconnectTimer.current = setTimeout(connect, 3000)
      }
      wsRef.current.onerror = (err) => console.error('[WS] Error:', err)
      wsRef.current.onmessage = (e) => {
        try {
          setEvents((prev) => [...prev, JSON.parse(e.data)])
        } catch (err) {
          console.error('[WS] Parse error:', err)
        }
      }
    }

    connect()
    return () => { clearTimeout(reconnectTimer.current); wsRef.current?.close() }
  }, [clientId])

  const clearEvents = useCallback(() => setEvents([]), [])
  return { events, connected, clearEvents }
}
