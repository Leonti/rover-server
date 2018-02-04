const Mcp3008 = require('mcp3008.js')

class IrSensors {

    callbacks = []

    constructor() {

      const adc = new Mcp3008()

      const getAsPromise = channel => new Promise((resolve, reject) => {
        adc.read(channel, resolve)
      })

      setInterval(() => {

        Promise.all([
          getAsPromise(0),
          getAsPromise(1),
          getAsPromise(2),
          getAsPromise(3),
          getAsPromise(4),
          getAsPromise(5),
          getAsPromise(6),
          getAsPromise(7),
        ]).then(values => {

          this.callbacks.forEach(c => c({
            rear: {
              left: values[1] < 100,
              right: values[2] < 100,
            },
            left: {
              front: values[7] < 100,
              rear: values[0] < 100,
            },
            front: {
              left: values[6] < 100,
              right: values[5] < 100,
            },
            right: {
              front: values[4] < 100,
              rear: values[3] < 100,
            }
          }))
        })

      }, 50)
    }

    onUpdate = sensorDataCallback => this.callbacks.push(sensorDataCallback)
}

export default IrSensors
