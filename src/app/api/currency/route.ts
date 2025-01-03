export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Currency } from '@/utils/dbTypes'
import { NextResponse } from 'next/server'

export type GetCurrencies = { currencies: Currency[] }

export async function GET() {
  const currencies = await db<Currency>('currencies').select('*').orderBy('symbol')

  return NextResponse.json<GetCurrencies>({ currencies })
}