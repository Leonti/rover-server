class Motor {
    queue = []
    current = {
      command: null,
      leftTicks: 0,
      rightTicks: 0
    }

    constructor(encoders, irSensors) {
        this.motor = require('./motor-l298n')

        // in1Pin, in2Pin, enable1Pin, in3Pin, in4Pin, enable2Pin
        this.l298n = this.motor.setup(17, 27, 12, 5, 6, 13);

        encoders.onLeftTick(() => {
          this.current.leftTicks = this.current.leftTicks + 1

          if (this._isLeftDone()) {
            console.log('Left is done, stopping!')
            this.l298n.stop(this.motor.LEFT)
            this.l298n.setSpeed(this.motor.LEFT, 0)
          }
          this._checkNextCommand()
        })

        encoders.onRightTick(() => {
          this.current.rightTicks = this.current.rightTicks + 1

          if (this._isRightDone()) {
            console.log('Right is done, stopping!')
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
      this._checkNextCommand()
    }

    stop = () => {
      this.queue = []
      this.l298n.stop(this.motor.LEFT)
      this.l298n.stop(this.motor.RIGHT)
      this.l298n.setSpeed(this.motor.LEFT, 0)
      this.l298n.setSpeed(this.motor.RIGHT, 0)
    }

    _nextCommand = () => {
      this._resetCurrent(this.queue.shift())

      if (this.current.command) {
        this.l298n.setSpeed(this.motor.LEFT, this.current.command.speed);
        this.l298n.setSpeed(this.motor.RIGHT, this.current.command.speed);

        if(this.current.command.left.direction === 'FORWARD') {
          this.l298n.forward(this.motor.LEFT)
        } else if (this.current.command.left.direction === 'BACKWARD') {
          this.l298n.backward(this.motor.LEFT)
        }

        if(this.current.command.right.direction === 'FORWARD') {
          this.l298n.forward(this.motor.RIGHT)
        } else if (this.current.command.right.direction === 'BACKWARD') {
          this.l298n.backward(this.motor.RIGHT)
        }
      }
    }

    _checkNextCommand = () => {
      console.log('Checking next command', this.current)
      if (this._isCurrentDone()) {
        this._nextCommand()
      }
    }

    _resetCurrent = (nextCommand) => {
      this.current.command = nextCommand
      this.current.leftTicks = 0
      this.current.rightTicks = 0
    }

    _isLeftDone = () => {
      if (!this.current.command) {
        return true
      }

      return this.current.leftTicks >= this.current.command.left.ticks
    }

    _isRightDone = () => {
      if (!this.current.command) {
        return true
      }

      return this.current.rightTicks >= this.current.command.right.ticks
    }

    _isCurrentDone = () => {
      if (!this.current.command) {
        return true
      }

      return this._isLeftDone() && this._isRightDone()
    }

}

export default Motor
