const express = require('express')
const router = express.Router()

// 引用錯誤處理 middleware
const { generalErrorHandler } = require('../middleware/error-handler')

const home = require('./modules/home')
const auth = require('./modules/auth')

router.use('/auth', auth)
router.use('/', home)

// 錯誤處理 middleware
router.use('/', generalErrorHandler)

module.exports = router
