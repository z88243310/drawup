const navbar = document.querySelector('.navbar')

const collapse = document.querySelector('.navbar-collapse')

// 判斷使用者按下上一頁時，再次刷新洗掉 loading animation
window.onpageshow = function (event) {
  if (event.persisted) {
    window.location.reload()
  }
};

// logo brand
navbar.addEventListener('click', function onNavbarClicked(e) {
  const circularG = document.querySelector('#circularG')
  const target = e.target

  if (target.matches('.navbar-brand i') || target.matches('.navbar-brand span')
  ) {
    circularG.style.display = 'block'
  }
})

// login , logout
collapse.addEventListener('click', function onListClicked(e) {
  const circularG = document.querySelector('#circularG')
  const target = e.target

  if (target.matches('.nav-link') || target.matches('.nav-link .btn-logout') ||
    target.matches('.nav-link .btn-login')) {
    setTimeout(() => {
      circularG.style.display = 'block'

    }, 1000)
  }
})
