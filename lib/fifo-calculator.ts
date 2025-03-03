import type { InventoryRecord, FifoResult, InventoryBatch } from "@/lib/types"

export function calculateFifoResults(records: InventoryRecord[]): FifoResult[] {
  const results: FifoResult[] = []
  let inventory: InventoryBatch[] = []

  records.forEach((record, index) => {
    let costOfGoodsSold = 0

    if (record.operation === "Existencia" || record.operation === "Compra") {
      // Add to inventory
      inventory.push({
        date: record.date,
        units: record.units,
        unitCost: record.unitCost,
        totalCost: record.amount,
      })
    } else if (record.operation === "Venta") {
      // Remove from inventory using FIFO
      let unitsToSell = record.units
      costOfGoodsSold = 0

      // Create a copy of the inventory to modify
      const updatedInventory: InventoryBatch[] = []

      // Process each batch in FIFO order
      for (const batch of inventory) {
        if (unitsToSell <= 0) {
          // No more units to sell, keep the rest of the batches unchanged
          updatedInventory.push({ ...batch })
          continue
        }

        if (batch.units <= unitsToSell) {
          // Use the entire batch
          unitsToSell -= batch.units
          costOfGoodsSold += batch.totalCost
          // This batch is completely consumed, so don't add it to updatedInventory
        } else {
          // Use part of the batch
          const soldUnits = unitsToSell
          const remainingUnits = batch.units - soldUnits
          const costPerUnit = batch.unitCost

          costOfGoodsSold += soldUnits * costPerUnit

          // Add the remaining portion of the batch to the updated inventory
          updatedInventory.push({
            date: batch.date,
            units: remainingUnits,
            unitCost: costPerUnit,
            totalCost: remainingUnits * costPerUnit,
          })

          unitsToSell = 0
        }
      }

      // Update the inventory with the remaining batches
      inventory = updatedInventory
    }

    // Calculate remaining inventory value
    const remainingUnits = inventory.reduce((sum, batch) => sum + batch.units, 0)
    const inventoryValue = inventory.reduce((sum, batch) => sum + batch.totalCost, 0)

    // Create a deep copy of the current inventory state for this result
    const inventoryBatches = inventory.map((batch) => ({ ...batch }))

    results.push({
      recordId: record.id,
      remainingUnits,
      inventoryValue,
      costOfGoodsSold: record.operation === "Venta" ? costOfGoodsSold : 0,
      inventoryBatches,
    })
  })

  return results
}

