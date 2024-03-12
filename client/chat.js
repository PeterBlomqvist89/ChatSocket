const socket = io();
// import { formatDistanceToNow } from "date-fns";
import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns";
const messages = document.querySelector('.messages');
const chatForm = document.querySelector('#chatForm');
const chatMessage = document.querySelector('#chatMessage');
const feedback = document.querySelector('#feedback');
const chat = document.querySelector('.chat');


const userName = new URLSearchParams(window.location.search).get('username')
document.querySelector('#me').innerText = userName;





// När vi som klient har kopplat upp oss
socket.on('connect', () => {
  // Skapar eventet 'user' och skickar med användarnamnet
  socket.emit('user', userName)
})

// när en ny användare har anslutit
socket.on('new_user_connection', (feedbackString) => {
  // messages.innerHTML += `<p class="inline-feedback">${feedbackString}</p>`
  messages.appendChild(createElement('p', 'inline-feedback', feedbackString))
})

// När någon har skickat ett meddelande
socket.on('new_message', message => {
  // Bygg ihop ett meddelande
  const message_div = createElement('div', 'single-message')
  if(message.id === socket.id) message_div.classList.add('right')
  const messageName_p = createElement('p', 'single-message__name', message.userName)
  const msg_p = createElement('p', 'single-message__msg', message.message)

  const time_p = createElement('p', 'timestamp', formatDistanceToNow(message.createdAt))
  
  setInterval(() => {
    time_p.innerText = formatDistanceToNow(message.createdAt)
  }, 60000)

  message_div.append(time_p, messageName_p, msg_p)

  // Lägger till meddelandet i chaten
  messages.append(message_div)
})


// Någon skriver ett meddelande
socket.on('typing', data => {
    feedback.classList.remove('d-none')
    feedback.innerText = `${data} is typing..`

    // om personen slutar skriva så tar vi bort statusen efter 5sekunder
    setTimeout(() => {
        feedback.classList.add('d-none')
        feedback.innerText = ''
    }, 5000)
})








chatMessage.addEventListener('keyup', () => {
    if(chatMessage.value.length > 0) {
        socket.emit('typing', userName)
    }
})


// SUBMIT
chatForm.addEventListener('submit', e => {
  e.preventDefault()

  if(chatMessage.value.trim() === '') return

  socket.emit('message', {
    id: socket.id,
    message: chatMessage.value,
    userName,
    createdAt: Date.now()
  })

  chatMessage.value = ''
  chatMessage.focus()
})



// Helpers
// Bygg ihop ett element
const createElement = (type, className, text) => {
  const element = document.createElement(type)
  element.className = className ? className : ''
  element.innerText = text ? text : ''

  return element
}