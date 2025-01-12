import { NextResponse } from 'next/server'

const notFoundJson = () => {
  return NextResponse.json({ message: 'Route Not Found' }, { status: 404 })
}

export async function GET() {
  return notFoundJson()
}

export async function POST() {
  return notFoundJson()
}

export async function PUT() {
  return notFoundJson()
}

export async function PATCH() {
  return notFoundJson()
}

export async function DELETE() {
  return notFoundJson()
}