const passport = require('passport')

// 引用 Facebook 登入策略
const FacebookStrategy = require('passport-facebook').Strategy

const { User } = require('../models')
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
        profileFields: ['email', 'displayName'],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        const { name, email } = profile._json
        console.log(profile._json)
        User.findOne({ where: { email } }).then(user => {
          // 已註冊
          if (user) {
            return user
              .update({ accessToken })
              .then(user => done(null, user, req.flash('success_messages', '授權成功')))
              .catch(error => done(error, false))
          }
          // 未註冊
          return User.create({ name, email, accessToken })
            .then(user => done(null, user, req.flash('success_messages', '授權成功')))
            .catch(error => done(error, false))
        })
      }
    )
  )
  // 設定序列化與反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      .catch(err => done(err, null))
  })
}
