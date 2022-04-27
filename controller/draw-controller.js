const axios = require('axios')

const { getUser } = require('../helpers/auth-helpers')
const { Media, Comment } = require('../models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// use cryptr
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const drawController = {
  // show auth page
  showCommentPage: async (req, res, next) => {
    try {
      const user = getUser(req)

      if (!user) return res.render('comments')

      const { id } = user

      // 取得 media and comments
      let media = await Media.findOne({
        where: { userId: id },
        include: [Comment],
        nest: true
      })
      media = media?.toJSON()

      res.render('comments', { comments: media?.Comments, media })
    } catch (e) {
      next(e)
    }
  },
  // show posts to comment page
  postMediaComment: async (req, res, next) => {
    const { id, accessToken } = getUser(req)

    // 取得 media，若無直接返回
    const mediaJson = req.body?.mediaJson
    if (!mediaJson) return res.redirect('back')
    media = JSON.parse(mediaJson)

    const mediaUrl = media.media_url
    const thumbnailUrl = media.thumbnail_url
    const mediaType = media.media_type
    const likeCount = media.like_count
    const commentsCount = media.comments_count
    const { caption, timestamp, permalink } = media

    // 確認類型，回傳正確圖片 url
    const imageUrl = mediaType === 'VIDEO' ? thumbnailUrl : mediaUrl

    // 取得解碼後的 mediaId
    const mediaId = media ? cryptr.decrypt(media.id) : ''

    try {
      // 刪除 media,comments from DB
      await Promise.all([
        Media.destroy({ where: { userId: id } }),
        Comment.destroy({ where: { userId: id } })
      ])

      // 新增 media to DB
      const mediaNew = await Media.create({
        userId: id,
        rawId: media.id,
        mediaType, likeCount, commentsCount, caption,
        timestamp, permalink, imageUrl
      })

      // get comments
      if (commentsCount) {
        const commentResponse = await axios.get(`
      https://graph.facebook.com/v12.0/${mediaId}?fields=comments{text,timestamp,username}&access_token=${accessToken}`)

        const comments = commentResponse?.data?.comments?.data

        comments?.forEach(comment => {
          comment.rawId = cryptr.encrypt(comment.id)
          comment.mediaId = mediaNew.id
          comment.userId = id
          delete comment.id
        })
        await Comment.bulkCreate(comments)
      }

      res.redirect('/')

    } catch (e) {
      next(e)
    }
  },
  // get all media
  getMedia: async (req, res, next) => {
    const { accessToken } = getUser(req)
    const igSelected = req.query?.igSelected

    // 如果已經有 ig 資料就直接取出
    let igJson = req.query?.igJson
    ig = igJson ? JSON.parse(igJson) : ''

    const before = req.query?.before
    const after = req.query?.after

    try {
      // 如果沒有 ig 資料，就請求 instagram_business_account id
      const nameResponse = !ig
        ? await axios.get(`
      https://graph.facebook.com/v12.0/me/accounts/?fields=instagram_business_account{name}&access_token=${accessToken}`)
        : ''
      ig = nameResponse ? nameResponse?.data?.data : ig
      // encrypt id
      if (typeof ig === 'object' && nameResponse) {
        ig.forEach(content => {
          content.instagram_business_account.id = cryptr.encrypt(content.instagram_business_account.id)
        })
      }

      // 取出 指定 ig id 的 media
      const mediaQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'
      let mediaResponse = igSelected
        ? await axios.get(
          `https://graph.facebook.com/v12.0/${cryptr.decrypt(
            igSelected
          )}/?fields=${mediaQuery}{like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp,permalink}&access_token=${accessToken}`
        )
        : ''

      const media = mediaResponse?.data?.media?.data
      // encrypt id
      if (typeof media === 'object') {
        media.forEach(content => {
          content.id = cryptr.encrypt(content.id)
        })
      }
      const paging = mediaResponse?.data?.media?.paging
      return res.render('total-media', { ig, media, paging, igSelected })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = drawController
