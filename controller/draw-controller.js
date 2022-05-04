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
        order: [
          ['updated_at', 'DESC'],
          [Comment, 'timestamp', 'DESC'],
          [Award, 'id', 'ASC']
        ],
        nest: true
      })
      if (media) {
        media = media.toJSON()
        media.id = cryptr.encrypt(media.id)
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
      const { accounts, media, paging, accountSelected } = await drawServices.getAccountAndMedia(req, res)

      res.render('total-media', { accounts, media, paging, accountSelected })

    } catch (e) {
      next(e)
    }
  },
  // set condition and award
  postCondition: async (req, res, next) => {
    try {
      await drawServices.setConditionAndAward(req)

      res.redirect('/draw/action')

    } catch (e) {
      next(e)
    }
  },
  // refresh media & comment and set condition & award
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
