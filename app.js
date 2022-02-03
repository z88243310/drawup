const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

const usePassport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser, ensureAuthenticated } = require('./helpers/auth-helpers')

const routes = require('./routes')

// 本地環境時載入
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('hbs', engine({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

//  set public dir
app.use(express.static('public'))

//  bodyparser & restful
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//  passport init
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
usePassport(app)

// 進入主要路由前的 middleware
app.use((req, res, next) => {
  res.locals.user = getUser(req)
  res.locals.isAuthenticated = ensureAuthenticated(req)
  next()
})

// router entry
app.use(routes)

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`)
})
