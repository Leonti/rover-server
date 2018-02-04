var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);
var cmd=require('node-cmd');

import Motor from './service/Motor'
import MotorMock from './service/MotorMock'
import Encoders from './service/Encoders'
import EncodersMock from './service/EncodersMock'
import IrSensors from './service/IrSensors'
import IrSensorsMock from './service/IrSensorsMock'
import Arduino from './service/Arduino'
import ArduinoMock from './service/ArduinoMock'

app.use(express.static('../client/build'))

const encoders = process.env.RESIN == 1 ? new Encoders() : new EncodersMock()
const irSensors = process.env.RESIN == 1 ? new IrSensors() : new IrSensorsMock()
const motor = process.env.RESIN == 1 ? new Motor(encoders, irSensors) : new MotorMock()
const arduino = process.env.RESIN == 1 ? new Arduino() : new ArduinoMock()
const port = process.env.RESIN == 1 ? 80 : 3001

cmd.get(
    'i2cdetect -y 1',
    function(err, data, stderr){
        console.log('I2C devices : ',data)
    }
);

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
    //console.log('received message from frontend "' + msg + '"')

    let command = JSON.parse(msg)

    switch(command.type) {
        case 'MOVE':
            move(command.value)
            break
        case 'STOP':
            stop()
            break
        default:
            console.log('Unknown command')
    }

//    ws.send(msg);
  });
})

const sendEncoderEvent = (ws, side) => {
    try {
        ws.send(JSON.stringify({
            type: 'ENCODER',
            value: side
        }))
    } catch (e) {
    //    console.log(e.message)
    }
}

const sendIrSensorEvent = (ws, sensorData) => {
  try {
      ws.send(JSON.stringify({
          type: 'IR_SENSOR',
          value: sensorData
      }))
  } catch (e) {
  //    console.log(e.message)
  }
}

const sendBatteryEvent = (ws, sensorData) => {
  try {
      ws.send(JSON.stringify({
          type: 'BATTERY',
          value: sensorData
      }))
  } catch (e) {
  //    console.log(e.message)
  }
}

expressWs.getWss().on('connection', function(ws) {
  console.log('connection open');

  encoders.onLeftTick(() => sendEncoderEvent(ws, 'LEFT'))

  encoders.onRightTick(() => sendEncoderEvent(ws, 'RIGHT'))

  irSensors.onUpdate(sensorData => sendIrSensorEvent(ws, sensorData))

  arduino.onBattery(sensorData => sendBatteryEvent(ws, sensorData))
});

expressWs.getWss().on('close', function(ws) {
  console.log('connection closed');
});

var server = app.listen(port, function () {
  console.log('Rover server listening on port ', server.address().port);
});
