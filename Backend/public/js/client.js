const socket = io();

var username; 
var chats = document.querySelector(".chats");
let users_list = document.querySelector(".user-list");
let user_count = document.querySelector(".user-count")
let msg_send = document.querySelector("#msg-send");
let user_msg = document.querySelector("#user-msg");

do {
    username=prompt("Enter your Username: ")
} while (!username)

socket.emit("new-user-joined",username)

// user join notify
socket.on("user-connected", (socket_name) => {
    userJoinLeft(socket_name, 'joined');
});

//join/left status
function userJoinLeft(name, status) {
    let div = document.createElement("div");
    div.classList.add("user-join");
    let content = `<p id="new-user"><b>${name}</b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
}

socket.on("user-disconnected", (user) => {
    userJoinLeft(user, 'left');
})

// update userlist
socket.on("user-list", (users) => {
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for (let i = 0; i < users_arr.length; i++){
        let p = document.createElement("p");
        p.id="new-user"
        p.innerText = users_arr[i];
        users_list.appendChild(p)
    }
    user_count.innerHTML = users_arr.length;
})

msg_send.addEventListener("click", () => {
    let data = {
        user: username,
        msg: user_msg.value
    };
    if (user_msg.value != '') {
        appendMessage(data, "out");
        socket.emit("message", data);
        user_msg.value = '';
    }
});

function appendMessage(data, status) {
    let div = document.createElement("div");
    div.classList.add("message", status);
    let content = `
    <h5>${data.user}</h5>
    <p>${data.msg}</p>
    `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
}

socket.on("message", (data) => {
    appendMessage(data,"in")
})