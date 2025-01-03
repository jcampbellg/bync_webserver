export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Currency } from '@/utils/dbTypes'
import { notesValidation, symbolValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const currencies = await db<Currency>('currencies').select('*').where('id', id)

  if (currencies.length === 0) {
    return NextResponse.json({ message: 'Currency not found' }, { status: 404 })
  }

  return NextResponse.json<Currency>({
    ...currencies[0]
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const body = await request.json().then((data) => data).catch(() => null)

  const isValid = z.object({
    symbol: symbolValidation.optional(),
    notes: notesValidation.optional()
  }).safeParse(body)

  if (!!isValid.error) {
    return NextResponse.json({ error: isValid.error }, { status: 400 })
  }

  const currency = await db<Currency>('currencies').update({
    symbol: isValid.data.symbol,
    notes: isValid.data.notes,
    updatedAt: new Date().toISOString()
  }).where('id', id).returning('*').then(c => c[0])

  if (!currency) {
    return NextResponse.json({ message: 'Error updating currency' }, { status: 500 })
  }

  return NextResponse.json<Currency>(currency, { status: 200 })
}