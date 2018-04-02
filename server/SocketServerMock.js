const net = require('net')
const split = require('split')

class SocketServerMock {

  constructor() {
    this.sockets = []
    const server = net.createServer(socket => {

      const stream = socket.pipe(split())
      stream.on('data', onIncomingData)

      console.log('Socket is connected!')
      this.sockets.push(socket)
      console.log('Number of sockets', this.sockets.length)

      this.setupMockEvents()

      socket.on('close', () => {
        console.log('socket is closed')
        this.sockets = this.sockets.filter(s => s !== socket)

        console.log('Number of sockets', this.sockets.length)
      })
    })

    server.listen(5000, '0.0.0.0')
  }

  setupMockEvents() {
    setInterval(() => {
      this.broadcastToSockets('BATTERY', {
        voltage: 7.64,
        current_mA: 400
      })
    }, 2000)

    setInterval(() => {
      this.broadcastToSockets('TEMP', {
        battery: 24.1,
        ambient: 23.5
      })
    }, 2000)

    setInterval(() => {
      this.broadcastToSockets('BUTTON', {})
    }, 30000)

    setInterval(() => {
      this.broadcastToSockets('IR_SENSOR', {
        rear: {
          left: true,
          right: true,
        },
        left: {
          front: true,
          rear: false,
        },
        front: {
          left: false,
          right: false,
        },
        right: {
          front: false,
          rear: false,
        }
      })
    }, 300)

    setInterval(() => {
      this.broadcastToSockets('ENCODER', 'LEFT')
      this.broadcastToSockets('ENCODER', 'RIGHT')
    }, 100)
  }

  broadcastToSockets(type, data) {
    const event = wrapWithTime(type, data)
    this.sockets.forEach(socket => sendEvent(socket, event))
  }

}

const onIncomingData = data => {
  console.log(data)
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

export default SocketServerMock
