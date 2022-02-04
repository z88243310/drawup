const express = require('express')
const router = express.Router()
const axios = require('axios')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// use cryptr
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const { authenticated } = require('../../middleware/auth')
const { getUser } = require('../../helpers/auth-helpers')

// auth page
router.get('/', (req, res) => {
  res.render('comments')
})

// show posts to comment page
router.post('/', authenticated, async (req, res) => {
  const { accessToken } = getUser(req)
  const postId = req.body.postId ? cryptr.decrypt(req.body.postId) : ''
  if (!postId) return res.redirect('back')
  const before = req.query?.before || ''
  const after = req.query?.after || ''
  const commentQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'

  try {
    // get comments
    const commentResponse = await axios.get(`
      https://graph.facebook.com/v12.0/${postId}?fields=comments{text,timestamp,username},media_type,media_url,thumbnail_url&access_token=${accessToken}`)

    const comments = commentResponse?.data?.comments?.data
    const media_url = commentResponse?.data?.media_url
    const thumbnail_url = commentResponse?.data?.thumbnail_url
    const media_type = commentResponse?.data?.media_type
    const image_url = media_type === 'VIDEO' ? thumbnail_url : media_url
    res.render('comments', { comments, image_url })
  } catch (e) {
    next(e)
  }
})

// get posts
router.get('/post', authenticated, async (req, res, next) => {
  const { accessToken } = getUser(req)
  const igSelected = req.query?.igSelected || ''
  const before = req.query?.before || ''
  const after = req.query?.after || ''
  const mediaQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'

  try {
    // 取出 instagram_business_account id
    const nameResponse = await axios.get(`
      https://graph.facebook.com/v12.0/me/accounts/?fields=instagram_business_account{name}&access_token=${accessToken}`)
    const ig = nameResponse?.data?.data
    // encrypt id
    if (typeof ig === 'object') {
      ig.forEach(content => {
        content.instagram_business_account.id = cryptr.encrypt(content.instagram_business_account.id)
      })
    }
    // 取出 指定 ig id 的 media
    let mediaResponse = igSelected
      ? await axios.get(
          `https://graph.facebook.com/v12.0/${cryptr.decrypt(
            igSelected
          )}/?fields=${mediaQuery}{like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp}&access_token=${accessToken}`
        )
      : ''
    const media = mediaResponse?.data?.media?.data
    // encrypt id
    if (typeof media === 'object') {
      media.forEach(content => {
        content.id = cryptr.encrypt(content.id)
      })
    }

    const cursor = mediaResponse?.data?.media?.paging?.cursors

    return res.render('total-media', { ig, media, cursor, igSelected })
  } catch (e) {
    next(e)
  }
})

module.exports = router
