export type Account = {
  id: number
  description: string
  notes: string
  createdAt: string
  updatedAt: string
}

export type Balance = {
  id: number
  accountId: number
  currency: string
  amount: number
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