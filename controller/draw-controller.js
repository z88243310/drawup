const axios = require('axios')

const { getUser } = require('../helpers/auth-helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// use cryptr
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const drawController = {
  // show auth page
  showCommentPage: (req, res) => res.render('comments'),
  // show posts to comment page
  postMediaComment: async (req, res, next) => {
    const { accessToken } = getUser(req)
    // 取得 media，若無直接返回
    const mediaJson = req.body?.mediaJson
    if (!mediaJson) return res.redirect('back')
    media = JSON.parse(mediaJson)
    const { media_url, thumbnail_url, media_type } = media

    // 確認類型，回傳正確圖片 url
    const image_url = media_type === 'VIDEO' ? thumbnail_url : media_url

    // 取得 media id 並且 解碼
    const mediaId = media ? cryptr.decrypt(media.id) : ''

    try {
      // get comments
      const commentResponse = await axios.get(`
      https://graph.facebook.com/v12.0/${mediaId}?fields=comments{text,timestamp,username}&access_token=${accessToken}`)
      const comments = commentResponse?.data?.comments?.data

      res.render('comments', { comments, media, image_url })
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
