export type Account = {
  id: number
  description: string
  notes: string
  isSelected: boolean
  showBalance: boolean
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
}

export type Balance = {
  id: number
  accountId: number
  currency: string
  amount: number
  isSelected: boolean
  createdAt: string
  updatedAt: string
}

export type Currency = {
  id: number
  symbol: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type Group = {
  id: number
  description: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type Category = {
  id: number
  description: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type Transaction = {
  id: number
  description: string
  notes: string
  accountId: number | null
  groupId: number | null
  categoryId: number | null
  currency: string
  amount: number
  paidAt: string
  createdAt: string
  updatedAt: string
}

export type Debt = {
  id: number
  description: string
  notes: string
  accountId: number | null
  groupId: number | null
  categoryId: number | null
  currency: string
  amount: number
  dueAt: string
  createdAt: string
  updatedAt: string
}

export type DebtPayment = {
  id: number
  transactionId: number
  debtId: number
  createdAt: string
  updatedAt: string
}