var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var cmd=require('node-cmd');

import SocketServer from './SocketServer'
import SocketServerMock from './SocketServerMock'

const net = require('net')
const split = require('split')

app.use(express.static('../client/build'))

cmd.get(
    'i2cdetect -y 1',
    function(err, data, stderr){
        console.log('I2C devices : ',data)
    }
);

const port = process.env.RESIN == 1 ? 80 : 3001
const socketServer = process.env.RESIN == 1 ? new SocketServer() : new SocketServerMock()
const isLocal = true

const client = new net.Socket()

if (isLocal) {
  client.connect(5000, '127.0.0.1', () => {
	   console.log('Connected')
   })
} else {
  client.connect(5000, '192.168.0.106', () => {
  	console.log('Connected')
  })
}


let wsConnection = undefined

const stream = client.pipe(split())
stream.on('data', data => {

  const parsed = JSON.parse(data)

  if (!isLocal) {
    if (parsed.type === 'GYRO' || parsed.type === 'COMPASS') {
      console.log(parsed)
    }
  }

  if (wsConnection) {
    try {
        wsConnection.send(data)
    } catch (e) { }
  }
})

app.get('/api/battery', function (req, res) {
  res.json({
      voltage: 7890,
      current: 160
  });
});

app.ws('/ws', function(ws, req) {
  ws.on('message', function(msg) {
    client.write(msg + '\n')
  })
})

expressWs.getWss().on('connection', function(ws) {
  console.log('connection open')
  wsConnection = ws
});

expressWs.getWss().on('close', function(ws) {
  console.log('connection closed')
  wsConnection = undefined
});

var server = app.listen(port, function () {
  console.log('Rover server listening on port ', server.address().port);
});
