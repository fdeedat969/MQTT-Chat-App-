const socket = io();
const host = 'localhost'; // 192.168.0.19
socket.connect(`http://${host}:8000`);

var i = 0;
// event listener for websocket changes
socket.on('mqtt',(stream)=>{
    i = i + 1;
    if (i>3){
        i = 0;
        document.getElementById("output-mqtt").innerHTML += `${stream.value}`+ "<br />";
        console.log(stream);
        dataClient = {
            topic: stream.topic,
            value: stream.value
        };
    }
});

// socket.on('chat',(stream)=>{
//     document.getElementById("output-message").innerHTML= stream.message;
//     console.log(stream);
// });

// DOM thingsss
let sendMessage = document.getElementById("sendChat"),
    mqttButton = document.getElementById("sendMqtt"),
    handle = document.getElementById("handle"),
    message = document.getElementById("message"),
    output = document.getElementById("output"),
    messages = document.getElementById("messages");

// sendMessage.addEventListener("click",sendChat);
mqttButton.addEventListener("click",sendMqtt);

// event functions
async function sendMqtt(){
    await socket.emit('mqtt',{
        value: handle.value,
    });
};

// async function sendChat(){
//     await socket.emit('chat',{
//         message: message.value,
//     });
// };

// async function getInfo(e){
//     e.preventDefault()
//     let res = await fetch('http://localhost:8000/info',{
//         method: 'GET'
//     });
//     console.log(res);
//     let data = await res.json();
//     document.getElementById("output").innerHTML= data.data;
// }