const qrcode = require('qrcode-terminal');
const express = require("express");
const app = express();
const config = require('./config.json');
const port = process.env.PORT || config.port;
const SESSION_FILE_PATH = './session.json';
const fs = require('fs');

const { Client } = require('whatsapp-web.js');
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    session: sessionData
});

var SEND_TO = "5216181890138";

// Path where the session data will be stored


// Load the session data if it has been previously saved




// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    try{
    	client.sendMessage(SEND_TO+ "@c.us", "Envia !piedra o !papel o !tijeras y el BOT te respondera");
    }
    catch(error)
    {
    	console.log(error);
    }
    
});

client.on('message', message => {
	if(message.body === '!ping') {
		client.sendMessage(message.from, 'pong');
	}
	if(message.body === '!piedra') {
		client.sendMessage(message.from, 'papel');
	}
	if(message.body === '!papel') {
		client.sendMessage(message.from, 'tijeras');
	}
	if(message.body === '!tijeras') {
		client.sendMessage(message.from, 'piedra');
	}
});


app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
    client.initialize();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/send', (req, res) => {
	//console.log(req.query.number)
  //console.log(req);
  var SEND_TO = "521"+req.query.number;
  try{
  	 client.sendMessage(SEND_TO+ "@c.us", req.query.message);
  	 res.send("Mensaje enviado");
  }catch(error)
  {
  	console.log(error)
  }
 
})