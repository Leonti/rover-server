class IrSensors {

    callbacks = []

    constructor() {

        setInterval(() => {
            this.callbacks.forEach(c => c({
              c0: 45,
              c1: 45,
              c2: 45,
              c3: 45,
              c4: 45,
              c5: 45,
              c6: 45,
              c7: 45,
            }))
        }, 300)
    }

    onUpdate = sensorData => this.callbacks.push(sensorData)
}

export default IrSensors
