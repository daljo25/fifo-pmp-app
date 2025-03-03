"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { InventoryRecord, FifoResult } from "@/lib/types"

interface FifoTableProps {
  records: InventoryRecord[]
  fifoResults: FifoResult[]
}

export function FifoTable({ records, fifoResults }: FifoTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
    }).format(value)
  }

  // Get the latest result to show current inventory
  const latestResult = fifoResults.length > 0 ? fifoResults[fifoResults.length - 1] : null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Registros de Operaciones</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead className="text-right">Unidades</TableHead>
                <TableHead className="text-right">Precio Unitario</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
                {records.some((r) => r.operation === "Venta") && (
                  <TableHead className="text-right">Costo de Ventas</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No hay registros. Agrega uno usando el formulario.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record, index) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(record.date, "dd/MM/yyyy", { locale: es })}</TableCell>
                    <TableCell>{record.operation}</TableCell>
                    <TableCell className="text-right">{record.units}</TableCell>
                    <TableCell className="text-right">{formatCurrency(record.unitCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(record.amount)}</TableCell>
                    {records.some((r) => r.operation === "Venta") && (
                      <TableCell className="text-right">
                        {record.operation === "Venta" ? formatCurrency(fifoResults[index]?.costOfGoodsSold || 0) : "-"}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {latestResult && latestResult.inventoryBatches.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Inventario Actual</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha de Entrada</TableHead>
                  <TableHead className="text-right">Unidades</TableHead>
                  <TableHead className="text-right">Precio Unitario</TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestResult.inventoryBatches.map((batch, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(batch.date, "dd/MM/yyyy", { locale: es })}</TableCell>
                    <TableCell className="text-right">{batch.units}</TableCell>
                    <TableCell className="text-right">{formatCurrency(batch.unitCost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(batch.totalCost)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">
                    {latestResult.inventoryBatches.reduce((sum, batch) => sum + batch.units, 0)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-right">{formatCurrency(latestResult.inventoryValue)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

