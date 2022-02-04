const express = require('express')
const router = express.Router()

// middleware & controller & modules
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

const drawController = require('../controller/draw-controller')

const auth = require('./modules/auth')

// facebook auth
router.use('/auth', auth)

// show comment page
router.get('/', drawController.showCommentPage)
// show posts to comment page
router.post('/', authenticated, drawController.postMediaComment)
// get all media
router.get('/post', authenticated, drawController.getMedia)

// 錯誤處理 middleware
router.use('/', generalErrorHandler)

module.exports = router
