class Motor {

    hasStopped = false

    constructor() {
        this.motor = require('motor-l298n')

        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298n = this.motor.setup(5, 6, 13, 17, 27, 12);
    }

    forward = speed => {
        //this.l298n.setSpeed(this.motor.LEFT, speed)
        //this.l298n.setSpeed(this.motor.RIGHT, speed)

        this.l298n.forward(this.motor.LEFT)
        this.l298n.forward(this.motor.RIGHT)

        this.hasStopped = false

        this.schedulePwmIncrease(1, speed)
    }

    schedulePwmIncrease = (currentSpeed, desiredSpeed) => {
        this.l298n.setSpeed(this.motor.LEFT, currentSpeed)
        this.l298n.setSpeed(this.motor.RIGHT, currentSpeed)

        if (this.hasStopped || currentSpeed === desiredSpeed) {
            return
        }

        setTimeout(() => this.schedulePwmIncrease(currentSpeed + 1, desiredSpeed), 25)
    }

    back = speed => {
        this.l298n.setSpeed(this.motor.LEFT, speed);
        this.l298n.setSpeed(this.motor.RIGHT, speed);

        this.l298n.backward(this.motor.LEFT);
        this.l298n.backward(this.motor.RIGHT);
    }

    left = speed => {
        this.l298n.setSpeed(this.motor.LEFT, speed);
        this.l298n.setSpeed(this.motor.RIGHT, speed);

        this.l298n.forward(this.motor.LEFT);
        this.l298n.backward(this.motor.RIGHT);
    }

    right = speed => {
        this.l298n.setSpeed(this.motor.LEFT, speed);
        this.l298n.setSpeed(this.motor.RIGHT, speed);

        this.l298n.backward(this.motor.LEFT);
        this.l298n.forward(this.motor.RIGHT);
    }

    stop = () => {
        this.l298n.stop(this.motor.LEFT)
        this.l298n.stop(this.motor.RIGHT)

        this.l298n.setSpeed(this.motor.LEFT, 0);
        this.l298n.setSpeed(this.motor.RIGHT, 0);
        this.hasStopped = true;
    }

}

export default Motor
