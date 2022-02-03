const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const auth = require('./modules/auth')

router.use('/auth', auth)
router.use('/', home)


module.exports = router
