const axios = require('axios')

const { getUser } = require('../helpers/auth-helpers')
const { Media, Comment, Condition, Award, Account, User } = require('../models')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const apiURL = 'https://graph.facebook.com/v12.0/'

const drawServices = {
  refreshMediaAndComment: async (req) => {
    // get user data
    const user = getUser(req)
    const accessToken = user.accessToken
    const accounts = user.Accounts

    // get parameter
    const { mediaEncryptId } = req.body
    const mediaId = cryptr.decrypt(mediaEncryptId)

    // 標記規則，可包含 英數._
    const RegExp = /^@\w[\w\.]*/

    // API url
    const mediaAPI = `
      ${apiURL}${mediaId}?fields=owner,like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp,permalink&access_token=${accessToken}`
    const commentAPI = `
      ${apiURL}${mediaId}?fields=comments{text,timestamp,username}&access_token=${accessToken}`

    // request api and delete comments from db 
    const [mediaResponse, commentResponse] = await Promise.all([
      axios.get(mediaAPI), axios.get(commentAPI)
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

    const ownerId = media.owner.id

    // 確認媒體歸屬是否為該使用者
    const accountMatched = accounts.some(account => account.id === ownerId)
    if (!accountMatched) throw new Error('貼文取得失敗')

    await Promise.all([
      // 寫入 lastMediaId to User
      await User.bulkCreate(
        [{ ...user, lastMediaId: mediaId }],
        { updateOnDuplicate: ['lastMediaId'] }
      ),
      // 寫入或更新 Media 資料
      Media.bulkCreate([{
        id: mediaId, accountId: ownerId,
        mediaType, likeCount, commentsCount, caption,
        timestamp, permalink, imageUrl,
      }], {
        updateOnDuplicate: ['accountId', 'ownerId', 'mediaType', 'likeCount', 'commentsCount', 'caption', 'timestamp', 'permalink', 'imageUrl']
      }),
      // write comments to db
      comments ? Comment.bulkCreate(
        comments.map(comment => {
          // 計算 tag 數量
          const texts = comment.text.split(' ');
          const tagAmount = texts.reduce((accumulator, text) => {
            const wordMatched = text?.match(RegExp)
            return wordMatched !== null ? accumulator += 1 : accumulator
          }, 0)
          return { ...comment, tagAmount, mediaId }
        })
        , {
          updateOnDuplicate: ['text', 'timestamp', 'username', 'tagAmount', 'mediaId']
        }
      ) : ''
    ])
  },
  setConditionAndAward: async (req) => {
    // get parameter
    const { repeatAmount, tagAmount, deadline, mediaEncryptId, awardNames, awardAmounts } = req.body
    const mediaId = cryptr.decrypt(mediaEncryptId)

    // 搜尋或新增一筆 Condition
    const [conditionNew, conditionCreated] = await Condition.findOrCreate({
      where: { mediaId },
      include: [Media],
      defaults: {
        repeatAmount, tagAmount, deadline, mediaId
      }
    })

    await Promise.all([
      // 如果有搜尋到則更新 Condition 資料
      !conditionCreated ? conditionNew.update({
        repeatAmount, tagAmount, deadline, mediaId
      }) : '',
      // 刪除 award from DB
      Award.destroy({ where: { mediaId } })
    ])

    // 處理 awards
    if (awardNames) {
      const awards = awardNames.map((_, index) => {
        const name = awardNames[index]
        const amount = awardAmounts[index]
        return { name, amount, mediaId }
      })
      await Award.bulkCreate(awards)
    }
  },
  getAccountAndMedia: async (req) => {
    const user = getUser(req)
    const userId = user.id
    const accessToken = user.accessToken
    const { accountSelected, before, after } = req.query
    let accounts, media, paging

    const mediaQuery = 'media' + (after ? `.after(${after})` : '')
      + (before ? `.before(${before})` : '') + '.limit(4)'
    const accountSelectedDecrypt = accountSelected
      ? cryptr.decrypt(accountSelected) + ''
      : ''

    // API url
    const accountAPI = `${apiURL}me/accounts/?fields=instagram_business_account{name}&access_token=${accessToken}`
    const mediaAPI = `${apiURL}${accountSelectedDecrypt}?fields=${mediaQuery}{like_count,comments_count,caption,media_type,media_url,thumbnail_url,timestamp,permalink}&access_token=${accessToken}`

    // 已選擇項目 
    if (accountSelected) {
      const [accountsNew, mediaResponse] = await Promise.all([
        Account.findAll({
          where: { userId },
          order: [['id', 'DESC']],
          raw: true
        }),
        axios.get(mediaAPI)
      ])

      media = mediaResponse?.data?.media?.data
      paging = mediaResponse?.data?.media?.paging

      media.forEach(medium => medium.id = cryptr.encrypt(medium.id))

      accounts = accountsNew.map(account => {
        account.encryptId = cryptr.encrypt(account.id)
        return account
      })
    }
    // 未選擇項目|初次進入頁面
    else {
      const accountResponse = await axios.get(accountAPI)
      accounts = accountResponse?.data?.data

      accounts = accounts.map(account => {
        const ig = account.instagram_business_account
        return {
          id: ig.id,
          userId,
          name: ig.name,
          encryptId: cryptr.encrypt(ig.id)
        }
      })

      // 寫入資料 to Account
      await Account.bulkCreate(accounts, {
        updateOnDuplicate: ['name', 'userId']
      })
    }

    return { accounts, media, paging, accountSelected }
  }
}

module.exports = drawServices