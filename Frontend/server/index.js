const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config();
const express = require("express");
const APP = express();
const http = require('http');
const MQTT = require('mqtt');

const server = http.createServer(APP);
const { Server } = require("socket.io");

/*yes i realize it is very dangerous to have my credentials out in the open like this. it should be in an env var file
  */
const SERVERHOSTNAME = "179a4fcf22644a738e506f7b145adea1.s1.eu.hivemq.cloud"; 
const PORT = 8883;
const USERNAME = "team14";
const PASSWORD = "GirlCoded12";
const CLIENTID = "team14"; 
const CONNECTURL = `mqtts://${SERVERHOSTNAME}:${PORT}`;
const TOPIC = 'Temp';
const EXPRESSPORT = 3001;
const io = new Server(server); //creates server instance

const client = MQTT.connect(CONNECTURL, {
    clientId: CLIENTID, 
    clean: true,
    connectTimeout: 7200,
    username: USERNAME,
    password: PASSWORD,
    reconnectPeriod: 10000,
});

/*publish msgs to PICO for LCD commands 
  */
APP.post('/turnOnLCD', (req, res) => {
    client.publish('lcd/command', 'on', {}, (error) => {
        if(error) {
            console.error('Error publishing message:', error);
            return res.status(500).send('Could not turn on LCD');
        }
        res.send('LCD Turn On command sent.');
    });
});
   
APP.post('/turnOffLCD', (req, res) => {
    client.publish('lcd/command', 'off', {}, (error) => {
        if(error) {
            console.error('Error publishing message:', error);
            return res.status(500).send('Could not turn off LCD');
        }
        res.send('LCD Turn Off command sent.');
    });
});
   
  
  APP.listen(EXPRESSPORT, () => {
    console.log(`Server is running at http://localhost:${EXPRESSPORT}`);
  }
  );

let ay_latest = {}; 

client.on("error", function (error) { console.log("Can't connect" + error) })

const corsOptions = {
    origin: '*'
}

APP.use(cors(corsOptions))

io.on('connection', function (socket) {
    console.log('a user connected'); //to see if a connection was made w client
    socket.on('Client', (message) => {
        console.log(message)
    })
    console.log('Emitting')
    setInterval(function () {
        socket.emit('Echo', ay_latest.value);
    }, 1000); //1000ms
    socket.on("disconnect", () => console.log("Client disconnected"));
});

client.on('connect', async () => {
    console.log('Connected')
    client.subscribe([TOPIC], () => {
        console.log('Echo', `Subscribe to TOPIC '${TOPIC}'`)
    })
})

client.on('message', (TOPIC, payload) => {
    console.log('Received Message:', TOPIC, payload.toString())
    ay_latest.value = payload.toString()
})


server.listen(3000, () => { console.log("Server started") })
