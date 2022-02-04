module.exports = {
  generalErrorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      console.log('error', err.name, err.message)
      req.flash('error_messages', `${err.name}: ${err.message}`)
    } else {
      console.log('else')
      req.flash('error_messages', `${err}`)
    }
    // if (req.body) req.flash('body', JSON.stringify(req.body))
    res.redirect('back')
    next(err)
  }
}
