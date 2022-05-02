if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// use cryptr
const Cryptr = require('cryptr')
const cryptr = new Cryptr(process.env.CRYPTR_SECRET)

const dayjs = require('dayjs') // 載入 dayjs 套件
const relativeTime = require('dayjs/plugin/relativeTime')
require('dayjs/locale/zh-tw')
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)


module.exports = {
  // 取得當年年份作為 currentYear 的屬性值，並導出
  currentYear: () => dayjs().year(),

  // 比較兩輸入值是否一致
  ifCond: function (a, b, options) {
    if (String(a) === String(b)) {
      return options.fn()
    } else {
      return options.inverse()
    }
  },
  // AES compare
  AESCompare: function (a, b, options) {
    if (!a || !b) return
    if (cryptr.decrypt(a) === cryptr.decrypt(b)) {
      return options.fn()
    } else {
      return options.inverse()
    }
  },
  // 取得當年年份作為 currentYear 的屬性值，並導出
  adjustDate: date => dayjs(date).format('YYYY-MM-DD HH:mm'),
  relativeTime: date => dayjs(date).fromNow(true),
  formatDate: date => dayjs(date).format('YYYY-MM-DD'),
  now: () => {
    const now = new Date()
    return dayjs(now).format('YYYY-MM-DD')
  },
  // 位移 index +1
  increment: value => parseInt(value) + 1,
  // 將物件轉乘 json 用於傳值
  toJson: object => JSON.stringify(object)
}
