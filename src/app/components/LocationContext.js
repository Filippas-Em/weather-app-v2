'use client'
import { createContext, useContext, useState } from 'react'

const LocationContext = createContext()

export function LocationProvider({ children }) {
  const [coordinates, setCoordinates] = useState({
    lat: 37.9838, // Athens default coordinates
    lon: 23.7275
  })

  const [selectedDay, setSelectedDay] = useState(0) 

  return (
    <LocationContext.Provider value={{ coordinates, setCoordinates, selectedDay, setSelectedDay }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}