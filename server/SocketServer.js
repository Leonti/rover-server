const net = require('net')
const split = require('split')
const cmd = require('node-cmd')

import Motor from './service/Motor'
import Encoders from './service/Encoders'
import IrSensors from './service/IrSensors'
import Arduino from './service/Arduino'
import Accelerometer from './service/Accelerometer'
import Gyro from './service/Gyro'
import Compass from './service/Compass'

class SocketServer {

  constructor() {

    const encoders = new Encoders()
//    const irSensors = new IrSensors()
    const motor = new Motor(encoders)
    const arduino = new Arduino()
//    const accelerometer = new Accelerometer()
//    const gyro = new Gyro()
//    const compass = new Compass()

    this.sockets = []
    const server = net.createServer(socket => {

      const stream = socket.pipe(split())
      stream.on('data', onIncomingData(motor, arduino))

      console.log('Socket is connected!')
      this.sockets.push(socket)
      console.log('Number of sockets', this.sockets.length)

      socket.on('close', () => {
        console.log('socket is closed')
        this.sockets = this.sockets.filter(s => s !== socket)

        console.log('Number of sockets', this.sockets.length)
      })
    })

    encoders.onLeftTick(() => this.broadcastToSockets('ENCODER', 'LEFT'))
    encoders.onRightTick(() => this.broadcastToSockets('ENCODER', 'RIGHT'))
//    irSensors.onUpdate(data => this.broadcastToSockets('IR_SENSOR', data))
    arduino.onBattery(data => this.broadcastToSockets('BATTERY', data))
    arduino.onTemp(data => this.broadcastToSockets('TEMP', data))
    arduino.onButton(data => this.broadcastToSockets('BUTTON', data))
//    accelerometer.onData(data => this.broadcastToSockets('AXL', data))
//    gyro.onData(data => this.broadcastToSockets('GYRO', data))
//    compass.onData(data => this.broadcastToSockets('COMPASS', data))
    motor.onStats(data => this.broadcastToSockets('MOTOR_STATS', data))

    server.listen(5000, '0.0.0.0')
  }

  broadcastToSockets(type, data) {
    const event = wrapWithTime(type, data)
    this.sockets.forEach(socket => sendEvent(socket, event))
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
            motor.move(command.value)
            break
        case 'STOP':
            motor.stop()
            break
        case 'OFF':
            arduino.off(command.value.timeout)
            cmd.get('sudo shutdown -h now', (err, data, stderr) => {
                    console.log(data)
                    console.log(err)
                    console.log(stderr)
                })
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

const wrapWithTime = (type, data) => {
  return {
      time: new Date().getTime(),
      type: type,
      value: data,
      id: Math.random()
  }
}

const sendEvent = (socket, event) => {
  try {
      socket.write(JSON.stringify(event) + '\n')
  } catch (e) { }
}

export default SocketServer
