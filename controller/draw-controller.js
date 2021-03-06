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
      const { awardNames, luckyList, repeatList, drawerList, awardList, orderSelected } = await drawServices.drawAction(req)

      res.render('action', {
        repeatList, awardNames,
        luckyData: JSON.stringify(luckyList),
        awardData: JSON.stringify(awardList),
        drawerData: JSON.stringify(drawerList),
        orderSelected: JSON.stringify(orderSelected)
      })

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
      req.flash('success_messages', '更新成功')
      res.redirect('/draw')

    } catch (e) {
      next(e)
    }
  },
  // prepare to draw
  showDrawResult: async (req, res, next) => {
    try {

      res.render('action')

    } catch (e) {
      next(e)
    }
  }

}

module.exports = drawController
