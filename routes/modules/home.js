const express = require('express')
const router = express.Router()
const axios = require('axios')

const { getUser, ensureAuthenticated } = require('../../helpers/auth-helpers')

router.get('/', (req, res) => {
  res.render('comments')
})

router.get('/post', async (req, res) => {
  const igSelected = req.query?.igSelected || ''
  const before = req.query?.before || ''
  const after = req.query?.after || ''
  const mediaQuery = 'media' + (after ? `.after(${after})` : '') + (before ? `.before(${before})` : '') + '.limit(4)'

  const accessToken =
    'EAAoZBxsAk98cBADPteRFY6y311iYu5758dFpZANsJB4FW1mwz0erHS3NZCZB4j6S5UY21HsKxy1kbRXLusyv0ojoOcSrKKVx8OWTsmMPq471ZBUD0zCxY3kDWRsYvOlN1yeN510nDnBFaZAM18mNV5CDQtqPNZC60iADKtkkYsr2u8tKXA0jZCmo1HA2RwEMTww68FJs73VCx9FpZANPCprrw'

  try {
    // 取出 instagram_business_account id
    const nameResponse = await axios.get(`https://graph.facebook.com/v12.0/me/accounts?fields=instagram_business_account{name}&access_token=${accessToken}`)
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

module.exports = router
