class Motor {

    l298n = null

    constructor() {
        let motor = require('motor-l298n')
        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298 = motor.setup(6, 13, 5, 19, 26, 21);
    }

    forward = speed => {
        l298n.setSpeed(motor.LEFT, speed);
        l298n.setSpeed(motor.RIGHT, speed);

        l298n.forward(motor.LEFT);
        l298n.forward(motor.RIGHT);
    }

    back = speed => {
        l298n.setSpeed(motor.LEFT, speed);
        l298n.setSpeed(motor.RIGHT, speed);

        l298n.backward(motor.LEFT);
        l298n.backward(motor.RIGHT);
    }

    left = speed => {
        l298n.setSpeed(motor.LEFT, speed);
        l298n.setSpeed(motor.RIGHT, speed);

        l298n.forward(motor.LEFT);
        l298n.backward(motor.RIGHT);
    }

    right = speed => {
        l298n.setSpeed(motor.LEFT, speed);
        l298n.setSpeed(motor.RIGHT, speed);

        l298n.backward(motor.LEFT);
        l298n.forward(motor.RIGHT);
    }

    stop = () => {
        l298n.stop(motor.LEFT)
        l298n.stop(motor.RIGHT)
    }

}

export default Motor
