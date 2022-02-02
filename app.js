const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const routes = require('./routes')

// 本地環境時載入
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', engine({ extname: '.hbs' }))
app.set('view engine', 'hbs')

//  set public dir
app.use(express.static('public'))

//  bodyparser & resful
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// router entry
app.use(routes)

app.listen(port, () => {
  console.log(`App is listening on port ${port}!`)
})
