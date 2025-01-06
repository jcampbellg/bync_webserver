export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Category, Payment, Debt } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const categories = await db<Category>('categories').select('*').orderBy('description').where('id', id)

  if (categories.length === 0) {
    return NextResponse.json({ message: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json<Category>({
    ...categories[0]
  })
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation.optional(),
    notes: notesValidation.optional()
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  if (!!input.data.description) {
    const categoryExists = await db<Category>('categories').select('*').where('description', 'ilike', input.data.description)

    if (categoryExists.length > 0) {
      return NextResponse.json({ message: 'Category already exists with that name' }, { status: 403 })
    }
  }

  const category = await db<Category>('categories').update({
    description: input.data.description,
    notes: input.data.notes,
    updatedAt: new Date().toISOString()
  }).where('id', id).returning('*').then(c => c[0])

  if (!category) {
    return NextResponse.json({ message: 'Error updating category' }, { status: 500 })
  }

  return NextResponse.json<Category>(category, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  await db<Payment>('payments').update({ categoryId: null }).where('categoryId', id)
  await db<Debt>('debts').update({ categoryId: null }).where('categoryId', id)
  await db<Category>('categories').delete().where('id', id).returning('*').then(c => c[0])

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}