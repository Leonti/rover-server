let Mcp3008 = require('mcp3008.js')

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
          console.log(values)

          this.callbacks.forEach(c => c({
            c0: values[0],
            c1: values[1],
            c2: values[2],
            c3: values[3],
            c4: values[4],
            c5: values[5],
            c6: values[6],
            c7: values[7],
          }))
        })

      }, 300)
    }

    onUpdate = sensorDataCallback => this.callbacks.push(sensorDataCallback)
}

export default IrSensors
