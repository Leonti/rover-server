class Motor {

  leftTicks = 0
  rightTicks = 0
  prevErrorLeft = 0
  prevErrorRight = 0
  sumErrorLeft = 0
  sumErrorRight = 0

  leftSpeed = 50
  rightSpeed = 50
  isMoving = false

  target = 20
  kp = 0.02
  kd = 0.01
  ki = 0.005

  constructor(encoders, irSensors) {
      this.motor = require('./motor-l298n')

      // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
      this.l298n = this.motor.setup(6, 5, 13, 27, 17, 12);

      encoders.onLeftTick(() => {
        this.leftTicks += 1
      })

      encoders.onRightTick(() => {
        this.rightTicks += 1
      })
/*
      setInterval(() => {
        if (!this.isMoving) return

        const leftError = this.target - this.leftTicks
        const rightError = this.target - this.rightTicks

        const leftAdjustment = 10 * (leftError * this.kp + (leftError - this.prevErrorLeft) * this.kd + this.sumErrorLeft * this.ki)
        const rightAdjustment = 10 * (rightError * this.kp + (rightError - this.prevErrorRight) * this.kd + this.sumErrorRight * this.ki)

        this.leftSpeed += leftAdjustment
        this.rightSpeed += rightAdjustment

        this.leftSpeed = Math.max(Math.min(100, Math.round(this.leftSpeed)), 40)
        this.rightSpeed = Math.max(Math.min(100, Math.round(this.rightSpeed)), 40)

        console.log(`left speed: ${this.leftSpeed} right speed : ${this.rightSpeed}`)
        console.log(`left ticks: ${this.leftTicks} right ticks: ${this.rightTicks}`)
        console.log(`left adj: ${leftAdjustment} right adj: ${rightAdjustment}`)

        this.l298n.setSpeed(this.motor.LEFT, this.leftSpeed)
        this.l298n.setSpeed(this.motor.RIGHT, this.rightSpeed)

        this.prevErrorLeft = leftError
        this.prevErrorRight = rightError
        this.sumErrorLeft += leftError
        this.sumErrorRight += rightError

        this.leftTicks = 0
        this.rightTicks = 0
      }, 100)
*/
  }

/*
{
  left: {
    direction: 'FORWARD',
    ticks: 5
  },
  right: {
    direction: 'BACKWARD',
    ticks: 5
  },
  speed: 40
}
*/

    start(velocity) {
      this.isMoving = true
      this.leftTicks = 0
      this.rightTicks = 0
      this.prevErrorLeft = 0
      this.prevErrorRight = 0
      this.sumErrorLeft = 0
      this.sumErrorRight = 0

      this.leftSpeed = 40
      this.rightSpeed = 40

//      this.l298n.setSpeed(this.motor.LEFT, this.leftSpeed)
//      this.l298n.setSpeed(this.motor.RIGHT, this.rightSpeed)

      this.l298n.setSpeed(this.motor.LEFT, velocity)
      this.l298n.setSpeed(this.motor.RIGHT, velocity)
      this.l298n.forward(this.motor.LEFT)
      this.l298n.forward(this.motor.RIGHT)
    }

    move = command => {
      console.log('move', command)
      this.start(command.speed)
      setTimeout(() => {
        this.stop()
      }, 5000)
    }

    stop = () => {
      this.isMoving = false
      console.log('motoro stopped')
      this.l298n.stop(this.motor.LEFT)
      this.l298n.stop(this.motor.RIGHT)
      this.l298n.setSpeed(this.motor.LEFT, 0)
      this.l298n.setSpeed(this.motor.RIGHT, 0)
    }

}

export default Motor
