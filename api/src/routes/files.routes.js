const express = require('express')
const { filesData, filesList } = require('../controllers/files.controller')

const router = express.Router()

router.get('/data', filesData)
router.get('/list', filesList)

module.exports = router
