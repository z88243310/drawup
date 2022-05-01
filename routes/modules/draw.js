const express = require('express')
const router = express.Router()

const { authenticated } = require('../../middleware/auth')

const drawController = require('../../controller/draw-controller')

// show comment page
router.get('/', drawController.showCommentPage)
// show posts to comment page
router.post('/', authenticated, drawController.postMediaComment)
// get all media
router.get('/post', authenticated, drawController.getMedia)
// post condition to action
router.post('/action', authenticated, drawController.postCondition)
// put media
router.put('/', authenticated, drawController.putMedia)


module.exports = router
