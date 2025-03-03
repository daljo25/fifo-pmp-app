"use client"

import type React from "react"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { InventoryRecord } from "@/lib/types"

interface FifoFormProps {
  onAddRecord: (record: InventoryRecord) => void
}

export function FifoForm({ onAddRecord }: FifoFormProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [operation, setOperation] = useState<string>("")
  const [units, setUnits] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!date || !operation || !units || !amount) {
      setError("Todos los campos son obligatorios")
      return
    }

    const unitsValue = Number.parseInt(units)
    const unitPriceValue = Number.parseFloat(amount)

    if (isNaN(unitsValue) || unitsValue <= 0) {
      setError("Las unidades deben ser un número positivo")
      return
    }

    if (isNaN(unitPriceValue) || unitPriceValue <= 0) {
      setError("El precio unitario debe ser un número positivo")
      return
    }

    const totalAmount = unitsValue * unitPriceValue

    // Create new record
    const newRecord: InventoryRecord = {
      id: Date.now().toString(),
      date: date,
      operation: operation,
      units: unitsValue,
      unitCost: unitPriceValue,
      amount: totalAmount,
    }

    // Add record
    onAddRecord(newRecord)

    // Reset form
    setOperation("")
    setUnits("")
    setAmount("")
    setError("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="operation">Operación</Label>
        <Select value={operation} onValueChange={setOperation}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar operación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Existencia">Existencia</SelectItem>
            <SelectItem value="Compra">Compra</SelectItem>
            <SelectItem value="Venta">Venta</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="units">Unidades</Label>
        <Input
          id="units"
          type="number"
          min="1"
          placeholder="Número de unidades"
          value={units}
          onChange={(e) => setUnits(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitPrice">Precio Unitario</Label>
        <Input
          id="unitPrice"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Precio por unidad"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalAmount">Monto Total</Label>
        <Input
          id="totalAmount"
          type="number"
          readOnly
          value={units && amount ? (Number.parseFloat(units) * Number.parseFloat(amount)).toFixed(2) : ""}
          className="bg-muted"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" className="w-full">
        Agregar Registro
      </Button>
    </form>
  )
}

