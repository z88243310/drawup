const helpers = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  // 已登入，繼續
  if (helpers.ensureAuthenticated(req)) return next()
  // 未登入，返回登入頁面
  req.flash('error_messages', `請先授權 facebook`)
  res.redirect('/')
}

module.exports = {
  authenticated
}
