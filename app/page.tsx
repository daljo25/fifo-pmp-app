"use client"

import { useState } from "react"
import { FifoForm } from "@/components/fifo-form"
import { FifoTable } from "@/components/fifo-table"
import { calculateFifoResults } from "@/lib/fifo-calculator"
import type { InventoryRecord, FifoResult } from "@/lib/types"

export default function Home() {
  const [records, setRecords] = useState<InventoryRecord[]>([])
  const [fifoResults, setFifoResults] = useState<FifoResult[]>([])

  const addRecord = (record: InventoryRecord) => {
    const newRecords = [...records, record]
    setRecords(newRecords)

    // Recalculate FIFO results whenever a new record is added
    const results = calculateFifoResults(newRecords)
    setFifoResults(results)
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Gestión de Inventario FIFO</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-card p-6 rounded-lg shadow-md md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Agregar Registro</h2>
          <FifoForm onAddRecord={addRecord} />
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md md:col-span-2">
          <FifoTable records={records} fifoResults={fifoResults} />
        </div>
      </div>
    </main>
  )
}

