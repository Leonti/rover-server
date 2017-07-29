class IrSensors {

    callbacks = []

    constructor() {

        setInterval(() => {
            this.callbacks.forEach(c => c({ front1: 45 }))
        }, 300)
    }

    onUpdate = sensorData => this.callbacks.push(sensorData)
}

export default IrSensors
