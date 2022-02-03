const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getUser } = require('../../helpers/auth-helpers')

router.get('/', (req, res) => {
  res.render('comments')
})

router.get('/post', async (req, res) => {
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

    // 取出 指定 ig id 的 media
    let mediaResponse = igSelected
      ? await axios.get(
          `https://graph.facebook.com/v12.0/${igSelected}/?fields=${mediaQuery}{like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp}&access_token=${accessToken}`
        )
      : ''
    const media = mediaResponse?.data?.media?.data
    const cursor = mediaResponse?.data?.media?.paging?.cursors

    return res.render('total-media', { ig, media, cursor, igSelected })
  } catch (e) {
    console.log(e.message)
  }
})

// router.get('/post', (req, res) => {
//   const { accessToken } = req.user
//   const before = req.query?.before || ''
//   const after = req.query?.after || ''
//   const mediaQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'

//   // 取得 all media instagramId
//   url = `https://graph.facebook.com/v12.0/me/accounts/?fields=instagram_business_account&access_token=${accessToken}`
//   axios.get(url).then(response => {
//     console.log(response)
//     const ig = response?.data?.data[0]?.instagram_business_account?.media
//     console.log(ig)
//     const media = ig?.data
//     const paging = ig?.paging?.cursors
//     if (ig === undefined) return res.redirect('back')
//     res.render('total-media', { media, paging })
//   })
// })

module.exports = router
