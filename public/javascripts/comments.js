const awardContainer = document.querySelector('#award-container')
const awardDraggables = document.querySelectorAll('.award-draggable')

// 增刪獎項按鈕
const addBtn = document.querySelector('#add-btn')
const deleteBtns = document.querySelectorAll('.delete-btn')

// 貼文按鈕
const postIcon = document.querySelector('.to-post-page')

// 刷新按鈕
const reloadIcon = document.querySelector('.reload-page')

// award draggable and sortable
const sortable = Sortable.create(awardContainer, {
  handle: '.tag-move',
  animation: 100,
  ghostClass: 'ghost',
  sort: true,
  onEnd: () => {
    calculateAwardNumber()
  }
})

// 計算次序
function calculateAwardNumber() {
  const awardDraggables = document.querySelectorAll('.award-draggable')
  console.log(awardDraggables)
  awardDraggables.forEach((awardDraggable, index) => {
    awardDraggable.children[0].innerText = index + 1
  })
}

// 刪除監聽函式
function deleteBtnEventFunction(deleteBtn) {
  deleteBtn.addEventListener('click', function onAddButtonClicked(event) {
    const parentElement = deleteBtn.closest('tr')

    parentElement.remove()
    calculateAwardNumber(awardDraggables)
  })
}


// 未登入時製造一個空獎項
if (!awardContainer.children.length) {
  for (let i = 0; i <= 10; i++)  createAward()
}

// 創造一個獎項
function createAward() {
  const children = awardContainer?.lastElementChild?.children
  const id = children ? Number(children[0].innerText) + 1 : 1

  const length = awardContainer?.children?.length
  if (length >= 10) return

  const tr = document.createElement('tr')
  tr.innerHTML = `
      <th class="tag-move" scope="row">${id}</th>
      <td><input type="text" class="award-name" name="awardNames[]" required></td>
      <td><input type="number" class="award-amount" min="1" max="100" name="awardAmounts[]" value="1" required>
      </td>
      <td style="text-align:center"><i class="delete-btn fas fa-times"</i></td>
  `
  tr.classList.add('award-draggable')

  awardContainer.appendChild(tr)

  const deleteBtn = tr.querySelector('.delete-btn')
  deleteBtnEventFunction(deleteBtn)
}

// 增加獎項
addBtn.addEventListener('click', function onAddButtonClicked(event) {
  event.preventDefault()
  createAward()
})

// 減少獎項
deleteBtns.forEach(deleteBtn => {
  deleteBtnEventFunction(deleteBtn)
})

// 選擇貼文按鈕
postIcon.addEventListener('click', function onPostIconClicked(event) {
  const target = event.target
  const form = target.closest('form')
  form.submit()
})

// 刷新留言按鈕
reloadIcon.addEventListener('click', function onReloadIconClicked(event) {
  const target = event.target
  const form = target.closest('form')
  form.action = '/draw?_method=put'
  form.method = 'post'
  form.submit()
})