let Mcp3008 = require('mcp3008.js')

class IrSensors {

    callbacks = []

    constructor() {

      const adc = new Mcp3008()

      adc.poll(0, 300, value => {
        this.callbacks.forEach(c => c({front1: value}))
      });
    }

    onUpdate = sensorDataCallback => this.callbacks.push(sensorDataCallback)
}

export default IrSensors
