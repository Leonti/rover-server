type Pid = {
    p: number,
    i: number,
    d: number,
}

const move = (speed: number, pid: Pid, ticksToGo: number, direction: string) => {
    return {
        motor: {
            command: {
                move: {
                    speed,
                    direction,
                    ticks: ticksToGo,
                    p: pid.p,
                    i: pid.i,
                    d: pid.d,
                }
            }
        }
    };
}

const cameraAngle = (angle: number) => {
  return {
      type: 'CAMERA_ANGLE',
      value: {
          angle: angle
      }
  }
}

class Control {

    ws: WebSocket

    constructor(ws: WebSocket) {
        this.ws = ws
    }

    go = (speed: number, pid: Pid, ticksToGo: number, direction: string) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, direction)))
    forward = (speed: number, pid: Pid, ticksToGo: number) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'FORWARD')))
    back = (speed: number, pid: Pid, ticksToGo: number) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'BACKWARD')))
    left = (speed: number, pid: Pid, ticksToGo: number) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'LEFT')))
    right = (speed: number, pid: Pid, ticksToGo: number) => this.ws.send(JSON.stringify(move(speed, pid, ticksToGo, 'RIGHT')))
    stop = () => this.ws.send(JSON.stringify({
        type: 'STOP'
    }))
    setCameraAngle = (angle: number) => this.ws.send(JSON.stringify(cameraAngle(angle)))
    off = () => this.ws.send(JSON.stringify({
      type: 'OFF'
    }))
}

export default Control
