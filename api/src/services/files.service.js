const axios = require('axios')
const config = require('../config')
const { parseAndValidate } = require('../utils/csv')

const client = axios.create({
  baseURL: config.externalApi.baseUrl,
  timeout: config.externalApi.timeout,
  headers: {
    Authorization: config.externalApi.apiKey
  }
})

async function listFiles () {
  const response = await client.get('/v1/secret/files')
  return response.data.files
}

async function getFileContent (fileName) {
  const response = await client.get(`/v1/secret/file/${fileName}`)
  return response.data
}

async function getFilesData (fileNameFilter) {
  const allFiles = await listFiles()

  const filesToProcess = fileNameFilter
    ? allFiles.filter(f => f === fileNameFilter)
    : allFiles

  const results = await Promise.allSettled(
    filesToProcess.map(async (fileName) => {
      const raw = await getFileContent(fileName)
      const lines = parseAndValidate(raw)
      return { fileName, lines }
    })
  )

  const output = []

  for (const result of results) {
    if (result.status !== 'fulfilled') continue
    const { fileName, lines } = result.value
    if (lines.length === 0) continue

    output.push({
      file: fileName,
      lines: lines.map(({ text, number, hex }) => ({ text, number, hex }))
    })
  }

  return output
}

module.exports = { listFiles, getFilesData }
