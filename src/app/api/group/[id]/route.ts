export const dynamic = 'force-dynamic'
import db from '@/utils/db'
import { Group, Payment, Debt } from '@/utils/dbTypes'
import { descriptionValidation, notesValidation } from '@/utils/validation'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  const groups = await db<Group>('groups').select('*').orderBy('description').where('id', id)

  if (groups.length === 0) {
    return NextResponse.json({ message: 'Group not found' }, { status: 404 })
  }

  return NextResponse.json<Group>({
    ...groups[0]
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
    const groupExists = await db<Group>('groups').select('*').where('description', 'ilike', input.data.description)

    if (groupExists.length > 0) {
      return NextResponse.json({ message: 'Group already exists with that name' }, { status: 403 })
    }
  }

  const group = await db<Group>('groups').update({
    description: input.data.description,
    notes: input.data.notes,
    updatedAt: new Date().toISOString()
  }).where('id', id).returning('*').then(c => c[0])

  if (!group) {
    return NextResponse.json({ message: 'Error updating group' }, { status: 500 })
  }

  return NextResponse.json<Group>(group, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const id = parseInt((await params).id)

  await db<Payment>('payments').update({ groupId: null }).where('groupId', id)
  await db<Debt>('debts').update({ groupId: null }).where('groupId', id)
  await db<Group>('groups').delete().where('id', id).returning('*').then(c => c[0])

  return NextResponse.json({ message: 'Success' }, { status: 200 })
}