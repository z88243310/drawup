const express = require('express')
const router = express.Router()

const authController = require('../../controller/auth-controller')

// facebook login & logout
router.get('/facebook', authController.facebookLogin)
router.get('/facebook/callback', authController.facebookCallback)
router.get('/logout', authController.logout)

module.exports = router
