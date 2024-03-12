const form = document.querySelector('#login-form')

form.addEventListener('submit', e => {
  e.preventDefault()

  const input = document.querySelector('#username')
  const usernameError = document.querySelector('#username-error')
  usernameError.style.display = 'none';
  if(input.value.trim() === '') {
    usernameError.style.display = 'block';
    return
  }

  form.submit()
})