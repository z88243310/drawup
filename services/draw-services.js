const axios = require('axios')

const { getUser } = require('../helpers/auth-helpers')
const { Media, Comment, Condition, Award } = require('../models')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const apiURL = 'https://graph.facebook.com/v12.0/'

const drawServices = {
  refreshMediaAndComment: async (req) => {
    // get user data
    const user = getUser(req)
    const userId = user.id
    const accessToken = user.accessToken

    // get parameter
    const { mediaEncryptId } = req.body
    const mediaRawId = cryptr.decrypt(mediaEncryptId)

    // API url
    const mediaAPI = `
      ${apiURL}${mediaRawId}?fields=like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    const commentAPI = `
      ${apiURL}${mediaRawId}?fields=comments{text,timestamp,username}&access_token=${accessToken}`

    // request api and delete comments from db 
    const [mediaResponse, commentResponse, _] = await Promise.all([
      axios.get(mediaAPI), axios.get(commentAPI),
      Comment.destroy({ where: { userId } })
    ])

    // get data from response
    const media = mediaResponse?.data
    const comments = commentResponse?.data?.comments?.data

    // 確認類型，回傳正確圖片 url
    const mediaUrl = media.media_url
    const thumbnailUrl = media.thumbnail_url
    const mediaType = media.media_type
    const imageUrl = mediaType === 'VIDEO' ? thumbnailUrl : mediaUrl

    const { caption, timestamp, permalink } = media
    const likeCount = media.like_count
    const commentsCount = media.comments_count

    // 搜尋或新增一筆 Media
    const [mediaNew, mediaCreated] = await Media.findOrCreate({
      where: { rawId: mediaRawId },
      defaults: {
        userId,
        rawId: mediaRawId,
        mediaType, likeCount, commentsCount, caption,
        timestamp, permalink, imageUrl
      }
    })

    // 如果有搜尋到則更新 Media 資料
    if (!mediaCreated) {
      await mediaNew.update({
        userId,
        rawId: mediaRawId,
        mediaType, likeCount, commentsCount, caption,
        timestamp, permalink, imageUrl,
        updatedAt: new Date()
      })
    }

    // write comments to db
    if (comments) {
      comments.forEach(comment => {
        comment.rawId = comment.id
        comment.mediaId = mediaNew.id
        comment.userId = userId
        delete comment.id
      })
      await Comment.bulkCreate(comments)
    }
  },
  setConditionAndAward: async (req) => {
    // get user data
    const user = getUser(req)
    const userId = user.id

    // get parameter
    const { repeatAmount, tagAmount, deadline, mediaId, awardNames, awardAmounts } = req.body

    // 搜尋或新增一筆 Condition
    const [conditionNew, conditionCreated] = await Condition.findOrCreate({
      where: { userId, mediaId },
      defaults: {
        repeatAmount, tagAmount, deadline, mediaId, userId
      }
    })

    // 如果有搜尋到則更新 Condition 資料
    if (!conditionCreated) {
      await conditionNew.update({
        repeatAmount, tagAmount, deadline, mediaId, userId,
        updatedAt: new Date()
      })
    }

    // 刪除 award from DB
    await Award.destroy({ where: { userId, mediaId } })

    // 處理 awards
    if (awardNames) {
      const awards = awardNames.map((_, index) => {
        const name = awardNames[index]
        const amount = awardAmounts[index]
        return { name, amount, mediaId, userId }
      })
      await Award.bulkCreate(awards)
    }
  }
}

module.exports = drawServices