const btnDraw = document.querySelector('.btn-draw')
const awardTitles = document.querySelectorAll('.award-title')
const awardBodies = document.querySelectorAll('.award-body')

// const luckyData = {{{ luckyData }}}
// const repeatData = {{{ repeatData }}}

// 獎項資料 
const awardData = luckyData.reduce((data, lucky) => {
  const award = lucky.award
  if (!data.includes(award)) data.push(award)
  return data
}, [])

// 打亂 luckyData
for (let k = 0; k < 1000; k++) {
  for (let i = luckyData.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [luckyData[i], luckyData[j]] = [luckyData[j], luckyData[i]];
  }
}

// 點擊後將資料放入清單
let count = 0
btnDraw.addEventListener('click', () => {
  if (count >= luckyData.length) return

  const name = luckyData[count].name
  const award = luckyData[count].award

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
      count++
      repeatData = repeatData.reduce((data, repeat) => {
        if (repeat.name !== name) data.push(repeat)
        return data
      }, [])
    }
  })
})

