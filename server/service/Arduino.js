const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;

const calculateAngle = percentage => 22 + 153 * percentage

const parseBatteryMeasurements = line => {
  const splitted = line.replace('\r', '').substring(2).split(',')

  return {
    voltage: parseFloat(splitted[0]),
    current_mA: parseFloat(splitted[1])
  }
}

const parseTempMeasurements = line => {
  const splitted = line.replace('\r', '').substring(2).split(',')

  return {
    battery: parseFloat(splitted[0]),
    ambient: parseFloat(splitted[1])
  }
}

class Arduino {

  constructor() {
    this.parser = new Readline()
    this.port = new Promise((resolve, reject) => {
      const serialPort = new SerialPort("/dev/ttyUSB0", {
        baudRate: 115200,
        autoOpen: false
      })
      serialPort.pipe(this.parser)
      serialPort.open((err) => {
        if (err) {
          reject(err)
        } else {
          serialPort.on('open', function () {
            console.log('open')
          });

          this.parser.on('data', (data) => {
            //console.log(data)
            if (data.indexOf('B:') === 0) {
              this.batteryListeners.forEach(l => l(parseBatteryMeasurements(data)))
            } else if (data.indexOf('T:') === 0) {
              this.tempListeners.forEach(l => l(parseTempMeasurements(data)))
            } else if (data.indexOf('BTN:') === 0) {
              this.buttonListeners.forEach(l => l({}))
            }
          })
          resolve(serialPort)
        }
      })
    })

    this.batteryListeners = []
    this.tempListeners = []
    this.buttonListeners = []
  }

  onBattery(l) {
    this.batteryListeners.push(l)
  }

  onTemp(l) {
    this.tempListeners.push(l)
  }

  onButton(l) {
    this.buttonListeners.push(l)
  }

  setAngle(percentage) {
    return this.port.then(serialPort => new Promise((resolve, reject) => {
      const angle = calculateAngle(percentage)
      serialPort.write(`S${angle}`, 'ascii', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
  		})
    }), err => console.log(err))
  }

  off(timeout) {
    return this.port.then(serialPort => new Promise((resolve, reject) => {
      serialPort.write(`O${timeout}`, 'ascii', (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
  		})
    }), err => console.log(err))
  }
}

export default Arduino
