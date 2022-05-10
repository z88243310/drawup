const passport = require('passport')

const authController = {
  facebookLogin: passport.authenticate('facebook', {
    scope: ['email', 'public_profile', 'pages_show_list', 'instagram_basic', 'pages_read_engagement']
  }),
  facebookCallback: passport.authenticate('facebook', {
    successRedirect: '/draw',
    failureRedirect: '/'
  }),
  logout: (req, res) => {
    req.logout()
    res.redirect('/')
  }
}

module.exports = authController
