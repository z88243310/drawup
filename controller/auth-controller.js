const passport = require('passport')

const authController = {
  facebookLogin: passport.authenticate('facebook', {
    scope: ['email', 'public_profile']
  }),
  facebookCallback: passport.authenticate('facebook', {
    successRedirect: '/draw/post',
    failureRedirect: '/'
  }),
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}

module.exports = authController
