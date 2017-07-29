class Motor {

    hasStopped = false
    leftTicks = 0
    rightTicks = 0

    constructor(encoders) {
        this.motor = require('motor-l298n')

        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298n = this.motor.setup(5, 6, 13, 17, 27, 12);

        encoders.onLeftTick(() => this.leftTicks = this.leftTicks + 1)
        encoders.onRightTick(() => this.rightTicks = this.rightTicks + 1)
    }

    schedulePwmAdjustment = (speed) => {
        if (this.hasStopped) {
            return
        }

        if (this.leftTicks > this.rightTicks) {
            this.l298n.setSpeed(this.motor.LEFT, speed * 1.2)
            this.l298n.setSpeed(this.motor.RIGHT, speed)
        } else if (this.leftTicks < this.rightTicks) {
            this.l298n.setSpeed(this.motor.LEFT, speed)
            this.l298n.setSpeed(this.motor.RIGHT, speed * 1.2)
        } else {
            this.l298n.setSpeed(this.motor.LEFT, speed)
            this.l298n.setSpeed(this.motor.RIGHT, speed)
        }

        setTimeout(() => this.schedulePwmAdjustment(speed), 20)
    }

    forward = speed => {
        this.l298n.backward(this.motor.LEFT)
        this.l298n.backward(this.motor.RIGHT)

        this.hasStopped = false
        this.leftTicks = 0
        this.rightTicks = 0

        this.schedulePwmAdjustment(speed)
    }

    back = speed => {
        this.l298n.forward(this.motor.LEFT)
        this.l298n.forward(this.motor.RIGHT)

        this.hasStopped = false
        this.leftTicks = 0
        this.rightTicks = 0

        this.schedulePwmAdjustment(speed)
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
