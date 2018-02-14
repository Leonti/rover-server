const net = require('net')
const split = require('split')

import Motor from './service/Motor'
import MotorMock from './service/MotorMock'
import Encoders from './service/Encoders'
import EncodersMock from './service/EncodersMock'
import IrSensors from './service/IrSensors'
import IrSensorsMock from './service/IrSensorsMock'
import Arduino from './service/Arduino'
import ArduinoMock from './service/ArduinoMock'

const encoders = process.env.RESIN == 1 ? new Encoders() : new EncodersMock()
const irSensors = process.env.RESIN == 1 ? new IrSensors() : new IrSensorsMock()
const motor = process.env.RESIN == 1 ? new Motor(encoders, irSensors) : new MotorMock()
const arduino = process.env.RESIN == 1 ? new Arduino() : new ArduinoMock()

class SocketServer {

  constructor() {
    this.sockets = []
    const server = net.createServer(socket => {

      const stream = socket.pipe(split())
      stream.on('data', onIncomingData)

      console.log('Socket is connected!')
      this.sockets.push(socket)
      console.log('Number of sockets', this.sockets.length)

      encoders.onLeftTick(() => this.broadcastToSockets(s => sendEncoderEventToSocket(s, 'LEFT')))

      encoders.onRightTick(() => this.broadcastToSockets(s => sendEncoderEventToSocket(s, 'RIGHT')))

      irSensors.onUpdate(data => this.broadcastToSockets(s => sendIrSensorEventToSocket(s, data)))

      arduino.onBattery(data => this.broadcastToSockets(s => sendBatteryEventToSocket(s, data)))

      socket.on('close', () => {
        console.log('socket is closed')
        this.sockets = this.sockets.filter(s => s !== socket)

        console.log('Number of sockets', this.sockets.length)
      })
    })

    server.listen(5000, '0.0.0.0')
  }

  broadcastToSockets(callback) {
    this.sockets.forEach(callback)
  }

}

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

const onIncomingData = data => {
  console.log(data)

  let command = JSON.parse(data)
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
}

const sendEncoderEventToSocket = (socket, side) => {
    try {
        socket.write(JSON.stringify({
            type: 'ENCODER',
            value: side
        }) + '\n')
    } catch (e) { }
}

const sendIrSensorEventToSocket = (socket, sensorData) => {
  try {
      socket.write(JSON.stringify({
          type: 'IR_SENSOR',
          value: sensorData
      }) + '\n')
  } catch (e) { }
}

const sendBatteryEventToSocket = (socket, sensorData) => {
  try {
      socket.write(JSON.stringify({
          type: 'BATTERY',
          value: sensorData
      }) + '\n')
  } catch (e) { }
}

export default SocketServer
