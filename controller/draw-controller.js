const drawServices = require('../services/draw-services')

const drawController = {
  // show auth page
  showCommentPage: async (req, res, next) => {
    try {
      const {
        awards, condition, comments, media
      } = await drawServices.getAllDataOfMedia(req)

      res.render('comments', { awards, condition, comments, media })

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
      const {
        accounts, media, paging, accountSelected
      } = await drawServices.getAccountAndMedia(req, res)

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
