export interface InventoryRecord {
  id: string
  date: Date
  operation: string
  units: number
  amount: number
  unitCost: number
}

export interface FifoResult {
  recordId: string
  remainingUnits: number
  inventoryValue: number
  costOfGoodsSold: number
  inventoryBatches: InventoryBatch[]
}

export interface InventoryBatch {
  date: Date
  units: number
  unitCost: number
  totalCost: number
}

