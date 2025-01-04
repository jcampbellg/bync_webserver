export const dynamic = 'force-dynamic'

import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import { NextResponse } from 'next/server'

const projectId = process.env.PROJECT_ID || ''
const bucketName = process.env.BUCKET_NAME || ''

const serviceKey = JSON.stringify(JSON.parse(process.env.JSON_SERVICE_KEY || ''), null, 2)
// save service key to file
fs.writeFileSync('./service-account.json', serviceKey)

const storage = new Storage({
  projectId,
  keyFilename: './service-account.json'
})

export async function GET() {
  try {
    // Get a reference to the specified bucket
    const bucket = storage.bucket(bucketName)

    // Upload the specified file to the bucket with the given destination name
    const filePath = 'hi.txt'
    const ret = await bucket.upload(filePath, {
      destination: filePath
    })

    // Return the result of the upload operation
    // return NextResponse.json({ message: 'File uploaded successfully', data: ret })

    // get file from bucket and return the file itself
    const file = bucket.file(filePath)
    const fileData = await file.download()
    const response = new NextResponse(fileData)
    response.headers.set('content-type', file.metadata.contentType)
    return response
  } catch (error) {
    return NextResponse.json({ message: 'Error uploading file', error }, { status: 500 })
  }
}