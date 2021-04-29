const socket = io();
const myForm = document.getElementById('chat-form');
const chatMsg = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users')

///get Username and room from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

///Join Room 

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
    outputMessage(message);

    //scroll to the last message
   chatMsg.scrollTop = chatMsg.scrollHeight;
})


//Message Submit

myForm.addEventListener('submit', (e)=> {
    e.preventDefault();
    
    const msg = e.target.elements.msg.value;
    console.log(msg);
   
    ///Emmiting the message 
    socket.emit('chatMsg', msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();

});

////get the room and users

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outPutRoomUsers(users);
})

///Outputting the message in the DOM

const outputMessage = (message)=> {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

///output room DOM

const outputRoomName = (room) => {

 document.getElementById('room-name').value = room;
    
  roomName.innerText = room;
    
}
//users to DOM

const outPutRoomUsers = (users) => {
   const userHTML =  users.map(user => {
      return `<li>${user.username}</li>`
    }).join("");

    userList.innerHTML = userHTML;
}