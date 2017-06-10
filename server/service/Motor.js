class Motor {

    l298n = null

    constructor() {
        let motor = require('motor-l298n')
        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298 = motor.setup(6, 13, 5, 19, 26, 21);
    }

    forward = speed => {
        this.l298n.setSpeed(motor.LEFT, speed);
        this.l298n.setSpeed(motor.RIGHT, speed);

        this.l298n.forward(motor.LEFT);
        this.l298n.forward(motor.RIGHT);
    }

    back = speed => {
        this.l298n.setSpeed(motor.LEFT, speed);
        this.l298n.setSpeed(motor.RIGHT, speed);

        this.l298n.backward(motor.LEFT);
        this.l298n.backward(motor.RIGHT);
    }

    left = speed => {
        this.l298n.setSpeed(motor.LEFT, speed);
        this.l298n.setSpeed(motor.RIGHT, speed);

        this.l298n.forward(motor.LEFT);
        this.l298n.backward(motor.RIGHT);
    }

    right = speed => {
        this.l298n.setSpeed(motor.LEFT, speed);
        this.l298n.setSpeed(motor.RIGHT, speed);

        this.l298n.backward(motor.LEFT);
        this.l298n.forward(motor.RIGHT);
    }

    stop = () => {
        this.l298n.stop(motor.LEFT)
        this.l298n.stop(motor.RIGHT)
    }

}

export default Motor
