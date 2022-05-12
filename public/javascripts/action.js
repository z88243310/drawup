const drawName = document.querySelector('#draw-name')
const drawAward = document.querySelector('#draw-award')

const circularG = document.querySelector('.draw-container #circularG')

const btnDraw = document.querySelector('.btn-draw')
const awardTitles = document.querySelectorAll('.award-title')
const awardBodies = document.querySelectorAll('.award-body')

// 紀錄抽獎次序
let awardIndex = 0

// 獎項資料 
let awardData = luckyData.map(lucky => lucky.award)

// 打亂 luckyData
for (let k = 0; k < 1000; k++) {
  for (let i = luckyData.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [luckyData[i], luckyData[j]] = [luckyData[j], luckyData[i]];
  }
}

const setIntervalX = (fn, delay, times) => {
  if (!times) {
    drawName.innerText = luckyData[awardIndex].name
    drawAward.innerText = luckyData[awardIndex].award
    return
  }
  if (times <= 40) delay = (40 - times) * 2 + 10
  if (times <= 5) delay = 100

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn()
      resolve(setIntervalX(fn, delay, times - 1))
    }, delay)
  })
}


// 點擊後將資料放入清單
btnDraw.addEventListener('click', async () => {
  if (awardIndex >= luckyData.length) return

  const name = luckyData[awardIndex].name
  const award = luckyData[awardIndex].award
  const times = awardData.length > 1 ? 100 : 20

  // show loading
  btnDraw.style.display = 'none'
  circularG.style.display = 'block'
  circularG.style.position = 'relative'
  circularG.style.top = 'unset'
  circularG.style.left = 'unset'
  circularG.style.transform = 'unset'

  // 拉霸動畫，回傳得獎者
  await setIntervalX(() => {
    const repeatDataRandom = Math.floor(Math.random() * repeatData.length)
    const awardDataRandom = Math.floor(Math.random() * awardData.length)
    drawName.innerText = repeatData[repeatDataRandom].name
    drawAward.innerText = awardData[awardDataRandom]
  }, 10, times)


  // 將得獎名單放入獎項清單
  Array.from(awardTitles).forEach((awardTitle, index) => {
    if (awardTitle.innerText === award) {
      const children = awardBodies[index]?.lastElementChild?.children
      const id = children ? Number(children[0].innerText) + 1 : 1
      const tr = document.createElement('tr')

      tr.innerHTML = `
        <th scope="row">${id}</th>
        <td class="text-nowrap text-truncate" style="max-width:200px" data-toggle="tooltip"
          data-placement="top" title="${name}">${name}
        </td>
    `
      awardBodies[index].appendChild(tr)

      // next , and remove self
      awardIndex++
      repeatData = repeatData.reduce((data, repeat) => {
        if (repeat.name !== name) data.push(repeat)
        return data
      }, [])
    }
  })

  // 整理名單
  const index = awardData.indexOf(award)
  awardData.splice(index, 1)
  repeatData = repeatData.filter(repeat => repeat.name !== name)

  // show button
  btnDraw.style.display = 'block'
  circularG.style.display = 'none'
})

