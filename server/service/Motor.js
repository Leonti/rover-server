class Motor {

    constructor() {
        this.motor = require('motor-l298n')

        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298n = this.motor.setup(6, 13, 5, 19, 26, 21);

        console.log('Creating l298n', this.l298n);
    }

    forward = speed => {
        console.log(this.l298n)
        this.l298n.setSpeed(this.motor.LEFT, speed)
        this.l298n.setSpeed(this.motor.RIGHT, speed)

        this.l298n.forward(this.motor.LEFT)
        this.l298n.forward(this.motor.RIGHT)
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
    }

}

export default Motor
