const award = document.querySelector('#award')
const btnAdd = document.querySelector('#btn-add')
const btnDelete = document.querySelector('#btn-delete')

btnAdd.addEventListener('click', function onAddButtonClicked(event) {
  event.preventDefault()
  const children = award?.lastElementChild?.children
  const id = children ? Number(children[0].innerText) + 1 : 1
  const raw = `
      <tr>
        <th scope="row">${id}</th>
        <td><input type="text" class="item-name" name="itemName-${id}"></td>
        <td><input type="number" class="item-num" min="1" max="5" name="itemNum-${id}" value="1"></td>
      </tr>
      `
  award.innerHTML += raw
})

btnDelete.addEventListener('click', function onAddButtonClicked(event) {
  event.preventDefault()
  const length = award?.children?.length
  const lastChild = award?.lastElementChild
  if (length > 1) lastChild.remove()
})
