class Motor {
    queue = []
    currentCommand = null
    leftTicks = 0
    rightTicks = 0

    constructor(encoders, irSensors) {
        this.motor = require('./motor-l298n')

        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298n = this.motor.setup(17, 27, 12, 5, 6, 13);

        encoders.onLeftTick(() => {
          this.leftTicks = this.leftTicks + 1
          console.log('left tick:')
          console.log('right:', this.rightTicks)
          console.log('left:', this.leftTicks)
          console.log('current command', this.currentCommand)

          if (this.currentCommand && this.leftTicks === this.currentCommand.left.ticks) {
            this.l298n.stop(this.motor.LEFT)
            this.l298n.setSpeed(this.motor.LEFT, 0)
          }
          this._checkNextCommand()
        })
        encoders.onRightTick(() => {
          this.rightTicks = this.rightTicks + 1
          console.log('right tick:')
          console.log('right:', this.rightTicks)
          console.log('left:', this.leftTicks)
          console.log('current command', this.currentCommand)

          if (this.currentCommand && this.rightTicks === this.currentCommand.right.ticks) {
            this.l298n.stop(this.motor.RIGHT)
            this.l298n.setSpeed(this.motor.RIGHT, 0)
          }
          this._checkNextCommand()
        })
        /*
        irSensors.onUpdate(value => {

          if (this.direction === 'FORWARD'
            && (value.front.left === true || value.front.right === true)) {
            this.stop()
          }

          if (this.direction === 'BACKWARD'
            && (value.rear.left === true || value.rear.right === true)) {
            this.stop()
          }

        })
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

    move = command => {
      console.log('move', command)
      this.queue.push(command)
      if (!this.currentCommand) {
        this._nextCommand()
      }
    }

    stop = () => {
      this.queue = []
      this.l298n.stop(this.motor.LEFT)
      this.l298n.stop(this.motor.RIGHT)
      this.l298n.setSpeed(this.motor.LEFT, 0)
      this.l298n.setSpeed(this.motor.RIGHT, 0)
    }

    _nextCommand = () => {
      this.currentCommand = this.queue.shift()
      this.leftTicks = 0
      this.rightTicks = 0

      if (this.currentCommand) {
        this.l298n.setSpeed(this.motor.LEFT, this.currentCommand.speed);
        this.l298n.setSpeed(this.motor.RIGHT, this.currentCommand.speed);

        if(this.currentCommand.left.direction === 'FORWARD') {
          this.l298n.forward(this.motor.LEFT)
        } else if (this.currentCommand.left.direction === 'BACKWARD') {
          this.l298n.backward(this.motor.LEFT)
        }

        if(this.currentCommand.right.direction === 'FORWARD') {
          this.l298n.forward(this.motor.RIGHT)
        } else if (this.currentCommand.right.direction === 'BACKWARD') {
          this.l298n.backward(this.motor.RIGHT)
        }
      }
    }

    _checkNextCommand = () => {
      if (this.leftTicks >= this.currentCommand.left.ticks
        && this.rightTicks >= this.currentCommand.right.ticks) {
        this._nextCommand()
      }
    }

}

export default Motor
