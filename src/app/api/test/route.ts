export const dynamic = 'force-dynamic'

import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import { fileTypeFromBuffer } from 'file-type'
import { NextRequest, NextResponse } from 'next/server'

const projectId = process.env.PROJECT_ID || ''
const bucketName = process.env.BUCKET_NAME || ''

const serviceKey = JSON.stringify(JSON.parse(process.env.JSON_SERVICE_KEY || ''), null, 2)
// save service key to file
fs.writeFileSync('./service-account.json', serviceKey)

const storage = new Storage({
  projectId,
  keyFilename: './service-account.json'
})

const bucket = storage.bucket(bucketName)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const filePath = searchParams.get('file')

  if (!filePath) {
    return NextResponse.json({ message: 'No file specified' }, { status: 400 })
  }

  try {
    const file = bucket.file(filePath)

    await file.download({
      destination: `./${filePath}`
    })

    // Get Buffer from destination file
    const fileData = fs.readFileSync(`./${filePath}`)
    const type = await fileTypeFromBuffer(fileData)

    const response = new Response(fileData)
    // @ts-expect-error
    response.headers.set('content-type', type?.mime)

    // Delete the downloaded file
    fs.unlinkSync(`./${filePath}`)

    return response
  } catch (error) {
    return NextResponse.json({ message: 'Error downloading file', error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const uploadFile = formData.get('file') as File
    const arrayBuffer = await uploadFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const type = await fileTypeFromBuffer(buffer)

    if (['image/jpeg', 'image/png', 'application/pdf'].indexOf(type?.mime || '') === -1) {
      return NextResponse.json({ message: 'Invalid file type', file: uploadFile.name, contentType: type?.mime }, { status: 400 })
    }

    // Upload the specified file to the bucket with the given destination name
    const file = bucket.file(uploadFile.name)

    await file.save(buffer, {
      contentType: uploadFile.type
    })

    return NextResponse.json({ message: 'File uploaded successfully', file: uploadFile.name, contentType: type })
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading file', error }, { status: 500 })
  }
}