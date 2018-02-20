const net = require('net')
const split = require('split')

import Motor from './service/Motor'
import Encoders from './service/Encoders'
import IrSensors from './service/IrSensors'
import Arduino from './service/Arduino'
import Accelerometer from './service/Accelerometer'

class SocketServer {

  constructor() {

    const encoders = new Encoders()
    const irSensors = new IrSensors()
    const motor = new Motor(encoders, irSensors)
    const arduino = new Arduino()
    const accelerometer = new Accelerometer()

    this.sockets = []
    const server = net.createServer(socket => {

      const stream = socket.pipe(split())
      stream.on('data', onIncomingData(motor, arduino))

      console.log('Socket is connected!')
      this.sockets.push(socket)
      console.log('Number of sockets', this.sockets.length)

      encoders.onLeftTick(() => this.broadcastToSockets(s => sendEncoderEventToSocket(s, 'LEFT')))

      encoders.onRightTick(() => this.broadcastToSockets(s => sendEncoderEventToSocket(s, 'RIGHT')))

      irSensors.onUpdate(data => this.broadcastToSockets(s => sendIrSensorEventToSocket(s, data)))

      arduino.onBattery(data => this.broadcastToSockets(s => sendBatteryEventToSocket(s, data)))

      arduino.onTemp(data => this.broadcastToSockets(s => sendTempEventToSocket(s, data)))

      arduino.onButton(data => this.broadcastToSockets(s => sendButtonEventToSocket(s, data)))

      accelerometer.onData(data => this.broadcastToSockets(s => sendAccelerometerEventToSocket(s, data)))

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

let move = (motor, command) => {
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

const off = (arduino, command) => {
  arduino.off(command.timeout)
}

const onIncomingData = (motor, arduino) => data => {
  console.log(data)

  try {
    let command = JSON.parse(data)
    switch(command.type) {
        case 'MOVE':
            move(motor, command.value)
            break
        case 'STOP':
            motor.stop()
            break
        case 'OFF':
            arduino.off(command.value.timeout)
            break
        case 'CAMERA_ANGLE':
            arduino.setAngle(command.value.angle)
            break
        default:
            console.log('Unknown command')
    }
  } catch (e) {
    console.error('Error on incoming socket data', e)
  }
}

const sendEncoderEventToSocket = (socket, side) => sendEvent(socket, 'ENCODER', side)
const sendIrSensorEventToSocket = (socket, sensorData) => sendEvent(socket, 'IR_SENSOR', sensorData)
const sendBatteryEventToSocket = (socket, sensorData) => sendEvent(socket, 'BATTERY', sensorData)
const sendTempEventToSocket = (socket, sensorData) => sendEvent(socket, 'TEMP', sensorData)
const sendButtonEventToSocket = (socket, sensorData) => sendEvent(socket, 'BUTTON', sensorData)
const sendAccelerometerEventToSocket = (socket, sensorData) => sendEvent(socket, 'AXL', sensorData)

const sendEvent = (socket, type, data) => {
  try {
      socket.write(JSON.stringify({
          time: new Date().getTime(),
          type: type,
          value: data
      }) + '\n')
  } catch (e) { }
}

export default SocketServer
