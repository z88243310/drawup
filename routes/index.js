const express = require('express')
const router = express.Router()

// middleware & controller & modules
const { generalErrorHandler } = require('../middleware/error-handler')

const auth = require('./modules/auth')
const draw = require('./modules/draw')

// facebook auth
router.use('/auth', auth)

// draw
router.use('/draw', draw)

router.get('/', (req, res) => res.redirect('/draw'))

// 錯誤處理 middleware
router.use('/', generalErrorHandler)

module.exports = router
