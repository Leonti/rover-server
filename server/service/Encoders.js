let wpi = require('wiring-pi')

class Encoders {

    onLeftCallbacks = []
    onRightCallbacks = []

    constructor() {
        wpi.setup('gpio')

        // gpio 22 - right
        wpi.pinMode(22, wpi.INPUT);
        wpi.pullUpDnControl(22, wpi.PUD_UP);
        wpi.wiringPiISR(22, wpi.INT_EDGE_FALLING, () => {
            this.onRightCallbacks.forEach(c => c())
        });

        // gpio 23 - left
        wpi.pinMode(23, wpi.INPUT);
        wpi.pullUpDnControl(23, wpi.PUD_UP);
        wpi.wiringPiISR(23, wpi.INT_EDGE_FALLING, () => {
            this.onLeftCallbacks.forEach(c => c())
        });
    }

    onLeftTick = onLeft => this.onLeftCallbacks.push(onLeft)

    onRightTick = onRight => this.onRightCallbacks.push(onRight)
}

export default Encoders
