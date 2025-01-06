export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Category } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export type GetCategories = { categories: Category[] }

export async function GET() {
  const categories = await db<Category>('categories').select('*').orderBy('description')

  return NextResponse.json<GetCategories>({ categories: categories })
}

export async function POST(request: NextRequest) {
  const body = await request.json().then((data) => data).catch(() => null)

  const input = z.object({
    description: descriptionValidation,
    notes: notesValidation
  }).safeParse(body)

  if (!!input.error) {
    return NextResponse.json({ error: input.error }, { status: 400 })
  }

  const categoryExists = await db<Category>('categories').select('*').where('description', 'ilike', input.data.description)

  if (categoryExists.length > 0) {
    return NextResponse.json({ message: 'Category already exists' }, { status: 403 })
  }

  const category = await db<Category>('categories').insert({
    description: input.data.description,
    notes: input.data.notes
  }).returning('*').then(c => c[0])

  if (!category) {
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 })
  }

  return NextResponse.json<Category>(category, { status: 200 })
}