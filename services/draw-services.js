const axios = require('axios')

const dayjs = require('dayjs')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore)

const { getUser } = require('../helpers/auth-helpers')
const { Media, Comment, Condition, Award, Account, User } = require('../models')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const apiURL = 'https://graph.facebook.com/v13.0/'

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
    let commentAPI = `
      ${apiURL}${mediaId}/comments?fields=text,timestamp,username,user&access_token=${accessToken}&limit=50&format=json&pretty=0`

    // request api and delete comments from db 
    const [mediaResponse, commentResponse] = await Promise.all([
      axios.get(mediaAPI), axios.get(commentAPI), Comment.destroy({ where: { mediaId } })
    ])

    // get data from response
    const media = mediaResponse?.data
    let comments = commentResponse?.data?.data
    let commentPagingNext = commentResponse?.data?.paging?.next

    // get all comment data if next page exits
    while (commentPagingNext) {
      const commentResponse = await axios.get(commentPagingNext)

      comments.push(...(commentResponse?.data?.data))
      commentPagingNext = commentResponse?.data?.paging?.next
    }

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
    if (!accountMatched) throw new Error('貼文取得失敗！')

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
        updateOnDuplicate: ['accountId', 'ownerId', 'mediaType', 'likeCount', 'commentsCount', 'caption', 'timestamp', 'permalink', 'imageUrl', 'updatedAt']
      }),
      // write comments to db
      comments ? Comment.bulkCreate(
        comments.reduce((commentSelectedList, comment) => {
          // 過濾本人留言
          if (comment?.user?.id === ownerId) return commentSelectedList

          // 計算 tag 數量
          const texts = comment.text.split(' ');
          const tagAmount = texts.reduce((accumulator, text) => {
            const wordMatched = text?.match(RegExp)
            return wordMatched !== null ? accumulator += 1 : accumulator
          }, 0)

          commentSelectedList.push({ ...comment, tagAmount, mediaId })
          return commentSelectedList
        }, [])
      ) : ''
    ])
  },
  setConditionAndAward: async (req) => {
    // get parameter
    const { repeatAmount, tagAmount, orderSelected, deadline, keyword, mediaEncryptId, awardNames,
      awardAmounts } = req.body
    const mediaId = cryptr.decrypt(mediaEncryptId)

    // 搜尋或新增一筆 Condition
    const [conditionNew, conditionCreated] = await Condition.findOrCreate({
      where: { mediaId },
      include: [Media],
      defaults: {
        repeatAmount, tagAmount, deadline, orderSelected, keyword, mediaId
      }
    })

    await Promise.all([
      // 如果有搜尋到則更新 Condition 資料
      !conditionCreated ? conditionNew.update({
        repeatAmount, tagAmount, deadline, orderSelected, keyword, mediaId
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
  },
  getAllDataOfMedia: async (req) => {
    const user = getUser(req)
    const lastMediaId = user?.lastMediaId
    const accounts = user?.Accounts

    if (!lastMediaId) return {}

    // 取得 media and comments
    let media = await Media.findByPk(lastMediaId, {
      include: [Comment, Condition, Award],
      order: [
        ['updated_at', 'DESC'],
        [Comment, 'timestamp', 'DESC'],
        [Award, 'id', 'ASC']
      ],
      nest: true
    })

    if (!media) return {}

    // 整理資訊，加密 id
    media = media.toJSON()
    media.id = cryptr.encrypt(media.id)

    // 確認媒體歸屬是否為該使用者
    const accountMatched = accounts.some(account => account.id === media.accountId)
    if (!accountMatched) throw new Error('貼文取得失敗！')

    return {
      awards: media.Awards,
      condition: media.Condition,
      comments: media.Comments,
      media
    }
  },
  // draw action
  drawAction: async (req) => {
    const user = getUser(req)
    const lastMediaId = user?.lastMediaId

    const { repeatAmount, tagAmount, deadline, keyword, orderSelected,
      mediaEncryptId, awardNames, awardAmounts } = req.body
    const mediaId = cryptr.decrypt(mediaEncryptId)
    let awardCount = 0
    const repeatObj = {}

    if (mediaId !== lastMediaId) throw new Error('貼文選擇錯誤！')

    // 檢查設定格式
    const numberRegExp = /[\d]+/
    const dateRegExp = /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5])([0-9])$/

    if (!repeatAmount.match(numberRegExp) || Number(repeatAmount) < 1 || Number(repeatAmount) > 20) {
      throw new Error('重複留言個數應為 1 - 20')
    }
    if (!tagAmount.match(numberRegExp) || Number(tagAmount) < 0 || Number(tagAmount) > 10) {
      throw new Error('標記人數應為 0 - 10')
    }
    if (!deadline.match(dateRegExp)) {
      throw new Error('日期格式不正確')
    }

    // 檢查獎項格式
    if (awardNames.length < 1 || awardAmounts.length < 1) {
      throw new Error('至少設定一個獎項！')
    }
    awardNames.forEach((awardName, index) => {
      const awardAmount = awardAmounts[index]

      if (!awardName?.trim()) throw new Error('獎項不能空白！')
      if (!awardAmount.match(numberRegExp) || Number(awardAmount) < 1) {
        throw new Error('獎項名額至少1人！')
      }

      awardCount += Number(awardAmount)
    })

    // 取出抽獎名單
    let comments = await Comment.findAll({ where: { mediaId }, raw: true })

    // 過濾條件：重複個數、標記、日期、關鍵字
    comments = comments.filter(comment => {
      const deadlineNew = dayjs(deadline).format('YYYY-MM-DD HH:mm')
      const timestampNew = dayjs(comment.timestamp).format('YYYY-MM-DD HH:mm')
      const commentTagAmount = comment.tagAmount
      const commentUsername = comment.username

      if (dayjs(timestampNew).isSameOrBefore(deadlineNew) &&
        commentTagAmount >= tagAmount && (
          repeatObj[commentUsername] < repeatAmount ||
          repeatObj[commentUsername] === undefined
        ) && comment.text.includes(keyword)
      ) {
        // record repeatObj
        if (repeatObj[commentUsername] === undefined) {
          repeatObj.length = repeatObj.length ? repeatObj.length + 1 : 1
          repeatObj[commentUsername] = 1
        }
        else repeatObj[commentUsername]++
        return true
      }
    })

    // 確認獎項數量是否過多 & 是否有抽獎者
    if (repeatObj.length < awardCount) throw new Error('獎項不能多於抽獎人數')
    delete repeatObj.length
    if (comments.length <= 0) throw new Error('沒有符合條件的抽獎者')

    // 名單洗牌
    for (let k = 0; k < 1000; k++) {
      for (let i = comments.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [comments[i], comments[j]] = [comments[j], comments[i]];
      }
    }

    // 過濾掉重複中獎
    const luckySet = new Set()
    for (let i = 0; i < comments.length; i++) {
      const commentUsername = comments[i].username

      if (!luckySet.has(commentUsername)) luckySet.add(commentUsername)
      if (luckySet.size === awardCount) break;
    }

    // 平整獎項 
    const awardList = []
    for (let i = 0; i < awardNames.length; i++) {
      for (let j = 0; j < awardAmounts[i]; j++) {
        awardList.push(awardNames[i])
      }
    }

    // 放入獎項，回傳中獎清單
    const luckyList = Array.from(luckySet).map((lucky, index) => {
      return { name: lucky, award: awardList[index] }
    })

    // 調整開獎排序 luckyList,awardList
    if (orderSelected === 'rand') {
      for (let k = 0; k < 1000; k++) {
        for (let i = luckyList.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [luckyList[i], luckyList[j]] = [luckyList[j], luckyList[i]];
          [awardList[i], awardList[j]] = [awardList[j], awardList[i]];
        }
      }
    }
    else if (orderSelected === 'desc') {
      for (let i = 0; i < luckyList.length / 2; i++) {
        [luckyList[i], luckyList[luckyList.length - 1 - i]] = [luckyList[luckyList.length - 1 - i], luckyList[i]];
        [awardList[i], awardList[luckyList.length - 1 - i]] = [awardList[luckyList.length - 1 - i], awardList[i]];
      }
    }

    // 參加者清單
    const repeatList = Object.entries(repeatObj).map(repeat => {
      return { name: repeat[0], repeatAmount: repeat[1] }
    })

    // 回傳得獎者名單
    return {
      luckyList, repeatList, awardNames, awardList,
      drawerList: comments,
      orderSelected
    }
  }
}

module.exports = drawServices