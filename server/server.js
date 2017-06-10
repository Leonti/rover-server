var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

import Motor from './service/Motor'
import MotorMock from './service/MotorMock'

app.use(express.static('../client/build'))

let motor = process.env.RESIN == 1 ? new Motor() : new MotorMock()
let port = process.env.RESIN == 1 ? 80 : 3001

app.get('/api/battery', function (req, res) {
  res.json({
      voltage: 7890,
      current: 160
  });
});

let move = command => {
    switch(command.direction) {
        case 'FORWARD':
            motor.forward(command.speed)
            break
        case 'BACK':
            motor.back(command.speed)
            break
        case 'LEFT':
            motor.left(command.speed)
            break
        case 'RIGHT':
            motor.right(command.speed)
            break
    }
}

let stop = motor.stop

app.ws('/ws', function(ws, req) {
  ws.on('message', function(msg) {
    console.log('received message from frontend "' + msg + '"')

    let command = JSON.parse(msg)

    switch(command.type) {
        case 'MOVE':
            move(command.value)
            break
        case 'STOP':
            stop()
            break
        default:
            console.log('Unkcnown command')
    }

    ws.send(msg);
  });
})

expressWs.getWss().on('connection', function(ws) {
  console.log('connection open');
});

expressWs.getWss().on('close', function(ws) {
  console.log('connection closed');
});

var server = app.listen(port, function () {
  console.log('Rover server listening on port ', server.address().port);
});
