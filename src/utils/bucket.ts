import { Storage } from '@google-cloud/storage'
import fs from 'fs'

const projectId = process.env.PROJECT_ID || ''
const bucketName = process.env.BUCKET_NAME || ''

// check if file exists ./service-account.json
if (!fs.existsSync('./service-account.json')) {
  const serviceKey = JSON.stringify(JSON.parse(process.env.JSON_SERVICE_KEY || ''), null, 2)
  // save service key to file
  fs.writeFileSync('./service-account.json', serviceKey)
}

const storage = new Storage({
  projectId,
  keyFilename: './service-account.json'
})

const bucket = storage.bucket(bucketName)

export default bucket