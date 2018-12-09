
const move = (speed, pid, ticksToGo, direction) => {
    return {
        motor: {
            command: {
                move: {
                    speed,
                    ticks: ticksToGo,
                    p: pid.p,
                    i: pid.i,
                    d: pid.d,
                }
            }
        }
    };
}

const cameraAngle = (angle) => {
  return {
      type: 'CAMERA_ANGLE',
      value: {
          angle: angle
      }
  }
}

class Control {

    constructor(ws) {
        this.ws = ws
    }

    forward = (speed, pid, ticksToGo) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'FORWARD')))
    back = (speed, pid, ticksToGo) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'BACKWARD')))
    left = (speed, pid, ticksToGo) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'LEFT')))
    right = (speed, pid, ticksToGo) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'RIGHT')))
    stop = () => this.ws.send(JSON.stringify({
        type: 'STOP'
    }))
    setCameraAngle = angle => this.ws.send(JSON.stringify(cameraAngle(angle)))
    off = () => this.ws.send(JSON.stringify({
      type: 'OFF'
    }))
}

export default Control
