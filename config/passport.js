const passport = require('passport')

// 引用 Facebook 登入策略
const FacebookStrategy = require('passport-facebook').Strategy

// const bcrypt = require('bcryptjs')
// const db = require('../models')
// const User = db.User
module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定 Facebook 登入策略
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['email', 'displayName']
      },
      (accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        console.log(name, email, accessToken)
        done(null, { id: 1, name, email, accessToken })
        // User.findOne({ where: { email } }).then(user => {
        //   if (user) return done(null, user)
        //   const randomPassword = Math.random().toString(36).slice(-8)
        //   bcrypt
        //     .genSalt(10)
        //     .then(salt => bcrypt.hash(randomPassword, salt))
        //     .then(hash =>
        //       User.create({
        //         name,
        //         email,
        //         password: hash
        //       })
        //     )
        //     .then(user => done(null, user))
        //     .catch(error => done(error, false))
        // })
      }
    )
  )
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    console.log(user.id)
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    user = { name: 'hi' }
    // console.log(req.session.passport.user)
    done(null, user)
    // User.findByPk(id)
    //   .then(user => {
    //     user = user.toJSON()
    //     done(null, user)
    //   })
    //   .catch(err => done(err, null))
  })
}
