const awardContainer = document.querySelector('#award-container')
const awardDraggables = document.querySelectorAll('.award-draggable')

const btnAdd = document.querySelector('#btn-add')
const btnDelete = document.querySelector('#btn-delete')

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
    <tr class="award-draggable" draggable="true">
      <th scope="row">${id}</th>
      <td><input type="text" class="award-name" name="awardNames[]" required></td>
      <td><input type="number" class="award-amount" min="1" max="100" name="awardAmounts[]" value="1"
          required>
      </td>
    </tr>
  `
  awardContainer.appendChild(tr)
}

// 增加獎項
btnAdd.addEventListener('click', function onAddButtonClicked(event) {
  event.preventDefault()
  createAward()
})

// 減少獎項
btnDelete.addEventListener('click', function onAddButtonClicked(event) {
  event.preventDefault()
  const length = awardContainer?.children?.length
  const lastChild = awardContainer?.lastElementChild
  if (length > 1) lastChild.remove()
})

// 貼文按鈕
postIcon.addEventListener('click', function onPostIconClicked(event) {
  const target = event.target
  const form = target.closest('form')
  form.submit()
})

// 貼文按鈕
reloadIcon.addEventListener('click', function onReloadIconClicked(event) {
  const target = event.target
  const form = target.closest('form')
  form.action = '/draw?_method=put'
  form.method = 'post'
  form.submit()
})

// award dragger
console.log(awardContainer)
console.log(awardDraggables)

