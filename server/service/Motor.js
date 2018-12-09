const formatStats = stats => stats.entries
.reduce((acc, e) => acc + `${e.time},${stats.target},${e.left.ticks},${e.left.error},${e.left.speed},${e.left.sumError},${e.right.ticks},${e.right.error},${e.right.speed},${e.right.sumError},${stats.pid.p},${stats.pid.i},${stats.pid.d}\n`,
  'Timestamp,Target,LeftTicks,LeftError,LeftSpeed,LeftSumError,RightTicks,RightError,RightSpeed,RightSumError,Kp,Ki,Kd\n')

class Motor {

  leftTicks = 0
  rightTicks = 0
  prevErrorLeft = 0
  prevErrorRight = 0
  sumErrorLeft = 0
  sumErrorRight = 0

  leftSpeed = 0
  rightSpeed = 0
  ticksToGo = 0
  totalLeftTicks = 0
  totalRightTicks = 0
  isMoving = false

  target = 0
  kp = 0 // 4
  kd = 0 // 0.05
  ki = 0 // 0.2

  pidIntervalId = null
  rampUpIntervalId = null

  stats = null

  callbacks = []

  onStats = onStats => this.callbacks.push(onStats)

  constructor(encoders) {
      this.motor = require('./motor-l298n')

      // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
      this.l298n = this.motor.setup(6, 5, 13, 27, 17, 12);

      encoders.onLeftTick(() => {
        this.leftTicks += 1
        this.totalLeftTicks += 1
      })

      encoders.onRightTick(() => {
        this.rightTicks += 1
        this.totalRightTicks += 1
      })
  }

  startRampUp(desired) {
    this.rampUpIntervalId = setInterval(() => {
      if (this.target >= 10) {
        clearInterval(this.rampUpIntervalId);
        return;
      }

      this.target += 1
    }, 300)
  }

  startPid() {
    this.pidIntervalId = setInterval(() => {
//      console.log(`PID iteration Kp: ${this.kp}, Ki: ${this.ki}, Kd: ${this.kd}`)
      if (!this.isMoving) return

      const leftError = this.target - this.leftTicks
      const rightError = this.target - this.rightTicks

      const leftAdjustment = leftError * this.kp + (leftError - this.prevErrorLeft) * this.kd + this.sumErrorLeft * this.ki
      const rightAdjustment = rightError * this.kp + (rightError - this.prevErrorRight) * this.kd + this.sumErrorRight * this.ki

      this.leftSpeed += leftAdjustment
      this.rightSpeed += rightAdjustment

      this.leftSpeed = Math.max(Math.min(100, this.leftSpeed), 0)
      this.rightSpeed = Math.max(Math.min(100, this.rightSpeed), 0)

//      console.log(`left speed: ${this.leftSpeed} right speed : ${this.rightSpeed}`)
//      console.log(`left ticks: ${this.leftTicks} right ticks: ${this.rightTicks}`)
//      console.log(`left adj: ${leftAdjustment} right adj: ${rightAdjustment}`)

      this.l298n.setSpeed(this.motor.LEFT, this.leftSpeed)
      this.l298n.setSpeed(this.motor.RIGHT, this.rightSpeed)

      this.prevErrorLeft = leftError
      this.prevErrorRight = rightError
      this.sumErrorLeft += leftError
      this.sumErrorRight += rightError

      this.stats.entries.push({
        left: {
          ticks: this.leftTicks,
          error: leftError,
          speed: this.leftSpeed,
          sumError: this.sumErrorLeft,
        },
        right: {
          ticks: this.rightTicks,
          error: rightError,
          speed: this.rightSpeed,
          sumError: this.sumErrorRight,
        },
        time: new Date().getTime()
      })

      this.leftTicks = 0
      this.rightTicks = 0

      if (this.totalLeftTicks >= this.ticksToGo || this.totalRightTicks >= this.ticksToGo) {
        this.stop()
      }

    }, 50)
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

    start(velocity, pid, ticksToGo) {
      this.isMoving = true
      this.leftTicks = 0
      this.rightTicks = 0
      this.prevErrorLeft = 0
      this.prevErrorRight = 0
      this.sumErrorLeft = 0
      this.sumErrorRight = 0

      this.kp = pid.p
      this.ki = pid.i
      this.kd = pid.d

      this.leftSpeed = velocity
      this.rightSpeed = velocity

      this.l298n.setSpeed(this.motor.LEFT, this.leftSpeed)
      this.l298n.setSpeed(this.motor.RIGHT, this.rightSpeed)

      this.ticksToGo = ticksToGo
      this.totalLeftTicks = 0
      this.totalRightTicks = 0

      this.stats = {
        pid: pid,
        target: this.target,
        entries: []
      }

      this.target = 0
      this.startRampUp(20)
      this.startPid()

    //  this.l298n.setSpeed(this.motor.LEFT, velocity)
    //  this.l298n.setSpeed(this.motor.RIGHT, velocity)
      this.l298n.forward(this.motor.LEFT)
      this.l298n.forward(this.motor.RIGHT)
    }

    move = command => {
      console.log('move', command)
      this.start(command.speed, command.pid, command.ticksToGo)
    }

    stop = () => {
      this.isMoving = false
      clearInterval(this.pidIntervalId);
      clearInterval(this.rampUpIntervalId);
//      console.log(formatStats(this.stats))
      this.callbacks.forEach(c => c(this.stats))
      console.log('motoro stopped')
      this.l298n.stop(this.motor.LEFT)
      this.l298n.stop(this.motor.RIGHT)
      this.l298n.setSpeed(this.motor.LEFT, 0)
      this.l298n.setSpeed(this.motor.RIGHT, 0)
    }

}

export default Motor
