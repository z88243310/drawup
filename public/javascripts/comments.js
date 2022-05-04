const awardContainer = document.querySelector('#award-container')
const awardDraggables = document.querySelectorAll('.award-draggable')

// 增刪獎項按鈕
const addBtn = document.querySelector('#add-btn')
const deleteBtns = document.querySelectorAll('.delete-btn')

// 貼文按鈕
const postIcon = document.querySelector('.to-post-page')

// 刷新按鈕
const reloadIcon = document.querySelector('.reload-page')

// 未登入時製造一個空獎項
if (!awardContainer.children.length) createAward()

// 創造一個獎項
function createAward() {
  const children = awardContainer?.lastElementChild?.children
  const id = children ? Number(children[0].innerText) + 1 : 1

  const length = awardContainer?.children?.length
  if (length >= 10) return

  const tr = document.createElement('tr')
  tr.innerHTML = `
      <th scope="row">${id}</th>
      <td><input type="text" class="award-name" name="awardNames[]" required></td>
      <td><input type="number" class="award-amount" min="1" max="100" name="awardAmounts[]" value="1" required>
      </td>
      <td style="text-align:center"><i class="delete-btn fas fa-times"</i></td>
  `
  tr.classList.add('award-draggable')
  tr.draggable = true

  awardContainer.appendChild(tr)
  draggableEventFunction(awardContainer, tr)

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

// award dragger
awardDraggables.forEach(awardDraggable => {
  draggableEventFunction(awardContainer, awardDraggable)
})

// 取得拖曳中下方元素
function getDragAfterElement(awardContainer, y) {
  const draggableElements = [...awardContainer.querySelectorAll('.award-draggable:not(.award-dragging')]

  return draggableElements.reduce((closest, draggableElement) => {
    const box = draggableElement.getBoundingClientRect()

    // 正在拖曳的物件鼠標位置與非拖曳的物件中心點的偏差值
    const offset = y - box.top - box.height / 2

    // 如果誤差值比先前更接近，回傳最靠近的元素
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: draggableElement }
    }
    // 否則維持不變 
    else { return closest }

  }, { offset: Number.NEGATIVE_INFINITY }).element
}

// 計算次序
function calculateAwardNumber() {
  const awardDraggables = document.querySelectorAll('.award-draggable')
  awardDraggables.forEach((awardDraggable, index) => {
    awardDraggable.children[0].innerText = index + 1
  })
}

// 拖曳監聽函式
function draggableEventFunction(awardContainer, awardDraggable) {
  awardDraggable.addEventListener('dragstart', e => {
    awardDraggable.classList.add('award-dragging')
  })

  awardDraggable.addEventListener('dragend', () => {
    awardDraggable.classList.remove('award-dragging')
    calculateAwardNumber()
  })

  awardContainer.addEventListener('dragover', e => {
    e.preventDefault()

    // 以鼠標現在的 Y 座標，取德最靠近的元素
    const afterElement = getDragAfterElement(awardContainer, e.clientY)
    const awardDragging = document.querySelector('.award-dragging')

    // 如果沒有回傳 afterElement 就放到 awardContainer 最下面
    if (afterElement === undefined) {
      awardContainer.appendChild(awardDragging)

      // 否則就把 awardDragging 放在 afterElement 前一個位置
    } else {
      awardContainer.insertBefore(awardDragging, afterElement)
    }

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
