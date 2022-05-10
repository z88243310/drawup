// loading
const circularG = document.querySelector('#circularG')

// 選擇 IG 帳號
const igSelect = document.querySelector('#ig-select')

// 上下頁
const btnPages = document.querySelectorAll('.btn-page')

// 點選貼文
const cards = document?.querySelectorAll('.card')

// 選擇 IG 
igSelect.addEventListener('change', () => {
  circularG.style.display = 'block'
})

// 上下頁
btnPages.forEach(btnPage => {
  btnPage.addEventListener('click', () => {
    circularG.style.display = 'block'
  })
})

// 貼文卡片
cards?.forEach(card => {
  card.addEventListener('click', () => {
    circularG.style.display = 'block'
  })
})



