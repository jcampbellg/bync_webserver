export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Group } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export type GetGroups = { groups: Group[] }

export async function GET() {
  const groups = await db<Group>('groups').select('*').orderBy('description')

  return NextResponse.json<GetGroups>({ groups })
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

  const groupExists = await db<Group>('groups').select('*').where('description', 'ilike', input.data.description)

  if (groupExists.length > 0) {
    return NextResponse.json({ message: 'Group already exists' }, { status: 403 })
  }

  const group = await db<Group>('groups').insert({
    description: input.data.description,
    notes: input.data.notes
  }).returning('*').then(c => c[0])

  if (!group) {
    return NextResponse.json({ message: 'Error creating group' }, { status: 500 })
  }

  return NextResponse.json<Group>(group, { status: 200 })
}