const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  })
)

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/post',
    failureRedirect: '/'
  })
)

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router
