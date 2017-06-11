let wpi = require('wiring-pi')

class Encoders {

    onLeftCallbacks = []
    onRightCallbacks = []

    constructor() {
        // gpio 22 - right
        wpi.setup('gpio')
        wpi.pinMode(22, wpi.INPUT);
        wpi.pullUpDnControl(22, wpi.PUD_UP);
        wpi.wiringPiISR(22, wpi.INT_EDGE_FALLING, () => {
            console.log('interrupt')
            this.onRightCallbacks.forEach(c => c())
        });
    }

    onLeftTick = onLeft => this.onLeftCallbacks.push(onLeft)

    onRightTick = onRight => this.onRightCallbacks.push(onRight)
}

export default Encoders
