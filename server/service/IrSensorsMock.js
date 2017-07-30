class IrSensors {

    callbacks = []

    constructor() {

        setInterval(() => {
            this.callbacks.forEach(c => c({
              rear: {
                left: true,
                right: true,
              },
              left: {
                front: false,
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
            }))
        }, 300)
    }

    onUpdate = sensorData => this.callbacks.push(sensorData)
}

export default IrSensors
