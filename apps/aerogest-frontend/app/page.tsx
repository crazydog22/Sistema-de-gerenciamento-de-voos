'use client'

import React, { useState, useEffect } from 'react'

interface Flight {
  _id: string
  number: string
  origin: string
  destination: string
  status: string
  passengers: number
  departureTime?: string
  arrivalTime?: string
}

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch('http://localhost:3002/flights')
        if (!response.ok) throw new Error('Erro ao carregar voos')
        const text = await response.text()
        try {
          // Corrige formato malformado do JSON
          const fixedJson = text.replace(/}{/g, '},{')
          const data = JSON.parse(`[${fixedJson}]`)
          setFlights(data.map((flight: any) => ({
            ...flight,
            id: flight._id // Mapeia _id para id para compatibilidade
          })))
        } catch (err) {
          setError('Erro ao processar dados dos voos')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchFlights()
  }, [])

  const activeFlights = flights.filter(f => f.status === 'Em voo').length
  const totalPassengers = flights.reduce((sum, flight) => sum + flight.passengers, 0)

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Sistema de Gerenciamento de Voos
      </h1>
      
      {loading ? (
        <p>Carregando dados...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Voos Ativos</h2>
            <p className="text-gray-600">{activeFlights} voos em andamento</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Passageiros</h2>
            <p className="text-gray-600">{totalPassengers} passageiros hoje</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <p className="text-green-600">Sistema operacional</p>
          </div>
        </div>
      )}
    </main>
  )
}
