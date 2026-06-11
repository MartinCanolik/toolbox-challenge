const { listFiles, getFilesData } = require('../services/files.service')

async function filesData (req, res, next) {
  try {
    const { fileName } = req.query
    const data = await getFilesData(fileName || null)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

async function filesList (req, res, next) {
  try {
    const files = await listFiles()
    res.json({ files })
  } catch (err) {
    next(err)
  }
}

module.exports = { filesData, filesList }
