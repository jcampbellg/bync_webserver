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

export type AccountWithBalances = Account & {
  balances: Balance[]
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
  isDebt: boolean
  isPaid: boolean
  isOverpaid: boolean
  isPending: boolean
  createdAt: string
  updatedAt: string
}

export type Payment = {
  id: number
  transactionId: number
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
  transactionId: number
  groupId: number | null
  categoryId: number | null
  currency: string
  amount: number
  dueAt: string
  createdAt: string
  updatedAt: string
}