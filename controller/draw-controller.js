if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const axios = require('axios')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const { getUser } = require('../helpers/auth-helpers')
const { Media, Comment, Condition, Award, Account } = require('../models')

const drawServices = require('../services/draw-services')

const drawController = {
  // show auth page
  showCommentPage: async (req, res, next) => {
    try {
      const userId = getUser(req)?.id || null

      if (!userId) return res.render('comments')

      // 取得 media and comments
      let media = await Media.findOne({
        where: { userId },
        include: [Comment, Condition, Award],
        order: [['updated_at', 'DESC']],
        nest: true
      })
      if (media) {
        media = media.toJSON()
        media.rawId = cryptr.encrypt(media.rawId)
      }

      res.render('comments', {
        awards: media?.Awards,
        condition: media?.Condition,
        comments: media?.Comments,
        media
      })

    } catch (e) {
      next(e)
    }
  },
  // show posts to comment page
  postMediaComment: async (req, res, next) => {
    try {
      await drawServices.refreshMediaAndComment(req)

      res.redirect('/draw')

    } catch (e) {
      next(e)
    }
  },
  // get all media
  getMedia: async (req, res, next) => {
    try {
      return await drawServices.getAccountAndMedia(req, res)

    } catch (e) {
      next(e)
    }
    // const user = getUser(req)
    // const userId = user.id
    // const accessToken = user.accessToken


    // const accountSelected = req.query?.accountSelected

    // 如果已經有 ig 資料就直接取出

    // let igJson = req.query?.igJson
    // let accounts = igJson ? await Account.findAll({ where: { userId } }) : ''

    // console.log('origin', accounts, 'end')
    // const before = req.query?.before
    // const after = req.query?.after

    // try {
    //   // 如果沒有 account 資料，就請求 instagram_business_account id
    //   const accountResponse = !accounts ? await axios.get(`
    //   https://graph.facebook.com/v12.0/me/accounts/?fields=instagram_business_account{name}&access_token=${accessToken}`)
    //     : ''

    //   accounts = accountResponse ? accountResponse?.data?.data : accounts

    //   // write to account db
    //   // await Account.

    //   // encrypt id
    //   if (typeof accounts === 'object' && accountResponse) {
    //     accountsNew = accounts.map(account => {
    //       const ig = account.instagram_business_account
    //       const rawId = ig.id
    //       const name = ig.name

    //       account.instagram_business_account.id = cryptr.encrypt(account.instagram_business_account.id)

    //       delete account.id
    //       return { rawId, userId, name }
    //     })

    //     await Account.destroy({ where: { userId } })
    //     await Account.bulkCreate(accountsNew)
    //   }

    //   // 取出 指定 account id 的 media
    //   const mediaQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'
    //   let mediaResponse = accountSelected
    //     ? await axios.get(
    //       `https://graph.facebook.com/v12.0/${cryptr.decrypt(
    //         accountSelected
    //       )}/?fields=${mediaQuery}{like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp,permalink}&access_token=${accessToken}`
    //     )
    //     : ''

    //   const media = mediaResponse?.data?.media?.data
    //   // encrypt id
    //   if (typeof media === 'object') {
    //     media.forEach(content => {
    //       content.id = cryptr.encrypt(content.id)
    //     })
    //   }
    //   const paging = mediaResponse?.data?.media?.paging
    //   return res.render('total-media', { accounts, media, paging, accountSelected })

    // } catch (e) {
    //   next(e)
    // }
  },
  postCondition: async (req, res, next) => {
    try {
      await drawServices.setConditionAndAward(req)

      res.redirect('/draw/action')

    } catch (e) {
      next(e)
    }
  },
  putMedia: async (req, res, next) => {
    try {
      await Promise.all([
        drawServices.refreshMediaAndComment(req),
        drawServices.setConditionAndAward(req)
      ])

      res.redirect('/draw')

    } catch (e) {
      next(e)
    }
  }
}

module.exports = drawController
