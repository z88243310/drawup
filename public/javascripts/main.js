const navbar = document.querySelector('.navbar')

const collapse = document.querySelector('.navbar-collapse')

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
    circularG.style.display = 'block'
  }
})
