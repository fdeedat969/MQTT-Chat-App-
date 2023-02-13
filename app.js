const express = require('express');
const app = express();
const mqtt = require('mqtt');
const port = 8000;
const host = 'localhost';// '192.168.0.19'
const socket = require('socket.io');

// data buffer
let mqttData = {
    topic:'', 
    value:0
};

// Static filessss
app.use(express.static('./public'))

//get request and server shit
app.get('/',(req,res)=>{
    res.send('index.html');
});

// app.get('/info',(req,res)=>{
//     res.status(200).json({data:"hellowwww"});
// });

const server = app.listen(port,host,()=>{
    console.log(`listening on port: ${port}` );
});
const io = socket(server);

// mqtt retarded shit
const topic = 'deedat/iotkewren';//'itb/tf/iiot/13319078/input/SL1';
const client = mqtt.connect('mqtt://iot.tf.itb.ac.id');

//subscribing to topic
client.on('connect', ()=>{
    console.log('connected');
    client.subscribe(topic,()=>{
        console.log(`Subscribed to ${topic}`);
    });
});

//socket
io.on('connection',(socket)=>{
    console.log(socket.id);
    // masukin ke data object buffer
    client.on('message',async (topic,payload)=>{
        mqttData = {
            topic:topic,
            value:payload.toString()
        };
        await io.sockets.emit('mqtt',mqttData);
    });
    
    socket.on('chat',(stream)=>{
        io.sockets.emit('chat',stream); // useful for publishing to mqtt topic
        console.log(stream,socket.id);
    });

    socket.on('mqtt',(stream)=>{
        //io.sockets.emit('mqtt',stream);
        client.publish(topic,stream.value);
        console.log(stream, socket.id);
    });
});